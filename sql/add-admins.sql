-- ============================================================================
--  ADD ADMINISTRATORS  (run this in Supabase -> SQL Editor)
-- ----------------------------------------------------------------------------
--  STEP 1: First create the login accounts
--          Supabase Dashboard -> Authentication -> Users -> "Add user"
--          Enter an email + a password YOU choose (Supabase stores it hashed).
--
--  STEP 2: Change the emails below to match the accounts you created,
--          then run this whole file. It links each account to its role.
--
--  Roles: 'superadmin' | 'department' | 'association' | 'club' | 'studyzone'
--         ('superadmin' can manage every section.)
-- ============================================================================

insert into public.admin_users (user_id, email, role)
select u.id, u.email, r.role
from auth.users u
join (
  values
    ('superadmin.admin@psmoc.edu',  'superadmin'),
    ('department.admin@psmoc.edu',  'department'),
    ('association.admin@psmoc.edu', 'association'),
    ('club.admin@psmoc.edu',        'club'),
    ('studyzone.admin@psmoc.edu',   'studyzone')
) as r(mail, role)
  on u.email = r.mail
on conflict (user_id) do update
  set role  = excluded.role,
      email = excluded.email;

-- Check the result (should list 5 rows):
-- select user_id, email, role from public.admin_users order by role;
