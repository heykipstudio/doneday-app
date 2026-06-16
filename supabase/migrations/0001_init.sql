-- Profiles (1:1 with auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  plan text not null default 'free' check (plan in ('free', 'plus')),
  notifications_enabled boolean not null default false,
  notification_time text not null default '20:00' check (notification_time in ('20:00','21:00','22:00')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Daily entries (one row per user per date)
create table public.daily_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  entry_1 text,
  entry_2 text,
  entry_3 text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, entry_date)
);

-- Reflections
create table public.reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('weekly', 'monthly')),
  period_id text not null, -- e.g. '2026-W23' or '2026-06'
  prompts jsonb not null default '[]', -- [{prompt, answer}]
  status text not null default 'pending' check (status in ('pending','completed','skipped','postponed')),
  remind_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, type, period_id)
);

-- RLS
alter table public.profiles enable row level security;
alter table public.daily_entries enable row level security;
alter table public.reflections enable row level security;

create policy "own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "own entries" on public.daily_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own reflections" on public.reflections for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Auto-create profile on signup
create function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, name) values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- updated_at triggers (generic)
create function public.set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql set search_path = public;

create trigger set_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.daily_entries for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.reflections for each row execute procedure public.set_updated_at();

-- enable realtime
alter publication supabase_realtime add table public.daily_entries;
alter publication supabase_realtime add table public.reflections;
alter publication supabase_realtime add table public.profiles;
