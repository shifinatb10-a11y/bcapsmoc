-- ============================================================================
--  SUPER ADMIN  —  add a "superadmin" role that can manage EVERY section
-- ----------------------------------------------------------------------------
--  WHEN TO RUN
--    Run this once in Supabase -> SQL Editor if you have ALREADY run
--    sql/schema.sql and your database exists.
--
--    (If you have NOT run schema.sql yet, you do not need this file —
--     schema.sql already contains these Super Admin policies.)
--
--  WHAT IT DOES
--    1. Rebuilds the section security rules so a "superadmin" can read AND
--       write the department, association, club and study zone sections.
--    2. Shows you how to give an existing account the Super Admin role.
--
--  This script is safe to run more than once and will NOT delete any data.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Rebuild the row level security policies (public read + section writes)
-- ----------------------------------------------------------------------------
do $$
declare
  t text;
  r record;
  managed text[] := array[
    'faculty', 'admin_users', 'associations', 'association_reports',
    'clubs', 'club_events', 'study_materials', 'site_settings'
  ];
begin
  foreach t in array managed loop
    for r in
      select policyname from pg_policies
      where schemaname = 'public' and tablename = t
    loop
      execute format('drop policy %I on public.%I', r.policyname, t);
    end loop;
  end loop;
end $$;

-- ---- Public read access ----
create policy "public read faculty"
  on public.faculty for select using (true);

create policy "public read associations"
  on public.associations for select using (true);

create policy "public read association_reports"
  on public.association_reports for select using (true);

create policy "public read clubs"
  on public.clubs for select using (true);

create policy "public read club_events"
  on public.club_events for select using (true);

create policy "public read study_materials"
  on public.study_materials for select using (true);

create policy "public read site_settings"
  on public.site_settings for select using (true);

-- ---- Faculty: Super Admin only ----
create policy "superadmin writes faculty"
  on public.faculty for all to authenticated
  using (public.admin_role() = 'superadmin')
  with check (public.admin_role() = 'superadmin');

-- ---- Site settings: Super Admin only ----
create policy "superadmin writes site_settings"
  on public.site_settings for all to authenticated
  using (public.admin_role() = 'superadmin')
  with check (public.admin_role() = 'superadmin');

-- ---- Associations + reports: Association admin (+ Super Admin) ----
create policy "association writes associations"
  on public.associations for all to authenticated
  using (public.admin_role() in ('association', 'superadmin'))
  with check (public.admin_role() in ('association', 'superadmin'));

create policy "association writes association_reports"
  on public.association_reports for all to authenticated
  using (public.admin_role() in ('association', 'superadmin'))
  with check (public.admin_role() in ('association', 'superadmin'));

-- ---- Club + events: Club admin (+ Super Admin) ----
create policy "club writes clubs"
  on public.clubs for all to authenticated
  using (public.admin_role() in ('club', 'superadmin'))
  with check (public.admin_role() in ('club', 'superadmin'));

create policy "club writes club_events"
  on public.club_events for all to authenticated
  using (public.admin_role() in ('club', 'superadmin'))
  with check (public.admin_role() in ('club', 'superadmin'));

-- ---- Study materials: Study Zone admin (+ Super Admin) ----
create policy "studyzone writes study_materials"
  on public.study_materials for all to authenticated
  using (public.admin_role() in ('studyzone', 'superadmin'))
  with check (public.admin_role() in ('studyzone', 'superadmin'));

-- ---- Admin users: each admin reads their own row; only Super Admin sees/edits the team ----
create policy "admins read own admin_users row"
  on public.admin_users for select to authenticated
  using (public.user_id = auth.uid() or public.admin_role() = 'superadmin');

create policy "superadmin manages admin_users"
  on public.admin_users for all to authenticated
  using (public.admin_role() = 'superadmin')
  with check (public.admin_role() = 'superadmin');

-- ----------------------------------------------------------------------------
-- 1b. Guard: only a Super Admin may grant the Super Admin role
--     (requests with no signed-in user — SQL Editor / service role — pass,
--      so you can always create the first Super Admin here).
-- ----------------------------------------------------------------------------
create or replace function public.guard_admin_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null
     and (new.role = 'superadmin'
          or (tg_op = 'UPDATE' and old.role = 'superadmin'))
     and public.admin_role() is distinct from 'superadmin' then
    raise exception 'Only a Super Admin can grant or remove the Super Admin role.';
  end if;
  return new;
end $$;

drop trigger if exists guard_admin_role_trg on public.admin_users;
create trigger guard_admin_role_trg
  before insert or update on public.admin_users
  for each row execute function public.guard_admin_role();

-- ============================================================================
-- 2. GIVE AN ACCOUNT THE SUPER ADMIN ROLE
-- ----------------------------------------------------------------------------
--  First create the login in  Authentication -> Users -> Add user
--  (turn "Auto Confirm User" ON), then run ONE of these.
-- ============================================================================

-- Option A — promote an existing admin by email (replace the email):
-- update public.admin_users
-- set role = 'superadmin'
-- where email = 'superadmin.admin@psmoc.edu';

-- Option B — register a brand-new auth user as Super Admin by email:
-- insert into public.admin_users (user_id, email, role)
-- select id, email, 'superadmin'
-- from auth.users
-- where email = 'superadmin.admin@psmoc.edu'
-- on conflict (user_id) do update set role = excluded.role;

-- Check the result:
-- select user_id, email, role from public.admin_users order by role;
-- ============================================================================
