-- ============================================================================
--  ADD: private STUDENT RECORDS  (Department Admin feature)
-- ----------------------------------------------------------------------------
--  HOW TO RUN
--    Supabase Dashboard -> SQL Editor -> New query -> paste this -> Run.
--
--  Safe to run more than once. It does NOT delete any existing data.
--  Creates a private `students` table that is readable and writable ONLY by
--  the Department Admin and the Super Admin. The public website can never
--  read it (no `anon` grant and no public read policy).
-- ============================================================================

create extension if not exists pgcrypto;

-- A student record, grouped by batch year (e.g. 2025-2029) and semester (1-8).
create table if not exists public.students (
  id           uuid primary key default gen_random_uuid(),
  batch        text not null,
  semester     integer not null check (semester between 1 and 8),
  roll_no      text,
  admission_no text,
  register_no  text,
  apaar_id     text,
  name         text not null,
  gender       text,
  dob          date,
  mobile       text,
  email        text,
  created_at   timestamptz not null default now()
);

create index if not exists students_batch_semester_idx
  on public.students (batch, semester);

-- ---- Row Level Security: private to Department Admin (+ Super Admin) ----
alter table public.students enable row level security;

drop policy if exists "department manages students" on public.students;
create policy "department manages students"
  on public.students for all to authenticated
  using (public.admin_role() in ('department', 'superadmin'))
  with check (public.admin_role() in ('department', 'superadmin'));

-- ---- Grants: authenticated admins only (NOT anon / public) ----
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.students to authenticated;
