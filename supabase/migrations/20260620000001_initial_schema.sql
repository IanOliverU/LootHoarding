create extension if not exists pgcrypto with schema extensions;

create type public.product_rarity as enum ('rare', 'epic', 'legendary');
create type public.order_status as enum ('confirmed', 'preparing', 'in_transit', 'mishap', 'arriving', 'delivered');

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category_id uuid not null references public.categories(id) on delete restrict,
  name text not null,
  brand text not null,
  rarity public.product_rarity not null default 'rare',
  display_price numeric(12,2) not null check (display_price >= 0),
  description text not null default '',
  specs jsonb not null default '{}'::jsonb check (jsonb_typeof(specs) = 'object'),
  images text[] not null default '{}',
  is_live boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  is_live boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.collection_products (
  collection_id uuid not null references public.collections(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  sort_order integer not null default 0,
  primary key (collection_id, product_id)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  tracking_token text not null unique,
  shipping jsonb not null check (jsonb_typeof(shipping) = 'object'),
  items jsonb not null check (jsonb_typeof(items) = 'array'),
  payment_summary jsonb not null default '{}'::jsonb check (jsonb_typeof(payment_summary) = 'object'),
  actual_total numeric(12,2) not null default 0 check (actual_total = 0),
  status public.order_status not null default 'confirmed',
  destination_lat double precision,
  destination_lng double precision,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.mishap_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  mishap_type text not null,
  event_text text not null,
  triggered_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index products_category_id_idx on public.products(category_id);
create index products_live_idx on public.products(is_live) where is_live = true;
create index orders_tracking_token_idx on public.orders(tracking_token);
create index orders_created_at_idx on public.orders(created_at desc);
create index mishap_events_order_id_idx on public.mishap_events(order_id, triggered_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_set_updated_at before update on public.products
for each row execute function public.set_updated_at();
create trigger collections_set_updated_at before update on public.collections
for each row execute function public.set_updated_at();
create trigger orders_set_updated_at before update on public.orders
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.collections enable row level security;
alter table public.collection_products enable row level security;
alter table public.orders enable row level security;
alter table public.mishap_events enable row level security;
alter table public.admin_users enable row level security;

create policy "categories are publicly readable" on public.categories for select using (true);
create policy "live products are publicly readable" on public.products for select using (is_live or public.is_admin());
create policy "live collections are publicly readable" on public.collections for select using (is_live or public.is_admin());
create policy "live collection products are publicly readable" on public.collection_products for select using (
  exists (select 1 from public.collections where id = collection_id and (is_live or public.is_admin()))
);

create policy "admins manage categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage products" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage collections" on public.collections for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage collection products" on public.collection_products for all using (public.is_admin()) with check (public.is_admin());
create policy "admins read orders" on public.orders for select using (public.is_admin());
create policy "admins update orders" on public.orders for update using (public.is_admin()) with check (public.is_admin());
create policy "admins manage mishaps" on public.mishap_events for all using (public.is_admin()) with check (public.is_admin());
create policy "admins read admin membership" on public.admin_users for select using (public.is_admin());

insert into public.categories (slug, name, sort_order) values
  ('gaming-pcs', 'Gaming PCs', 1),
  ('graphics-cards', 'Graphics Cards', 2),
  ('consoles-handhelds', 'Consoles & Handhelds', 3),
  ('pc-components', 'PC Components', 4),
  ('gaming-peripherals', 'Gaming Peripherals', 5),
  ('monitors-displays', 'Monitors & Displays', 6),
  ('laptops-tablets', 'Laptops & Tablets', 7),
  ('audio-streaming', 'Audio & Streaming', 8),
  ('desk-setup', 'Desk Setup', 9),
  ('tech-accessories', 'Tech Accessories', 10)
on conflict (slug) do update set name = excluded.name, sort_order = excluded.sort_order;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 26214400, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;

create policy "product images are publicly readable" on storage.objects
for select using (bucket_id = 'product-images');
create policy "admins upload product images" on storage.objects
for insert to authenticated with check (bucket_id = 'product-images' and public.is_admin());
create policy "admins update product images" on storage.objects
for update to authenticated using (bucket_id = 'product-images' and public.is_admin()) with check (bucket_id = 'product-images' and public.is_admin());
create policy "admins delete product images" on storage.objects
for delete to authenticated using (bucket_id = 'product-images' and public.is_admin());
