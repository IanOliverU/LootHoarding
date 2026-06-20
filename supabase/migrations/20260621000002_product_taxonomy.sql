alter table public.products
  add column if not exists subcategory text not null default '',
  add column if not exists attributes text[] not null default '{}';

create index if not exists products_subcategory_idx on public.products(category_id, subcategory);

comment on column public.products.subcategory is
  'Premium-only second-level product grouping from loothoarding-category-taxonomy.md.';

comment on column public.products.attributes is
  'Filterable taxonomy traits such as panel type, switch technology, cooling design, and form factor.';
