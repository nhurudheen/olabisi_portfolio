
-- Enum & roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "users can view their own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create policy "admins manage roles" on public.user_roles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- updated_at helper
create or replace function public.set_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "users view own profile" on public.profiles for select to authenticated using (auth.uid() = id or public.has_role(auth.uid(),'admin'));
create policy "users update own profile" on public.profiles for update to authenticated using (auth.uid() = id);
create policy "users insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();

-- profile auto-create
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name) values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Ebooks
create table public.ebooks (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  subtitle text,
  description text,
  price numeric(10,2) not null default 0,
  original_price numeric(10,2),
  cover_url text,
  pages int,
  badge text,
  is_free boolean not null default false,
  purchase_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.ebooks to anon, authenticated;
grant insert, update, delete on public.ebooks to authenticated;
grant all on public.ebooks to service_role;
alter table public.ebooks enable row level security;
create policy "anyone can read ebooks" on public.ebooks for select to anon, authenticated using (true);
create policy "admins manage ebooks" on public.ebooks for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger ebooks_updated_at before update on public.ebooks for each row execute function public.set_updated_at();

-- Services
create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  description text,
  price numeric(10,2) not null default 0,
  original_price numeric(10,2),
  is_free boolean not null default false,
  booking_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.services to anon, authenticated;
grant insert, update, delete on public.services to authenticated;
grant all on public.services to service_role;
alter table public.services enable row level security;
create policy "anyone can read services" on public.services for select to anon, authenticated using (true);
create policy "admins manage services" on public.services for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger services_updated_at before update on public.services for each row execute function public.set_updated_at();

-- Orders
create type public.order_type as enum ('ebook','service');
create type public.order_status as enum ('pending','paid','failed','cancelled');

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  type order_type not null,
  customer_first_name text,
  customer_last_name text,
  customer_email text not null,
  customer_phone text,
  items jsonb not null default '[]'::jsonb,
  service_id uuid references public.services(id) on delete set null,
  scheduled_date date,
  scheduled_time text,
  amount numeric(10,2) not null default 0,
  currency text not null default 'GBP',
  status order_status not null default 'pending',
  paystack_reference text unique,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.orders to anon, authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;
create policy "anyone can insert orders" on public.orders for insert to anon, authenticated with check (true);
create policy "admins read orders" on public.orders for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins update orders" on public.orders for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger orders_updated_at before update on public.orders for each row execute function public.set_updated_at();

-- Messages
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
grant insert on public.messages to anon, authenticated;
grant select, update, delete on public.messages to authenticated;
grant all on public.messages to service_role;
alter table public.messages enable row level security;
create policy "anyone can submit message" on public.messages for insert to anon, authenticated with check (true);
create policy "admins read messages" on public.messages for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins update messages" on public.messages for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admins delete messages" on public.messages for delete to authenticated using (public.has_role(auth.uid(),'admin'));
