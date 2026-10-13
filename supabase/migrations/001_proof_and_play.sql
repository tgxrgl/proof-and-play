-- Proof & Play: schema, RLS, matchmaking. Run once in Supabase > SQL Editor.
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE where possible.

-- ───────────── Tables ─────────────
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  username   text unique not null check (username ~ '^[A-Za-z0-9_]{3,20}$'),
  rating     int  not null default 1200,
  games      int  not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.puzzles (
  slug       text primary key,
  title      text not null,
  category   text not null,
  difficulty text not null check (difficulty in ('Easy','Medium','Hard')),
  minutes    int,
  teaser     text,
  statement  text not null,
  hints      jsonb not null default '[]',
  source     text,
  diagram    text,
  added      text,
  rating     int not null default 1500
);

-- Answers live apart from puzzles; no policy => clients can never read it.
create table if not exists public.puzzle_secrets (
  slug         text primary key references public.puzzles(slug) on delete cascade,
  answer       text not null,        -- display form (LaTeX)
  answer_value text not null,        -- machine-checkable
  solution     jsonb not null default '[]'
);

create table if not exists public.solves (
  user_id     uuid not null references public.profiles(id) on delete cascade,
  puzzle_slug text not null references public.puzzles(slug) on delete cascade,
  solved_at   timestamptz not null default now(),
  primary key (user_id, puzzle_slug)
);

create table if not exists public.queue (
  user_id   uuid primary key references public.profiles(id) on delete cascade,
  rating    int not null,
  joined_at timestamptz not null default now()
);

create table if not exists public.matches (
  id          uuid primary key default gen_random_uuid(),
  p1          uuid not null references public.profiles(id),
  p2          uuid not null references public.profiles(id),
  puzzle_slug text not null references public.puzzles(slug),
  status      text not null default 'active' check (status in ('active','finished')),
  winner      uuid references public.profiles(id),
  started_at  timestamptz not null default now(),
  ends_at     timestamptz not null,
  finished_at timestamptz
);
create index if not exists matches_p1_idx on public.matches(p1);
create index if not exists matches_p2_idx on public.matches(p2);

create table if not exists public.attempts (
  id       bigserial primary key,
  match_id uuid not null references public.matches(id) on delete cascade,
  user_id  uuid not null references public.profiles(id) on delete cascade,
  answer   text not null,
  correct  boolean not null,
  at       timestamptz not null default now()
);
create index if not exists attempts_lookup_idx on public.attempts(match_id, user_id, at);

-- ───────────── RLS (explicit, regardless of the dashboard toggle) ─────────────
alter table public.profiles       enable row level security;
alter table public.puzzles        enable row level security;
alter table public.puzzle_secrets enable row level security;
alter table public.solves         enable row level security;
alter table public.queue          enable row level security;
alter table public.matches        enable row level security;
alter table public.attempts       enable row level security;

-- Start from zero privileges, then grant only what's needed (reads only; all writes go via RPCs).
revoke all on public.profiles, public.puzzles, public.puzzle_secrets, public.solves,
              public.queue, public.matches, public.attempts from anon, authenticated;
revoke all on sequence public.attempts_id_seq from anon, authenticated;

grant select on public.profiles to anon, authenticated;
grant select on public.puzzles  to anon, authenticated;
grant select on public.solves, public.queue, public.matches, public.attempts to authenticated;

drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select to anon, authenticated using (true);

drop policy if exists puzzles_read on public.puzzles;
create policy puzzles_read on public.puzzles for select to anon, authenticated using (true);

drop policy if exists solves_own on public.solves;
create policy solves_own on public.solves for select to authenticated using (user_id = auth.uid());

drop policy if exists queue_own on public.queue;
create policy queue_own on public.queue for select to authenticated using (user_id = auth.uid());

drop policy if exists matches_participants on public.matches;
create policy matches_participants on public.matches for select to authenticated
  using (auth.uid() in (p1, p2));

drop policy if exists attempts_own on public.attempts;
create policy attempts_own on public.attempts for select to authenticated using (user_id = auth.uid());

-- ───────────── Auto-create profile on signup ─────────────
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, username)
  values (new.id, 'player_' || substr(replace(new.id::text, '-', ''), 1, 8));
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ───────────── Helpers ─────────────
create or replace function public.to_num(s text) returns numeric
language plpgsql immutable set search_path = '' as $$
declare t text := lower(regexp_replace(coalesce(s,''), '[\s$]', '', 'g'));
begin
  if t ~ '^[+-]?\d+/\d+$' then
    if split_part(t,'/',2)::numeric = 0 then return null; end if;
    return split_part(t,'/',1)::numeric / split_part(t,'/',2)::numeric;
  end if;
  return t::numeric;
exception when others then return null;
end $$;

create or replace function public.answers_equal(a text, b text) returns boolean
language plpgsql immutable set search_path = '' as $$
declare x numeric; y numeric;
begin
  a := lower(regexp_replace(coalesce(a,''), '[\s$]', '', 'g'));
  b := lower(regexp_replace(coalesce(b,''), '[\s$]', '', 'g'));
  if a = b then return true; end if;
  x := public.to_num(a); y := public.to_num(b);
  return x is not null and y is not null and x = y;
end $$;

create or replace function public.apply_elo(p_a uuid, p_b uuid, p_winner uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare ra int; rb int; ea numeric; sa numeric;
begin
  select rating into ra from public.profiles where id = p_a;
  select rating into rb from public.profiles where id = p_b;
  ea := 1 / (1 + power(10, (rb - ra) / 400.0));
  sa := case when p_winner = p_a then 1 else 0 end;
  update public.profiles set rating = round(rating + 32 * (sa - ea)), games = games + 1 where id = p_a;
  update public.profiles set rating = round(rating + 32 * ((1 - sa) - (1 - ea))), games = games + 1 where id = p_b;
end $$;

-- ───────────── Public RPCs ─────────────
create or replace function public.set_username(p_name text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  update public.profiles set username = p_name where id = auth.uid();
end $$;

-- Idempotent: call on "Find match" and again every ~5 s while waiting (widens the rating window).
-- Returns match id when matched, else null.
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

  select rating into my_rating from public.profiles where id = me;
  insert into public.queue (user_id, rating) values (me, my_rating) on conflict (user_id) do nothing;
  select joined_at into my_joined from public.queue where user_id = me;

  select q.* into opp from public.queue q
   where q.user_id <> me
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

create or replace function public.leave_queue() returns void
language sql security definer set search_path = '' as $$
  delete from public.queue where user_id = auth.uid();
$$;

create or replace function public.submit_answer(p_match uuid, p_answer text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  me uuid := auth.uid();
  m public.matches; secret text; ok boolean; last_at timestamptz;
begin
  if me is null then raise exception 'not authenticated'; end if;
  if length(coalesce(p_answer,'')) > 100 then raise exception 'answer too long'; end if;

  select * into m from public.matches where id = p_match for update;
  if not found or me not in (m.p1, m.p2) then raise exception 'no such match'; end if;

  if m.status = 'active' and now() > m.ends_at then
    update public.matches set status = 'finished', finished_at = now() where id = m.id;
    return jsonb_build_object('status','finished','correct',false,'winner',null);
  end if;
  if m.status <> 'active' then
    return jsonb_build_object('status','finished','correct',false,'winner',m.winner);
  end if;

  select max(at) into last_at from public.attempts where match_id = m.id and user_id = me;
  if last_at is not null and now() - last_at < interval '5 seconds' then
    raise exception 'too fast: wait a few seconds between guesses';
  end if;

  select answer_value into secret from public.puzzle_secrets where slug = m.puzzle_slug;
  ok := public.answers_equal(p_answer, secret);
  insert into public.attempts (match_id, user_id, answer, correct) values (m.id, me, p_answer, ok);

  if ok then
    update public.matches set status = 'finished', winner = me, finished_at = now() where id = m.id;
    insert into public.solves (user_id, puzzle_slug) values (me, m.puzzle_slug) on conflict do nothing;
    perform public.apply_elo(m.p1, m.p2, me);
  end if;
  return jsonb_build_object('status', case when ok then 'finished' else 'active' end,
                            'correct', ok, 'winner', case when ok then me end);
end $$;

-- Solo practice: check an answer and record the solve.
create or replace function public.check_answer(p_slug text, p_answer text) returns boolean
language plpgsql security definer set search_path = '' as $$
declare ok boolean; secret text;
begin
  select answer_value into secret from public.puzzle_secrets where slug = p_slug;
  ok := public.answers_equal(p_answer, secret);
  if ok and auth.uid() is not null then
    insert into public.solves (user_id, puzzle_slug) values (auth.uid(), p_slug) on conflict do nothing;
  end if;
  return ok;
end $$;

-- Answer + solution only after you've solved it or a match on it has ended.
create or replace function public.reveal_solution(p_slug text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare me uuid := auth.uid(); allowed boolean;
begin
  if me is null then return null; end if;
  select exists (select 1 from public.solves where user_id = me and puzzle_slug = p_slug)
      or exists (select 1 from public.matches
                  where puzzle_slug = p_slug and me in (p1, p2) and status = 'finished')
    into allowed;
  if not allowed then return null; end if;
  return (select jsonb_build_object('answer', answer, 'solution', solution)
            from public.puzzle_secrets where slug = p_slug);
end $$;

-- ───────────── Function privileges ─────────────
revoke execute on function public.apply_elo(uuid, uuid, uuid) from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.set_username(text), public.join_queue(), public.leave_queue(),
  public.submit_answer(uuid, text), public.check_answer(text, text),
  public.reveal_solution(text) from public, anon;
grant execute on function public.set_username(text), public.join_queue(), public.leave_queue(),
  public.submit_answer(uuid, text), public.check_answer(text, text),
  public.reveal_solution(text) to authenticated;

-- ───────────── Realtime: notify players when a match is created/finished ─────────────
do $$ begin
  if not exists (select 1 from pg_publication_tables
                  where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'matches') then
    alter publication supabase_realtime add table public.matches;
  end if;
end $$;
