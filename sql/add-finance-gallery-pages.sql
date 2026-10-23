-- ============================================================================
--  BCA Department Website — Finance, Gallery & Pages migration
-- ----------------------------------------------------------------------------
--  HOW TO RUN
--  1. Open your Supabase project  (project ref: mtvokalfbvgqpeqwrgle).
--  2. Go to  SQL Editor  ->  New query.
--  3. Paste this entire file and click  Run.
--
--  This script is safe to run more than once (idempotent) and never deletes
--  existing data. It adds:
--    * the Finance ledger table          (private)
--    * the Gallery table                 (public)
--    * the page visibility switches      (public read, Super Admin write)
--    * the new 'finance' and 'media' admin roles (no schema change needed —
--      roles are stored as text, so nothing extra is required)
--    * the corrected "admins read own admin_users row" policy
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- 1. FINANCE LEDGER  (private — never shown on the public website)
-- ----------------------------------------------------------------------------
create table if not exists public.transactions (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  kind             text not null default 'income'
                   check (kind in ('income', 'expense')),
  amount           numeric(12,2) not null default 0,
  category         text,
  transaction_date date,
  reference        text,
  description      text,
  created_at       timestamptz not null default now()
);

create index if not exists transactions_date_idx
  on public.transactions (transaction_date desc);

-- ----------------------------------------------------------------------------
-- 2. GALLERY  (public images + videos)
-- ----------------------------------------------------------------------------
create table if not exists public.gallery_items (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  media_type    text not null default 'image'
                check (media_type in ('image', 'video')),
  url           text not null,
  thumbnail_url text,
  description   text,
  display_order integer not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists gallery_items_order_idx
  on public.gallery_items (display_order);

-- ----------------------------------------------------------------------------
-- 3. PAGE VISIBILITY  (Super Admin show/hide switches per page)
-- ----------------------------------------------------------------------------
create table if not exists public.page_visibility (
  page           text primary key,
  public_visible boolean not null default true,
  admin_visible  boolean not null default true,
  updated_at     timestamptz not null default now()
);

insert into public.page_visibility (page) values
  ('home'), ('department'), ('association'), ('club'), ('study-zone'),
  ('gallery'), ('finance'), ('team'), ('settings')
on conflict (page) do nothing;

-- ----------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------
alter table public.transactions    enable row level security;
alter table public.gallery_items   enable row level security;
alter table public.page_visibility enable row level security;

-- Finance ledger: Department & Association admins may read; Finance writes.
drop policy if exists "finance team reads transactions" on public.transactions;
create policy "finance team reads transactions"
  on public.transactions for select to authenticated
  using (
    public.admin_role() in ('department', 'association', 'finance', 'superadmin')
  );

drop policy if exists "finance admin writes transactions" on public.transactions;
create policy "finance admin writes transactions"
  on public.transactions for all to authenticated
  using (public.admin_role() in ('finance', 'superadmin'))
  with check (public.admin_role() in ('finance', 'superadmin'));

-- Gallery: public read; Media admin (+ Super Admin) writes.
drop policy if exists "public read gallery_items" on public.gallery_items;
create policy "public read gallery_items"
  on public.gallery_items for select using (true);

drop policy if exists "media admin writes gallery_items" on public.gallery_items;
create policy "media admin writes gallery_items"
  on public.gallery_items for all to authenticated
  using (public.admin_role() in ('media', 'superadmin'))
  with check (public.admin_role() in ('media', 'superadmin'));

-- Page visibility: everyone reads; only the Super Admin writes.
drop policy if exists "public read page_visibility" on public.page_visibility;
create policy "public read page_visibility"
  on public.page_visibility for select using (true);

drop policy if exists "superadmin writes page_visibility" on public.page_visibility;
create policy "superadmin writes page_visibility"
  on public.page_visibility for all to authenticated
  using (public.admin_role() = 'superadmin')
  with check (public.admin_role() = 'superadmin');

-- Re-affirm the corrected admin_users read policy (bare user_id column).
drop policy if exists "admins read own admin_users row" on public.admin_users;
create policy "admins read own admin_users row"
  on public.admin_users for select to authenticated
  using (user_id = auth.uid() or public.admin_role() = 'superadmin');

-- ----------------------------------------------------------------------------
-- 5. GRANTS
-- ----------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;

grant select on
  public.gallery_items,
  public.page_visibility
to anon, authenticated;

grant select, insert, update, delete on
  public.transactions,
  public.gallery_items,
  public.page_visibility
to authenticated;

-- ============================================================================
--  Done. Next steps (see README):
--   1. Create the Finance and Media login accounts in
--      Authentication -> Users, then register their roles:
--
--        insert into public.admin_users (user_id, email, role)
--        select id, email, 'finance' from auth.users
--        where email = 'finance.admin@psmoc.edu'
--        on conflict (user_id) do update set role = excluded.role;
--
--        insert into public.admin_users (user_id, email, role)
--        select id, email, 'media' from auth.users
--        where email = 'media.admin@psmoc.edu'
--        on conflict (user_id) do update set role = excluded.role;
--
--   2. Open the website's  /admin/pages  screen to show or hide pages.
-- ============================================================================
