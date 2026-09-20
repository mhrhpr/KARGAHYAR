create index if not exists idx_material_transactions_created_by on public.material_transactions(created_by);
create index if not exists idx_payments_created_by on public.payments(created_by);

create or replace function public.refresh_material_low_stock_alert()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
declare
  alert_type text := 'low_stock:' || new.id::text;
begin
  if new.current_stock <= new.reorder_point then
    if not exists (
      select 1 from public.alerts
      where project_id=new.project_id and type=alert_type and status='open'
    ) then
      insert into public.alerts(project_id,type,message,status)
      values(
        new.project_id,
        alert_type,
        'موجودی ' || new.name || ' به ' || new.current_stock::text || ' ' || new.unit ||
        ' رسیده و به حد سفارش ' || new.reorder_point::text || ' رسیده یا کمتر شده است.',
        'open'
      );
    end if;
  else
    update public.alerts
    set status='resolved'
    where project_id=new.project_id and type=alert_type and status='open';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_material_low_stock on public.materials;
create trigger trg_material_low_stock
after insert or update of current_stock, reorder_point
on public.materials
for each row
execute function public.refresh_material_low_stock_alert();

revoke execute on function public.refresh_material_low_stock_alert() from public,anon,authenticated;