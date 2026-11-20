-- Migration: Create tickets and daily checkins for Cerebrexia '26
-- Supports single & group tickets, 4 event days (Dec 17, 18, 19, 20),
-- and strictly enforces 1 scan per day per QR code at database level.

CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT UNIQUE NOT NULL,
  basic_registration_id UUID REFERENCES public.basic_registrations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  attendee_name TEXT NOT NULL,
  attendee_email TEXT NOT NULL,
  attendee_phone TEXT,
  attendee_college TEXT,
  role TEXT NOT NULL DEFAULT 'LEAD',
  qr_token TEXT UNIQUE NOT NULL,
  pass_type TEXT NOT NULL DEFAULT 'BASIC_REGISTRATION_PRONITES',
  payment_status TEXT NOT NULL DEFAULT 'PAID',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.ticket_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  event_day TEXT NOT NULL, -- 'DAY_1', 'DAY_2', 'DAY_3', 'DAY_4' or '2026-12-17'
  scan_date DATE NOT NULL DEFAULT CURRENT_DATE,
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  scanned_by TEXT DEFAULT 'Gate Volunteer',
  gate_location TEXT DEFAULT 'Main Gate',
  CONSTRAINT unique_ticket_daily_checkin UNIQUE (ticket_id, event_day)
);

-- Indices for rapid scanner lookups
CREATE INDEX IF NOT EXISTS idx_tickets_qr_token ON public.tickets(qr_token);
CREATE INDEX IF NOT EXISTS idx_tickets_email ON public.tickets(attendee_email);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_checkins_ticket_id ON public.ticket_checkins(ticket_id);
CREATE INDEX IF NOT EXISTS idx_checkins_event_day ON public.ticket_checkins(event_day);

-- Enable RLS
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_checkins ENABLE ROW LEVEL SECURITY;

-- Grants
GRANT ALL ON public.tickets TO authenticated;
GRANT ALL ON public.tickets TO service_role;
GRANT ALL ON public.tickets TO anon;

GRANT ALL ON public.ticket_checkins TO authenticated;
GRANT ALL ON public.ticket_checkins TO service_role;
GRANT ALL ON public.ticket_checkins TO anon;

-- RLS Policies for tickets
DROP POLICY IF EXISTS "Public can view valid tickets" ON public.tickets;
CREATE POLICY "Public can view valid tickets" ON public.tickets
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own tickets" ON public.tickets;
CREATE POLICY "Users can insert own tickets" ON public.tickets
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own tickets" ON public.tickets;
CREATE POLICY "Users can update own tickets" ON public.tickets
  FOR UPDATE USING (true);

-- RLS Policies for ticket_checkins
DROP POLICY IF EXISTS "Allow gate checkins" ON public.ticket_checkins;
CREATE POLICY "Allow gate checkins" ON public.ticket_checkins
  FOR ALL USING (true);
