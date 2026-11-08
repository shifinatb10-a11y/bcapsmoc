-- Secure quiz answer keys: public clients receive question text/options only.
-- Apply in Supabase SQL Editor after reviewing the migration.
begin;

-- The base table must no longer be readable by anonymous visitors.
drop policy if exists "public read quizzes" on public.quizzes;
drop policy if exists "studyzone manages quizzes" on public.quizzes;
drop policy if exists "studyzone writes quizzes" on public.quizzes;

create policy "studyzone reads and manages quizzes"
  on public.quizzes for all to authenticated
  using (public.admin_role() in ('studyzone', 'superadmin'))
  with check (public.admin_role() in ('studyzone', 'superadmin'));

revoke all on public.quizzes from anon;
grant select, insert, update, delete on public.quizzes to authenticated;

-- A view exposes no answer key. It runs with the view owner's privileges,
-- intentionally bypassing the base-table RLS only for this fixed projection.
create or replace view public.quizzes_public
with (security_barrier = true)
as
select
  id, title, semester, subject, description, duration_minutes, quiz_url,
  coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'id', q.value->>'id',
        'question', q.value->>'question',
        'options', q.value->'options'
      ) order by q.ordinality
    )
    from jsonb_array_elements(coalesce(quizzes.questions, '[]'::jsonb))
      with ordinality as q(value, ordinality)
  ), '[]'::jsonb) as questions,
  display_order, created_at
from public.quizzes;

grant select on public.quizzes_public to anon, authenticated;

-- Scoring is performed inside PostgreSQL; the answer key never goes to the browser
-- until the attempt is submitted. Result review is returned after grading.
create or replace function public.grade_quiz(p_quiz_id uuid, p_answers jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  quiz_row public.quizzes%rowtype;
  q jsonb;
  idx integer := 0;
  selected integer;
  correct integer;
  total integer := 0;
  score integer := 0;
  review jsonb := '[]'::jsonb;
begin
  if jsonb_typeof(p_answers) <> 'object' then
    raise exception 'Answers must be a JSON object';
  end if;

  select * into quiz_row from public.quizzes where id = p_quiz_id;
  if not found then raise exception 'Quiz not found'; end if;

  for q in select value from jsonb_array_elements(quiz_row.questions)
  loop
    total := total + 1;
    selected := null;
    if p_answers ? idx::text then
      begin
        selected := (p_answers->>idx::text)::integer;
      exception when others then
        raise exception 'Invalid answer for question %', idx + 1;
      end;
    end if;

    correct := (q->>'correct_option')::integer;
    if selected is not null and (selected < 0 or selected >= jsonb_array_length(q->'options')) then
      raise exception 'Answer option out of range';
    end if;
    if selected = correct then score := score + 1; end if;

    review := review || jsonb_build_array(jsonb_build_object(
      'selected_option', selected,
      'correct_option', correct,
      'explanation', q->>'explanation'
    ));
    idx := idx + 1;
  end loop;

  return jsonb_build_object(
    'score', score,
    'total', total,
    'percentage', case when total = 0 then 0 else round(score * 100.0 / total) end,
    'review', review
  );
end;
$$;

revoke all on function public.grade_quiz(uuid, jsonb) from public;
grant execute on function public.grade_quiz(uuid, jsonb) to anon, authenticated;

commit;
