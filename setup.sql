-- Live Poll: Supabase setup
-- Paste this whole file into Supabase > SQL Editor > New query, then click Run.
-- Change the admin code on the last line of section 1 before you run it.

-- 1. Tables ---------------------------------------------------------------

create table if not exists public.poll_state (
  id int primary key default 1 check (id = 1),
  current_question int not null default -1,   -- -1 = voting closed
  updated_at timestamptz not null default now()
);
insert into public.poll_state (id) values (1) on conflict do nothing;

create table if not exists public.poll_votes (
  id bigint generated always as identity primary key,
  question int not null,
  choice int not null,
  voter text not null,                          -- random id kept on the phone
  created_at timestamptz not null default now(),
  unique (question, voter)                      -- one answer per phone per question
);

create table if not exists public.poll_admin (
  id int primary key default 1 check (id = 1),
  code text not null
);
-- Pick a long code that is hard to guess. You type it on admin.html.
insert into public.poll_admin (id, code) values (1, 'CHANGE-ME-to-a-long-code')
  on conflict (id) do update set code = excluded.code;

-- 2. Access rules ---------------------------------------------------------
-- Browsers may READ the state and the votes. They change data only through
-- the functions below. Nobody reads poll_admin from a browser.

alter table public.poll_state enable row level security;
alter table public.poll_votes enable row level security;
alter table public.poll_admin enable row level security;

drop policy if exists "read state" on public.poll_state;
create policy "read state" on public.poll_state for select to anon, authenticated using (true);

drop policy if exists "read votes" on public.poll_votes;
create policy "read votes" on public.poll_votes for select to anon, authenticated using (true);

-- 3. Functions ------------------------------------------------------------

-- Attendees vote. A second vote from the same phone replaces the first.
create or replace function public.cast_vote(p_question int, p_choice int, p_voter text)
returns text language plpgsql security definer set search_path = public as $$
declare cur int;
begin
  select current_question into cur from poll_state where id = 1;
  if cur is null or cur <> p_question then return 'closed'; end if;
  if p_choice < 0 or p_choice > 11 or length(p_voter) not between 8 and 64 then
    return 'invalid';
  end if;
  insert into poll_votes (question, choice, voter) values (p_question, p_choice, p_voter)
    on conflict (question, voter) do update set choice = excluded.choice, created_at = now();
  return 'ok';
end $$;

-- Vote totals. Pass a question number, or null for every question.
create or replace function public.poll_counts(p_question int default null)
returns table (question int, choice int, n bigint)
language sql stable security definer set search_path = public as $$
  select v.question, v.choice, count(*) from poll_votes v
  where p_question is null or v.question = p_question
  group by v.question, v.choice;
$$;

create or replace function public.poll_admin_ok(p_code text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from poll_admin where code = p_code);
$$;

-- Presenter: open a question (0, 1, 2 ...) or close voting (-1).
create or replace function public.set_current_question(p_code text, p_question int)
returns text language plpgsql security definer set search_path = public as $$
begin
  if not poll_admin_ok(p_code) then return 'denied'; end if;
  update poll_state set current_question = p_question, updated_at = now() where id = 1;
  return 'ok';
end $$;

-- Presenter: clear one question, or every question when p_question is null.
create or replace function public.clear_votes(p_code text, p_question int default null)
returns text language plpgsql security definer set search_path = public as $$
begin
  if not poll_admin_ok(p_code) then return 'denied'; end if;
  delete from poll_votes where p_question is null or question = p_question;
  return 'ok';
end $$;

-- 4. Live updates ---------------------------------------------------------

do $$ begin
  alter publication supabase_realtime add table public.poll_votes;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.poll_state;
exception when duplicate_object then null; end $$;
