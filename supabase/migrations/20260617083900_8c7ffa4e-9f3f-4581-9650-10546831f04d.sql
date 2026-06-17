
-- 1. Add 'meeting' to order_type enum
alter type public.order_type add value if not exists 'meeting';

-- 2. Category enum and columns
do $$ begin
  if not exists (select 1 from pg_type where typname = 'category_type') then
    create type public.category_type as enum ('business','career');
  end if;
end $$;

alter table public.ebooks add column if not exists category public.category_type not null default 'business';
alter table public.services add column if not exists category public.category_type not null default 'business';

-- 3. Order fields for meetings
alter table public.orders add column if not exists duration_minutes int;
alter table public.orders add column if not exists purpose text;

-- 4. Meeting prices table
create table if not exists public.meeting_prices (
  id uuid primary key default gen_random_uuid(),
  duration_minutes int not null,
  price numeric(10,2) not null default 0,
  original_price numeric(10,2),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.meeting_prices to anon, authenticated;
grant insert, update, delete on public.meeting_prices to authenticated;
grant all on public.meeting_prices to service_role;
alter table public.meeting_prices enable row level security;

drop policy if exists "anyone can read meeting prices" on public.meeting_prices;
create policy "anyone can read meeting prices" on public.meeting_prices for select to anon, authenticated using (true);
drop policy if exists "admins manage meeting prices" on public.meeting_prices;
create policy "admins manage meeting prices" on public.meeting_prices for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

drop trigger if exists meeting_prices_updated_at on public.meeting_prices;
create trigger meeting_prices_updated_at before update on public.meeting_prices for each row execute function public.set_updated_at();

-- Seed some defaults
insert into public.meeting_prices (duration_minutes, price, original_price)
select 30, 25, 50 where not exists (select 1 from public.meeting_prices);
insert into public.meeting_prices (duration_minutes, price, original_price)
select 60, 50, 100 where (select count(*) from public.meeting_prices) < 2;
