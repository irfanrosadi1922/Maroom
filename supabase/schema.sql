-- Maroom Studio: jalankan di SQL Editor project Supabase. Aman dijalankan ulang.
create table if not exists public.series (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 60),
  created_at timestamptz not null default now()
);

create table if not exists public.episodes (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  series_id uuid not null references public.series(id) on delete cascade,
  number int not null check (number > 0),
  title text not null check (char_length(title) between 1 and 80),
  script text not null,
  style text not null check (style in ('canyon', 'town', 'dawn')),
  hero jsonb not null,
  guest jsonb not null,
  voice text,                       -- voice_id ElevenLabs; null = tanpa suara. Audio ada di bucket "voice": <user_id>/<episode_id>/<n>.mp3
  status text not null default 'draft' check (status in ('draft', 'done')),
  dur numeric not null default 0,
  thumb text,
  created_at timestamptz not null default now()
);
alter table public.episodes add column if not exists voice text;
create index if not exists series_user_idx on public.series (user_id);
create index if not exists episodes_series_idx on public.episodes (series_id, number);
create index if not exists episodes_user_idx on public.episodes (user_id);

-- Setiap pengguna hanya melihat dan mengubah datanya sendiri.
alter table public.series enable row level security;
alter table public.episodes enable row level security;
drop policy if exists "own series" on public.series;
drop policy if exists "own episodes" on public.episodes;
create policy "own series" on public.series for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "own episodes" on public.episodes for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Bucket privat untuk audio narasi; pengguna hanya mengakses folder miliknya.
insert into storage.buckets (id, name, public) values ('voice', 'voice', false) on conflict (id) do nothing;
drop policy if exists "own voice files" on storage.objects;
create policy "own voice files" on storage.objects for all to authenticated
  using (bucket_id = 'voice' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'voice' and (storage.foldername(name))[1] = (select auth.uid())::text);
