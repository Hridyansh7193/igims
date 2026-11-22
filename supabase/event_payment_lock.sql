-- STEP 2 of 2 (run AFTER step 1 and after deploying the new code).
-- Blocks logged-in users from writing registrations for PAID events unless a
-- verified payment exists. Server code (service role), the SQL editor and
-- events without a fee are not affected.
-- Generated from the current event list: 43 events / 46 forms.

create table if not exists public.paid_events (event_name text primary key);
create table if not exists public.paid_form_slugs (slug text primary key);
alter table public.paid_events enable row level security;      -- no policies => clients cannot touch them
alter table public.paid_form_slugs enable row level security;

insert into public.paid_events (event_name) values
  ('🩺 Basic Life Support Workshop'),
  ('🪡 Suture Workshop'),
  ('🔬 Paraclinical Quiz'),
  ('🏥 Clinical Quiz'),
  ('📋 Case Presentation'),
  ('🗣️ Agora (Debate)'),
  ('✒️ Hridaya (Poetry, Shayari & Elocution)'),
  ('🐝 Spell Bee'),
  ('🧩 Cryptic Crossword'),
  ('🎼 Medimelody (Song se Syndrome)'),
  ('🍿 Pop-Culture Quiz'),
  ('🧠 General Quiz'),
  ('🏏 Cricket'),
  ('⚽ Football'),
  ('🏐 Volleyball'),
  ('🏸 Badminton'),
  ('🤼 Kabaddi'),
  ('♟️ Chess'),
  ('🏓 Table Tennis'),
  ('🎯 Carrom'),
  ('🏃 Athletics'),
  ('🧩 Rubik''s Mania'),
  ('🎮 BGMI'),
  ('🎤 Swarmay (Singing)'),
  ('💃 Flamenco (Dancing)'),
  ('🎥 Cinematica (Film Making)'),
  ('🎭 Abhinay'),
  ('📸 Nazariya (Photography)'),
  ('🌟 Got Talent'),
  ('😂 MemeCentral (Meme Competition)'),
  ('🎬 Stardust (Bollywood Recreation)'),
  ('🎭 Dharohar (Folklore)'),
  ('👗 Venust (Fashion Show)'),
  ('🎨 Chitraganga (Painting)'),
  ('🖍️ Doodle Dreams (Doodle Art)'),
  ('🏺 Sculpture Spectacle (Clay Art)'),
  ('✒️ Tattoo Titans (Tattoo Art)'),
  ('🌿 Mehendi Delights (Mehendi)'),
  ('🌸 Aripan (Rangoli)'),
  ('♻️ Recycled Wonders (Waste Art)'),
  ('💻 Cyber-Creation (Digital Art)'),
  ('👕 Tee-Splash (T-Shirt Painting)'),
  ('🎭 Magic Mask (Face Painting)')
on conflict do nothing;

insert into public.paid_form_slugs (slug) values
  ('trauma-code-bls-acls-workshop'),
  ('suture-workshop'),
  ('para-clinical-quiz'),
  ('clinical-quiz'),
  ('case-presentation'),
  ('agora-debate'),
  ('hridaya-premchand-kalam-aur-kalpana'),
  ('spell-bee'),
  ('cryptic-crossword'),
  ('medimelody-song-se-syndrome'),
  ('popverse'),
  ('general-quiz'),
  ('men-s-cricket'),
  ('women-s-cricket'),
  ('football'),
  ('volleyball'),
  ('badminton'),
  ('men-s-kabbadi'),
  ('women-s-kabaddi'),
  ('chess'),
  ('table-tennis'),
  ('carrom'),
  ('athletics'),
  ('rubik-s-cube'),
  ('bgmi'),
  ('swarmay-singing'),
  ('flamenco-dance'),
  ('cinematica'),
  ('abhinay-theatre-drama'),
  ('nazariya-photography'),
  ('got-talent'),
  ('memecentral'),
  ('stardust'),
  ('dharohar'),
  ('venust-fashion-show'),
  ('chitranganga-painting'),
  ('doodle-dreams'),
  ('sculpture-spectacle-clay-art'),
  ('tattoo-titans'),
  ('mehendi-delights'),
  ('aripan-online'),
  ('aripan-offline'),
  ('recycled-wonders-waste-art'),
  ('cyber-creation-digital-art'),
  ('tee-splash'),
  ('magic-mask-face-painting')
on conflict do nothing;

create or replace function public.crx_require_event_payment() returns trigger
language plpgsql security definer set search_path = public as $fn$
begin
  -- only restrict normal logged-in users; service role / SQL editor pass through
  if coalesce(auth.role(), '') <> 'authenticated' then
    return new;
  end if;

  if tg_table_name = 'event_form_responses' then
    if exists (select 1 from public.paid_form_slugs where slug = new.form_slug)
       and not exists (select 1 from public.event_payments p
                       where p.user_id = new.user_id and p.form_slug = new.form_slug and p.status = 'PAID') then
      raise exception 'Payment required for this event' using errcode = 'P0001';
    end if;
  else
    if exists (select 1 from public.paid_events where event_name = new.event_name)
       and not exists (select 1 from public.event_payments p
                       where p.user_id = new.user_id and p.event_name = new.event_name and p.status = 'PAID') then
      raise exception 'Payment required for this event' using errcode = 'P0001';
    end if;
  end if;
  return new;
end
$fn$;

drop trigger if exists crx_pay_guard on public.event_form_responses;
create trigger crx_pay_guard before insert or update on public.event_form_responses
  for each row execute function public.crx_require_event_payment();

drop trigger if exists crx_pay_guard on public.sports_registrations;
create trigger crx_pay_guard before insert on public.sports_registrations
  for each row execute function public.crx_require_event_payment();

drop trigger if exists crx_pay_guard on public.cultural_registrations;
create trigger crx_pay_guard before insert on public.cultural_registrations
  for each row execute function public.crx_require_event_payment();
