-- STEP 1 of 2. Run once in the Supabase SQL editor.
create table if not exists public.event_payments (
  id                   bigint generated always as identity primary key,
  user_id              uuid not null references auth.users(id) on delete cascade,
  event_name           text,
  form_slug            text,
  selection            text,
  amount_inr           numeric(10,2) not null,
  razorpay_order_id    text not null unique,
  razorpay_payment_id  text unique,                 -- filled when the payment succeeds
  status               text not null default 'CREATED',   -- CREATED -> PAID
  payload              jsonb,                       -- pending form answers (used by the webhook)
  created_at           timestamptz not null default now(),
  paid_at              timestamptz
);

create index if not exists event_payments_user_idx on public.event_payments (user_id, form_slug, status);

alter table public.event_payments enable row level security;

-- Users may READ their own payments only. All writes happen server-side with
-- the service-role key (api/*), which bypasses RLS.
drop policy if exists "own payments readable" on public.event_payments;
create policy "own payments readable" on public.event_payments
  for select using (auth.uid() = user_id);
