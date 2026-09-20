create table if not exists public.payments(
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  party_type text not null check(party_type in ('worker','contractor','supplier','other')),
  party_id uuid,
  amount numeric(14,2) not null check(amount >= 0),
  payment_date date not null default current_date,
  method text not null default 'cash',
  description text,
  created_by uuid references public.profiles(id),
  client_operation_id text,
  created_at timestamptz not null default now()
);
create unique index if not exists uq_payments_client_operation_id on public.payments(client_operation_id) where client_operation_id is not null;
create index if not exists idx_payments_project_id on public.payments(project_id);
create index if not exists idx_payments_party_id on public.payments(party_id);
alter table public.payments enable row level security;
drop policy if exists "project payments" on public.payments;
create policy "project payments" on public.payments
for all to authenticated
using(public.is_project_member(project_id))
with check(public.is_project_member(project_id) and (created_by is null or created_by=(select auth.uid())));

create or replace function public.record_payment(
  p_project_id uuid,
  p_party_type text,
  p_party_id uuid,
  p_amount numeric,
  p_payment_date date,
  p_method text,
  p_description text,
  p_operation_id text default null
)
returns uuid
language plpgsql
security invoker
set search_path=public
as $$
declare v_id uuid;
begin
  if (select auth.uid()) is null then raise exception 'AUTH_REQUIRED'; end if;
  if not public.is_project_member(p_project_id) then raise exception 'PROJECT_ACCESS_DENIED'; end if;
  if p_amount < 0 then raise exception 'INVALID_PAYMENT_AMOUNT'; end if;

  if p_operation_id is not null then
    select id into v_id from public.payments where client_operation_id=p_operation_id limit 1;
    if v_id is not null then return v_id; end if;
  end if;

  insert into public.payments(project_id,party_type,party_id,amount,payment_date,method,description,created_by,client_operation_id)
  values(p_project_id,p_party_type,p_party_id,p_amount,p_payment_date,p_method,p_description,(select auth.uid()),p_operation_id)
  returning id into v_id;
  return v_id;
end;
$$;
grant execute on function public.record_payment(uuid,text,uuid,numeric,date,text,text,text) to authenticated;