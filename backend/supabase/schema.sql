create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  phone text not null check (char_length(phone) between 7 and 24),
  date date not null,
  time text not null check (time ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'),
  services text[] not null default '{}',
  service_ids integer[] not null default '{}',
  subtotal numeric(10, 2) not null default 0 check (subtotal >= 0),
  subscription_status text not null default 'none'
    check (subscription_status in ('none', 'active', 'signup')),
  subscription_reference text not null default '' check (char_length(subscription_reference) <= 80),
  subscription_plan text not null default '' check (char_length(subscription_plan) <= 80),
  subscription_covered_service text not null default ''
    check (char_length(subscription_covered_service) <= 80),
  subscription_discount numeric(10, 2) not null default 0 check (subscription_discount >= 0),
  subscription_charge numeric(10, 2) not null default 0 check (subscription_charge >= 0),
  total numeric(10, 2) not null check (total >= 0),
  status text not null default 'confirmed'
    check (status in ('confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookings_date_time_status_idx
  on public.bookings (date, time, status);

create index if not exists bookings_status_idx
  on public.bookings (status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_bookings_updated_at on public.bookings;

create trigger set_bookings_updated_at
before update on public.bookings
for each row
execute function public.set_updated_at();

alter table public.bookings enable row level security;

comment on table public.bookings is
  'Vintage Fades bookings. Access this table from the backend with the Supabase service role key.';
