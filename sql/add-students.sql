-- ============================================================================
--  ADD: private STUDENT RECORDS + BATCH YEARS  (Department Admin feature)
-- ----------------------------------------------------------------------------
--  HOW TO RUN
--    Supabase Dashboard -> SQL Editor -> New query -> paste this -> Run.
--
--  Safe to run more than once. It does NOT delete any student data.
--
--  Design
--    * student_batches — one row per admission year (e.g. 2025-2029) holding
--      the current semester for the whole group.
--    * students — one row per student, stored against the batch year.
--    Both tables are private: only the Department Admin and the Super Admin
--    can read or write them (no `anon` grant, no public read policy).
-- ============================================================================

create extension if not exists pgcrypto;

-- ---- 1. Batch years (admission years) --------------------------------------
create table if not exists public.student_batches (
  label            text primary key,
  current_semester integer not null default 1
                   check (current_semester between 1 and 8),
  created_at       timestamptz not null default now()
);

insert into public.student_batches (label) values
  ('2025-2029'), ('2026-2030')
on conflict (label) do nothing;

-- ---- 2. Students (linked to a batch year) ----------------------------------
create table if not exists public.students (
  id           uuid primary key default gen_random_uuid(),
  batch        text not null,
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

-- 2a. Remove the old `semester` column if an earlier version created it.
--     Students belong to a batch year now; the batch holds the semester.
alter table public.students drop column if exists semester;

-- 2b. Ensure every batch referenced by existing students exists.
insert into public.student_batches (label)
select distinct batch from public.students
where batch is not null
on conflict (label) do nothing;

-- 2c. Add the foreign key to the batch year (only if it is missing).
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'students_batch_fkey'
      and conrelid = 'public.students'::regclass
  ) then
    alter table public.students
      add constraint students_batch_fkey
      foreign key (batch) references public.student_batches (label)
      on update cascade on delete cascade;
  end if;
end $$;

create index if not exists students_batch_idx on public.students (batch);

-- ---- 3. Row Level Security: private to Department Admin (+ Super Admin) ----
alter table public.student_batches enable row level security;
alter table public.students enable row level security;

drop policy if exists "department manages student_batches" on public.student_batches;
create policy "department manages student_batches"
  on public.student_batches for all to authenticated
  using (public.admin_role() in ('department', 'superadmin'))
  with check (public.admin_role() in ('department', 'superadmin'));

drop policy if exists "department manages students" on public.students;
create policy "department manages students"
  on public.students for all to authenticated
  using (public.admin_role() in ('department', 'superadmin'))
  with check (public.admin_role() in ('department', 'superadmin'));

-- ---- 4. Grants: authenticated admins only (NOT anon / public) ---------------
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.student_batches to authenticated;
grant select, insert, update, delete on public.students to authenticated;
