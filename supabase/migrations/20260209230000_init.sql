create extension if not exists pgcrypto;

create table if not exists public.users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  nom text not null default '',
  prenom text not null default '',
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chapse (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  config_json jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists chapse_user_created_at_idx
  on public.chapse (user_id, created_at desc);

create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
before update on public.users
for each row execute procedure public.tg_set_updated_at();

create or replace function public.tg_set_admin_role_by_email()
returns trigger
language plpgsql
as $$
begin
  if lower(coalesce(new.email, '')) = 'mparrino@chapsvision.com' then
    new.role := 'admin';
    new.nom := 'Parrino';
    new.prenom := 'Mathieu';
  end if;
  return new;
end;
$$;

drop trigger if exists users_set_admin_role_by_email on public.users;
create trigger users_set_admin_role_by_email
before insert or update on public.users
for each row execute procedure public.tg_set_admin_role_by_email();

alter table public.users enable row level security;
alter table public.chapse enable row level security;

drop policy if exists users_select_own on public.users;
create policy users_select_own
on public.users
for select
using (auth.uid() = user_id);

drop policy if exists users_insert_own on public.users;
create policy users_insert_own
on public.users
for insert
with check (auth.uid() = user_id);

drop policy if exists users_update_own on public.users;
create policy users_update_own
on public.users
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists users_delete_own on public.users;
create policy users_delete_own
on public.users
for delete
using (auth.uid() = user_id);

drop policy if exists chapse_select_own on public.chapse;
create policy chapse_select_own
on public.chapse
for select
using (auth.uid() = user_id);

drop policy if exists chapse_insert_own on public.chapse;
create policy chapse_insert_own
on public.chapse
for insert
with check (auth.uid() = user_id);

drop policy if exists chapse_update_own on public.chapse;
create policy chapse_update_own
on public.chapse
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists chapse_delete_own on public.chapse;
create policy chapse_delete_own
on public.chapse
for delete
using (auth.uid() = user_id);
