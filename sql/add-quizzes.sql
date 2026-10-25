-- ============================================================================
--  ADD: SUBJECT QUIZZES by SEMESTER  (Study Zone feature)
-- ----------------------------------------------------------------------------
--  HOW TO RUN
--    Supabase Dashboard -> SQL Editor -> New query -> paste this -> Run.
--
--  Safe to run more than once. It will NOT delete existing data.
-- ============================================================================

create extension if not exists pgcrypto;

-- 1. Create table if it doesn't exist
create table if not exists public.quizzes (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  semester         text not null,
  subject          text not null,
  description      text,
  duration_minutes integer,
  quiz_url         text,
  questions        jsonb not null default '[]'::jsonb,
  display_order    integer not null default 0,
  created_at       timestamptz not null default now()
);

-- 2. Ensure all columns exist even if the table already existed previously
alter table public.quizzes add column if not exists title            text;
alter table public.quizzes add column if not exists semester         text;
alter table public.quizzes add column if not exists subject          text;
alter table public.quizzes add column if not exists description      text;
alter table public.quizzes add column if not exists duration_minutes integer;
alter table public.quizzes add column if not exists quiz_url         text;
alter table public.quizzes add column if not exists questions        jsonb not null default '[]'::jsonb;
alter table public.quizzes add column if not exists display_order    integer not null default 0;
alter table public.quizzes add column if not exists created_at       timestamptz not null default now();

create index if not exists quizzes_semester_idx on public.quizzes (semester);
create index if not exists quizzes_subject_idx on public.quizzes (subject);

-- ---- Row Level Security ----
alter table public.quizzes enable row level security;

-- Everyone (public / anon) can view quizzes
drop policy if exists "public read quizzes" on public.quizzes;
create policy "public read quizzes"
  on public.quizzes for select using (true);

-- Study Zone Admin and Super Admin can manage quizzes
drop policy if exists "studyzone manages quizzes" on public.quizzes;
create policy "studyzone manages quizzes"
  on public.quizzes for all to authenticated
  using (public.admin_role() in ('studyzone', 'superadmin'))
  with check (public.admin_role() in ('studyzone', 'superadmin'));

drop policy if exists "studyzone writes quizzes" on public.quizzes;
create policy "studyzone writes quizzes"
  on public.quizzes for all to authenticated
  using (public.admin_role() in ('studyzone', 'superadmin'))
  with check (public.admin_role() in ('studyzone', 'superadmin'));

-- ---- Grants ----
grant select on public.quizzes to anon, authenticated;
grant select, insert, update, delete on public.quizzes to authenticated;

-- ---- Sample Initial Quizzes (Only inserted if table has no rows) ----
do $$
begin
  if not exists (select 1 from public.quizzes) then
    insert into public.quizzes (title, semester, subject, description, duration_minutes, questions)
    values
    (
      'C Programming Fundamentals Quiz',
      'Semester 1',
      'Problem Solving using C',
      'Test your knowledge on C syntax, data types, control flow, and pointers.',
      15,
      '[
        {
          "id": "q1",
          "question": "Which of the following is not a valid C variable name?",
          "options": ["int_number", "2variable", "_count", "myVar"],
          "correct_option": 1,
          "explanation": "Variable names in C cannot start with a digit."
        },
        {
          "id": "q2",
          "question": "What is the format specifier used to print an integer in C?",
          "options": ["%f", "%c", "%d", "%s"],
          "correct_option": 2,
          "explanation": "%d or %i is used as the format specifier for signed decimal integers in C."
        },
        {
          "id": "q3",
          "question": "Which header file is required to use printf() and scanf() in C?",
          "options": ["<stdlib.h>", "<stdio.h>", "<conio.h>", "<math.h>"],
          "correct_option": 1,
          "explanation": "Standard Input Output header <stdio.h> declares standard I/O functions like printf and scanf."
        },
        {
          "id": "q4",
          "question": "What does the operator ''*'' represent when used before a pointer variable?",
          "options": ["Address operator", "Dereference operator", "Multiplication only", "Memory allocation"],
          "correct_option": 1,
          "explanation": "When used with a pointer, * is the dereference operator to access the value stored at the memory address."
        }
      ]'::jsonb
    ),
    (
      'Data Structures & Algorithms - Stacks and Queues',
      'Semester 2',
      'Data Structures',
      'Practice core concepts of LIFO and FIFO abstract data types.',
      15,
      '[
        {
          "id": "q1",
          "question": "Which data structure follows the LIFO (Last In First Out) principle?",
          "options": ["Queue", "Stack", "Binary Tree", "Linked List"],
          "correct_option": 1,
          "explanation": "A Stack works on the Last In First Out (LIFO) principle."
        },
        {
          "id": "q2",
          "question": "Which operation is used to insert an element into a stack?",
          "options": ["Push", "Pop", "Enqueue", "Dequeue"],
          "correct_option": 0,
          "explanation": "Push adds an item to the top of the stack."
        },
        {
          "id": "q3",
          "question": "What is the time complexity to pop an element from a stack implemented with an array?",
          "options": ["O(n)", "O(log n)", "O(1)", "O(n^2)"],
          "correct_option": 2,
          "explanation": "Popping from the top of an array stack takes constant time O(1)."
        }
      ]'::jsonb
    ),
    (
      'Database Management Systems - SQL Basics',
      'Semester 3',
      'Database Management Systems',
      'Test your knowledge on relational schemas, DDL, DML and constraints.',
      15,
      '[
        {
          "id": "q1",
          "question": "Which SQL command is used to retrieve data from a database?",
          "options": ["FETCH", "GET", "SELECT", "RETRIEVE"],
          "correct_option": 2,
          "explanation": "The SELECT statement is used to query and retrieve data from a database."
        },
        {
          "id": "q2",
          "question": "Which constraint uniquely identifies each record in a database table?",
          "options": ["FOREIGN KEY", "UNIQUE", "PRIMARY KEY", "CHECK"],
          "correct_option": 2,
          "explanation": "PRIMARY KEY uniquely identifies each record and does not allow NULL values."
        }
      ]'::jsonb
    );
  end if;
end $$;
