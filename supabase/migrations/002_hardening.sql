-- 002: queue liveness + solo-answer hardening. Run after 001. Safe to re-run.

alter table public.queue add column if not exists last_seen timestamptz not null default now();

create table if not exists public.solo_attempts (
  id          bigserial primary key,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  puzzle_slug text not null,
  at          timestamptz not null default now()
);
create index if not exists solo_attempts_idx on public.solo_attempts(user_id, at desc);
alter table public.solo_attempts enable row level security;
revoke all on public.solo_attempts from anon, authenticated;
revoke all on sequence public.solo_attempts_id_seq from anon, authenticated;

-- Waiting clients re-call this every ~4 s; rows not refreshed recently are ignored and purged,
-- so a closed tab never leaves a ghost opponent in the queue.
create or replace function public.join_queue() returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  me uuid := auth.uid();
  my_rating int; my_joined timestamptz;
  opp record; pz text; mid uuid;
begin
  if me is null then raise exception 'not authenticated'; end if;

  select id into mid from public.matches
   where status = 'active' and now() < ends_at and me in (p1, p2) limit 1;
  if mid is not null then return mid; end if;

  delete from public.queue where last_seen < now() - interval '20 seconds';

  select rating into my_rating from public.profiles where id = me;
  insert into public.queue (user_id, rating) values (me, my_rating)
  on conflict (user_id) do update set last_seen = now(), rating = excluded.rating;
  select joined_at into my_joined from public.queue where user_id = me;

  select q.* into opp from public.queue q
   where q.user_id <> me
     and q.last_seen > now() - interval '15 seconds'
     and abs(q.rating - my_rating)
         <= 100 + 50 * floor(extract(epoch from (now() - least(q.joined_at, my_joined))) / 10)
   order by abs(q.rating - my_rating), q.joined_at
   for update skip locked limit 1;

  if not found then return null; end if;

  select p.slug into pz from public.puzzles p
   where not exists (select 1 from public.solves s
                      where s.puzzle_slug = p.slug and s.user_id in (me, opp.user_id))
   order by abs(p.rating - (my_rating + opp.rating) / 2), random() limit 1;
  if pz is null then select slug into pz from public.puzzles order by random() limit 1; end if;
  if pz is null then raise exception 'no puzzles seeded'; end if;

  insert into public.matches (p1, p2, puzzle_slug, ends_at)
  values (opp.user_id, me, pz, now() + interval '20 minutes') returning id into mid;

  delete from public.queue where user_id in (me, opp.user_id);
  return mid;
end $$;

-- Solo check: blocked for the puzzle you're currently playing a match on, and rate-limited,
-- so it can't be used to brute-force a live match's answer.
create or replace function public.check_answer(p_slug text, p_answer text) returns boolean
language plpgsql security definer set search_path = '' as $$
declare me uuid := auth.uid(); ok boolean; secret text; last_at timestamptz;
begin
  if me is null then raise exception 'not authenticated'; end if;
  if length(coalesce(p_answer,'')) > 100 then raise exception 'answer too long'; end if;
  if exists (select 1 from public.matches
              where status = 'active' and now() < ends_at and me in (p1, p2) and puzzle_slug = p_slug) then
    raise exception 'this puzzle is in your active match';
  end if;
  select max(at) into last_at from public.solo_attempts where user_id = me;
  if last_at is not null and now() - last_at < interval '3 seconds' then
    raise exception 'too fast: wait a few seconds between guesses';
  end if;
  insert into public.solo_attempts (user_id, puzzle_slug) values (me, p_slug);
  select answer_value into secret from public.puzzle_secrets where slug = p_slug;
  if secret is null then raise exception 'unknown puzzle'; end if;
  ok := public.answers_equal(p_answer, secret);
  if ok then
    insert into public.solves (user_id, puzzle_slug) values (me, p_slug) on conflict do nothing;
  end if;
  return ok;
end $$;
