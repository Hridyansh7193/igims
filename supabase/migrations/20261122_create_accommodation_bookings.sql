-- ==============================================================================
-- Cerebrexia '26 — Accommodation Bookings Table
-- ==============================================================================

create table if not exists public.accommodation_bookings (
  id                   bigint generated always as identity primary key,
  booking_id           text not null unique,
  user_id              uuid not null references auth.users(id) on delete cascade,
  full_name            text not null,
  email                text not null,
  phone                text not null,
  college              text,
  gender               text not null,                       -- 'BOYS' (Hostel) or 'GIRLS' (Lodgings)
  selected_dates       jsonb not null default '[]'::jsonb,  -- Array of date strings, e.g. ["17 Dec", "18 Dec"]
  num_days             integer not null default 1,
  price_per_day        numeric(10,2) not null default 150.00,
  amount_inr           numeric(10,2) not null,              -- num_days * 150.00
  razorpay_order_id    text,
  razorpay_payment_id  text,
  payment_status       text not null default 'PAID',        -- 'PAID'
  status               text not null default 'CONFIRMED',   -- 'CONFIRMED'
  metadata             jsonb default '{}'::jsonb,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists accommodation_bookings_user_idx on public.accommodation_bookings (user_id, status);
create index if not exists accommodation_bookings_payment_idx on public.accommodation_bookings (razorpay_payment_id);

alter table public.accommodation_bookings enable row level security;

-- Users may view their own accommodation bookings
drop policy if exists "own accommodation bookings readable" on public.accommodation_bookings;
create policy "own accommodation bookings readable" on public.accommodation_bookings
  for select using (auth.uid() = user_id);

-- Users may insert their own accommodation bookings upon verified payment
drop policy if exists "own accommodation bookings insertable" on public.accommodation_bookings;
create policy "own accommodation bookings insertable" on public.accommodation_bookings
  for insert with check (auth.uid() = user_id);

-- Users may update their own accommodation bookings
drop policy if exists "own accommodation bookings updatable" on public.accommodation_bookings;
create policy "own accommodation bookings updatable" on public.accommodation_bookings
  for update using (auth.uid() = user_id);
