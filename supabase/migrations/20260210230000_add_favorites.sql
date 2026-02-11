-- Favorites support in the library.
alter table public.chapse
add column if not exists is_favorite boolean not null default false;

create index if not exists chapse_user_favorite_created_at_idx
  on public.chapse (user_id, is_favorite, created_at desc);

