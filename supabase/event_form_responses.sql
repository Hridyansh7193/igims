-- Run this once in Supabase -> SQL Editor.
-- Stores the answers a participant gives in each event's registration form.

create table if not exists public.event_form_responses (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  participant_id text,
  event_name     text not null,
  category       text,
  form_slug      text not null,
  form_label     text,          -- e.g. "Men's Cricket" when an event has variants
  form_title     text,
  answers        jsonb not null default '[]'::jsonb,  -- [{id,label,type,value}, ...]
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (user_id, event_name)
);

alter table public.event_form_responses enable row level security;

drop policy if exists "efr_select_own" on public.event_form_responses;
create policy "efr_select_own" on public.event_form_responses
  for select using (auth.uid() = user_id);

drop policy if exists "efr_insert_own" on public.event_form_responses;
create policy "efr_insert_own" on public.event_form_responses
  for insert with check (auth.uid() = user_id);

drop policy if exists "efr_update_own" on public.event_form_responses;
create policy "efr_update_own" on public.event_form_responses
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists efr_event_idx on public.event_form_responses (event_name);
