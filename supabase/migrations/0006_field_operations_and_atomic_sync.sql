alter table public.projects add column if not exists client_name text;
alter table public.projects add column if not exists manager_name text;
alter table public.projects add column if not exists start_date date;
alter table public.projects add column if not exists end_date date;
alter table public.projects add column if not exists settings jsonb not null default '{}'::jsonb;

alter table public.daily_reports add column if not exists day_status text not null default 'work';

create table if not exists public.expenses(
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  expense_date date not null default current_date,
  category text not null,
  description text,
  amount numeric(14,2) not null check(amount >= 0),
  created_by uuid references public.profiles(id),
  client_operation_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.material_transactions(
  id uuid primary key default gen_random_uuid(),
  material_id uuid not null references public.materials(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  transaction_type text not null check(transaction_type in ('in','out','adjustment')),
  quantity numeric(14,3) not null check(quantity >= 0),
  unit_cost numeric(14,2) not null default 0,
  note text,
  transaction_date date not null default current_date,
  created_by uuid references public.profiles(id),
  client_operation_id text,
  created_at timestamptz not null default now()
);

create unique index if not exists uq_expenses_client_operation_id
  on public.expenses(client_operation_id) where client_operation_id is not null;

create unique index if not exists uq_material_tx_client_operation_id
  on public.material_transactions(client_operation_id) where client_operation_id is not null;

create index if not exists idx_expenses_project_id on public.expenses(project_id);
create index if not exists idx_expenses_created_by on public.expenses(created_by);
create index if not exists idx_material_transactions_material_id on public.material_transactions(material_id);
create index if not exists idx_material_transactions_project_id on public.material_transactions(project_id);

alter table public.expenses enable row level security;
alter table public.material_transactions enable row level security;

drop policy if exists "project expenses" on public.expenses;
create policy "project expenses" on public.expenses
for all to authenticated
using (public.is_project_member(project_id))
with check (public.is_project_member(project_id) and (created_by is null or created_by = (select auth.uid())));

drop policy if exists "project material transactions" on public.material_transactions;
create policy "project material transactions" on public.material_transactions
for all to authenticated
using (public.is_project_member(project_id))
with check (public.is_project_member(project_id) and (created_by is null or created_by = (select auth.uid())));

create or replace function public.record_worker_daily_entry(
  p_project_id uuid,
  p_report_date date,
  p_worker_id uuid,
  p_attendance_factor numeric,
  p_overtime_hours numeric default 0,
  p_overtime_amount numeric default 0,
  p_advance numeric default 0,
  p_payable numeric default 0,
  p_operation_id text default null
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_report_id uuid;
  v_existing_report uuid;
begin
  if (auth.uid() is null) then raise exception 'AUTH_REQUIRED'; end if;
  if not public.is_project_member(p_project_id) then raise exception 'PROJECT_ACCESS_DENIED'; end if;
  if not exists (select 1 from public.workers where id=p_worker_id and project_id=p_project_id) then
    raise exception 'WORKER_PROJECT_MISMATCH';
  end if;
  if p_attendance_factor not in (0,0.5,1) then raise exception 'INVALID_ATTENDANCE'; end if;

  if p_operation_id is not null then
    select report_id into v_existing_report
    from public.worker_entries
    where client_operation_id = p_operation_id
    limit 1;
    if v_existing_report is not null then return v_existing_report; end if;
  end if;

  insert into public.daily_reports(project_id, report_date, status, day_status, created_by)
  values(p_project_id,p_report_date,'complete','work',auth.uid())
  on conflict(project_id,report_date)
  do update set updated_at=now()
  returning id into v_report_id;

  insert into public.worker_entries(
    report_id, worker_id, attendance_factor, overtime_hours,
    overtime_amount, advance, payable, client_operation_id
  )
  values(
    v_report_id, p_worker_id, p_attendance_factor, p_overtime_hours,
    p_overtime_amount, p_advance, p_payable, p_operation_id
  )
  on conflict(report_id,worker_id)
  do update set
    attendance_factor=excluded.attendance_factor,
    overtime_hours=excluded.overtime_hours,
    overtime_amount=excluded.overtime_amount,
    advance=excluded.advance,
    payable=excluded.payable,
    client_operation_id=coalesce(excluded.client_operation_id,worker_entries.client_operation_id);

  return v_report_id;
end;
$$;

create or replace function public.record_contractor_daily_entry(
  p_project_id uuid,
  p_report_date date,
  p_contractor_id uuid,
  p_quantity numeric,
  p_unit_rate numeric,
  p_amount numeric,
  p_operation_id text default null
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_report_id uuid;
  v_existing_report uuid;
begin
  if (select auth.uid()) is null then raise exception 'AUTH_REQUIRED'; end if;
  if not public.is_project_member(p_project_id) then raise exception 'PROJECT_ACCESS_DENIED'; end if;
  if not exists (select 1 from public.contractors where id=p_contractor_id and project_id=p_project_id) then
    raise exception 'CONTRACTOR_PROJECT_MISMATCH';
  end if;
  if p_quantity < 0 or p_unit_rate < 0 or p_amount < 0 then raise exception 'INVALID_CONTRACTOR_AMOUNT'; end if;

  if p_operation_id is not null then
    select report_id into v_existing_report
    from public.contractor_entries
    where client_operation_id = p_operation_id
    limit 1;
    if v_existing_report is not null then return v_existing_report; end if;
  end if;

  insert into public.daily_reports(project_id, report_date, status, day_status, created_by)
  values(p_project_id,p_report_date,'complete','work',(select auth.uid()))
  on conflict(project_id,report_date)
  do update set updated_at=now()
  returning id into v_report_id;

  insert into public.contractor_entries(
    report_id, contractor_id, quantity, unit_rate, amount, client_operation_id
  )
  values(v_report_id,p_contractor_id,p_quantity,p_unit_rate,p_amount,p_operation_id);

  return v_report_id;
exception
  when unique_violation then
    select report_id into v_existing_report
    from public.contractor_entries
    where client_operation_id = p_operation_id
    limit 1;
    if v_existing_report is not null then return v_existing_report; end if;
    raise;
end;
$$;

create or replace function public.record_expense(
  p_project_id uuid,
  p_expense_date date,
  p_category text,
  p_description text,
  p_amount numeric,
  p_operation_id text default null
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare v_id uuid;
begin
  if (select auth.uid()) is null then raise exception 'AUTH_REQUIRED'; end if;
  if not public.is_project_member(p_project_id) then raise exception 'PROJECT_ACCESS_DENIED'; end if;
  if p_amount < 0 then raise exception 'INVALID_EXPENSE_AMOUNT'; end if;

  if p_operation_id is not null then
    select id into v_id from public.expenses where client_operation_id=p_operation_id limit 1;
    if v_id is not null then return v_id; end if;
  end if;

  insert into public.expenses(project_id,expense_date,category,description,amount,created_by,client_operation_id)
  values(p_project_id,p_expense_date,p_category,p_description,p_amount,(select auth.uid()),p_operation_id)
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.record_material_transaction(
  p_project_id uuid,
  p_material_id uuid,
  p_transaction_type text,
  p_quantity numeric,
  p_unit_cost numeric default 0,
  p_note text default null,
  p_transaction_date date default current_date,
  p_operation_id text default null
)
returns numeric
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_stock numeric;
  v_id uuid;
  v_delta numeric;
begin
  if (select auth.uid()) is null then raise exception 'AUTH_REQUIRED'; end if;
  if not public.is_project_member(p_project_id) then raise exception 'PROJECT_ACCESS_DENIED'; end if;
  if not exists(select 1 from public.materials where id=p_material_id and project_id=p_project_id) then raise exception 'MATERIAL_PROJECT_MISMATCH'; end if;
  if p_quantity < 0 or p_unit_cost < 0 then raise exception 'INVALID_MATERIAL_QUANTITY'; end if;
  if p_transaction_type not in ('in','out','adjustment') then raise exception 'INVALID_MATERIAL_TRANSACTION'; end if;

  if p_operation_id is not null then
    select id into v_id from public.material_transactions where client_operation_id=p_operation_id limit 1;
    if v_id is not null then
      select current_stock into v_stock from public.materials where id=p_material_id;
      return v_stock;
    end if;
  end if;

  v_delta := case when p_transaction_type='in' then p_quantity when p_transaction_type='out' then -p_quantity else p_quantity end;

  update public.materials
  set current_stock = case
    when p_transaction_type='adjustment' then p_quantity
    else greatest(0,current_stock + v_delta)
  end,
  updated_at=now()
  where id=p_material_id
  returning current_stock into v_stock;

  insert into public.material_transactions(
    material_id,project_id,transaction_type,quantity,unit_cost,note,transaction_date,created_by,client_operation_id
  )
  values(p_material_id,p_project_id,p_transaction_type,p_quantity,p_unit_cost,p_note,p_transaction_date,(select auth.uid()),p_operation_id);

  return v_stock;
end;
$$;

grant execute on function public.record_worker_daily_entry(uuid,date,uuid,numeric,numeric,numeric,numeric,numeric,text) to authenticated;
grant execute on function public.record_contractor_daily_entry(uuid,date,uuid,numeric,numeric,numeric,text) to authenticated;
grant execute on function public.record_expense(uuid,date,text,text,numeric,text) to authenticated;
grant execute on function public.record_material_transaction(uuid,uuid,text,numeric,numeric,text,date,text) to authenticated;
