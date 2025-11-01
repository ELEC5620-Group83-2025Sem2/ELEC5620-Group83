-- Create table used by /api/student/review/* endpoints
-- Matches expectations in backend/controllers/student/review.js

-- Extension required for gen_random_uuid()
-- (On Supabase this is already enabled; safe to run)
create extension if not exists pgcrypto;

create table if not exists public.incorrect_questions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  assignment_id uuid null references public.assignments(id) on delete set null,
  question_id uuid null references public.assignment_questions(id) on delete set null,

  -- Display/meta fields used by UI mapping
  subject text not null default 'General',
  topic text not null default 'General',
  difficulty text null, -- e.g. 'Easy' | 'Medium' | 'Hard'
  assignment_source text null, -- friendly source label (e.g. assignment title)

  -- Question/answer data
  question_text text not null,
  correct_answer text null,
  student_answer text null,
  explanation text null,

  -- Spaced-repetition tracking
  times_reviewed integer not null default 0,
  is_mastered boolean not null default false,
  last_reviewed_at timestamptz null,
  next_review_at timestamptz null,

  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_incorrect_questions_student on public.incorrect_questions(student_id);
create index if not exists idx_incorrect_questions_next_review on public.incorrect_questions(next_review_at);
create index if not exists idx_incorrect_questions_subject on public.incorrect_questions(subject);
create index if not exists idx_incorrect_questions_topic on public.incorrect_questions(topic);

-- Enable Row Level Security
alter table public.incorrect_questions enable row level security;

-- Policies: students can manage their own rows
drop policy if exists "Select own incorrect_questions" on public.incorrect_questions;
create policy "Select own incorrect_questions" on public.incorrect_questions
  for select
  using (student_id = auth.uid());

drop policy if exists "Insert own incorrect_questions" on public.incorrect_questions;
create policy "Insert own incorrect_questions" on public.incorrect_questions
  for insert
  with check (student_id = auth.uid());

drop policy if exists "Update own incorrect_questions" on public.incorrect_questions;
create policy "Update own incorrect_questions" on public.incorrect_questions
  for update
  using (student_id = auth.uid());

drop policy if exists "Delete own incorrect_questions" on public.incorrect_questions;
create policy "Delete own incorrect_questions" on public.incorrect_questions
  for delete
  using (student_id = auth.uid());

-- Optional: RPC to update review schedule (controller will fallback if absent)
create or replace function public.update_question_review(
  question_id uuid,
  is_correct boolean,
  p_student_id uuid default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_times integer;
  v_mastered boolean;
  v_now timestamptz := now();
  v_next timestamptz;
  v_student uuid := coalesce(p_student_id, auth.uid());
begin
  select times_reviewed, is_mastered
    into v_times, v_mastered
  from public.incorrect_questions
  where id = question_id and student_id = v_student
  for update;

  if not found then
    raise exception 'incorrect_questions row not found for id % and student %', question_id, v_student;
  end if;

  v_times := coalesce(v_times, 0) + 1;

  if is_correct then
    if v_times <= 1 then v_next := v_now + interval '1 day';
    elsif v_times = 2 then v_next := v_now + interval '3 days';
    elsif v_times = 3 then v_next := v_now + interval '7 days';
    else v_next := null; -- mastered schedule
    end if;
  else
    v_next := v_now + interval '1 day';
  end if;

  update public.incorrect_questions
    set times_reviewed = v_times,
        last_reviewed_at = v_now,
        next_review_at = v_next,
        is_mastered = case when is_correct and v_times >= 4 then true else is_mastered end
  where id = question_id and student_id = v_student;
end;
$$;

grant execute on function public.update_question_review(uuid, boolean, uuid) to authenticated;

-- NOTE: To seed this table, insert rows when grading submissions
-- or via a one-off backfill that joins assignment_submissions,
-- assignment_submission_answers and assignment_questions.


