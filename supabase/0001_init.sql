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
  is_favorite boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.export_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  format text not null check (format in ('png', 'jpg')),
  created_at timestamptz not null default now()
);

create index if not exists chapse_user_created_at_idx
  on public.chapse (user_id, created_at desc);

create index if not exists export_events_user_created_at_idx
  on public.export_events (user_id, created_at desc);

create index if not exists export_events_format_created_at_idx
  on public.export_events (format, created_at desc);

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
  -- Security hardening:
  -- Prevent privilege escalation by locking sensitive profile fields (email/role/user_id)
  -- for requests coming from a logged-in end-user (auth.uid() is set). Service-role
  -- operations (Edge Functions) keep full control.
  if auth.uid() is not null then
    if TG_OP = 'INSERT' then
      -- Enforce ownership and email from the JWT (prevents spoofing).
      new.user_id := auth.uid();
      new.email := lower(
        coalesce(
          (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email'),
          new.email,
          ''
        )
      );

      -- Regular users can't self-assign admin. Admin role is granted via service role
      -- inserts/updates or the official admin email below.
      if new.email = 'mparrino@chapsvision.com' then
        new.role := 'admin';
        new.nom := 'Parrino';
        new.prenom := 'Mathieu';
      else
        new.role := 'user';
      end if;
    else
      -- UPDATE: end-users may edit nom/prenom only.
      new.user_id := old.user_id;
      new.email := old.email;
      new.role := old.role;
    end if;
  end if;

  -- Always enforce the official admin profile defaults.
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
alter table public.export_events enable row level security;

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

drop policy if exists export_events_select_own on public.export_events;
create policy export_events_select_own
on public.export_events
for select
using (auth.uid() = user_id);

drop policy if exists export_events_insert_own on public.export_events;
create policy export_events_insert_own
on public.export_events
for insert
with check (auth.uid() = user_id);

drop policy if exists export_events_delete_own on public.export_events;
create policy export_events_delete_own
on public.export_events
for delete
using (auth.uid() = user_id);

-- Ensure PostgREST roles can access the tables (RLS still applies).
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.users to anon, authenticated;
grant select, insert, update, delete on public.chapse to anon, authenticated;
grant select, insert, update, delete on public.export_events to anon, authenticated;
