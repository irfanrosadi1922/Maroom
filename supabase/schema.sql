-- Maroom Studio: jalankan di Supabase project "Maroom-Studio" (SQL Editor). Aman dijalankan ulang.
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
  status text not null default 'draft' check (status in ('draft', 'done')),
  dur numeric not null default 0,
  thumb text,
  created_at timestamptz not null default now()
);
create index if not exists episodes_series_idx on public.episodes (series_id, number);

-- Setiap pengguna hanya melihat dan mengubah datanya sendiri.
alter table public.series enable row level security;
alter table public.episodes enable row level security;
drop policy if exists "own series" on public.series;
drop policy if exists "own episodes" on public.episodes;
create policy "own series" on public.series for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own episodes" on public.episodes for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
