-- ==============================================================================
-- CEREBREXIA '26 — STAGING DATABASE SCHEMA & INITIALIZATION SETUP
-- ==============================================================================
-- Use this script to initialize a fresh Supabase staging project for Vercel
-- Preview deployments and automated testing.
--
-- Contains:
-- 1. Full schema (participants, registrations, tickets, promo codes, etc.)
-- 2. Indexes and constraints
-- 3. Row-Level Security (RLS) policies
-- 4. Clean, synthetic non-production test seed data (ZERO production data)
-- ==============================================================================

-- 1. PARTICIPANTS (Master Delegate Table)
CREATE TABLE IF NOT EXISTS public.participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  college_name TEXT NOT NULL,
  college_city TEXT NOT NULL,
  college_state TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'PENDING',
  reminder_sent_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. BASIC REGISTRATIONS (Concert / Pronite Passes)
CREATE TABLE IF NOT EXISTS public.basic_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
  pass_type TEXT NOT NULL DEFAULT 'CONCERT_PRONITES',
  fee_amount NUMERIC NOT NULL DEFAULT 2000,
  payment_status TEXT NOT NULL DEFAULT 'PAID',
  registration_type TEXT DEFAULT 'SINGLE',
  group_size INTEGER DEFAULT 1,
  promo_code TEXT,
  discount_amount NUMERIC DEFAULT 0,
  final_amount NUMERIC DEFAULT 2000,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT basic_registrations_user_id_key UNIQUE (user_id)
);

-- 3. SPORTS REGISTRATIONS
CREATE TABLE IF NOT EXISTS public.sports_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Sports',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT sports_registrations_user_event_key UNIQUE (user_id, event_name)
);

-- 4. CULTURAL REGISTRATIONS
CREATE TABLE IF NOT EXISTS public.cultural_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Cultural',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT cultural_registrations_user_event_key UNIQUE (user_id, event_name)
);

-- 5. TICKETS (Digital Credentials & Gate Passes)
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
  unique_code TEXT,
  unique_code_assigned_at TIMESTAMPTZ,
  unique_code_assigned_by TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. TICKET CHECKINS (Daily Festival Gate Entry Records)
CREATE TABLE IF NOT EXISTS public.ticket_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  event_day TEXT NOT NULL, -- 'DAY_1', 'DAY_2', 'DAY_3', 'DAY_4'
  scan_date DATE NOT NULL DEFAULT CURRENT_DATE,
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  scanned_by TEXT DEFAULT 'Gate Volunteer',
  gate_location TEXT DEFAULT 'Main Gate',
  CONSTRAINT unique_ticket_daily_checkin UNIQUE (ticket_id, event_day)
);

-- 7. PROMO CODES
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_percent NUMERIC(5,2) NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  max_uses INTEGER,
  times_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. ACCOMMODATION BOOKINGS
CREATE TABLE IF NOT EXISTS public.accommodation_bookings (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  booking_id TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  college TEXT,
  gender TEXT NOT NULL, -- 'BOYS' or 'GIRLS'
  selected_dates JSONB NOT NULL DEFAULT '[]'::jsonb,
  num_days INTEGER NOT NULL DEFAULT 1,
  price_per_day NUMERIC(10,2) NOT NULL DEFAULT 150.00,
  amount_inr NUMERIC(10,2) NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  payment_status TEXT NOT NULL DEFAULT 'PAID',
  status TEXT NOT NULL DEFAULT 'CONFIRMED',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. EVENT PAYMENTS
CREATE TABLE IF NOT EXISTS public.event_payments (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_name TEXT,
  form_slug TEXT,
  selection TEXT,
  amount_inr NUMERIC(10,2) NOT NULL,
  razorpay_order_id TEXT NOT NULL,
  razorpay_payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'CREATED', -- 'CREATED', 'PAID'
  payload JSONB,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. EVENT FORM RESPONSES
CREATE TABLE IF NOT EXISTS public.event_form_responses (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_id TEXT,
  event_name TEXT NOT NULL,
  category TEXT,
  form_slug TEXT,
  form_label TEXT,
  form_title TEXT,
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT event_form_responses_user_event_key UNIQUE (user_id, event_name)
);

-- 11. PORTAL BOOKINGS
CREATE TABLE IF NOT EXISTS public.portal_bookings (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  booking_id TEXT NOT NULL UNIQUE,
  booked_by TEXT NOT NULL,
  registration_type TEXT NOT NULL DEFAULT 'SINGLE',
  group_size INTEGER NOT NULL DEFAULT 1,
  lead_name TEXT NOT NULL,
  lead_email TEXT NOT NULL,
  lead_phone TEXT,
  lead_college TEXT,
  promo_code TEXT,
  discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  final_amount NUMERIC(10,2) NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  tickets JSONB NOT NULL DEFAULT '[]'::jsonb,
  candidates JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. PAYMENT RECONCILIATIONS
CREATE TABLE IF NOT EXISTS public.payment_reconciliations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  razorpay_payment_id TEXT NOT NULL UNIQUE,
  razorpay_order_id TEXT,
  lead_name TEXT NOT NULL,
  lead_email TEXT NOT NULL,
  lead_phone TEXT,
  lead_college TEXT,
  tickets JSONB NOT NULL DEFAULT '[]'::jsonb,
  attendee_names JSONB NOT NULL DEFAULT '[]'::jsonb,
  attendee_emails JSONB NOT NULL DEFAULT '[]'::jsonb,
  promo_code TEXT,
  source TEXT NOT NULL DEFAULT 'RAZORPAY_WEB',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_participants_user_id ON public.participants(user_id);
CREATE INDEX IF NOT EXISTS idx_participants_email ON public.participants(email);
CREATE INDEX IF NOT EXISTS idx_tickets_qr_token ON public.tickets(qr_token);
CREATE INDEX IF NOT EXISTS idx_tickets_email ON public.tickets(attendee_email);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_unique_code ON public.tickets(unique_code);
CREATE INDEX IF NOT EXISTS idx_checkins_ticket_id ON public.ticket_checkins(ticket_id);
CREATE INDEX IF NOT EXISTS idx_checkins_event_day ON public.ticket_checkins(event_day);
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON public.promo_codes(code);

-- ==============================================================================
-- ROW-LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.basic_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultural_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accommodation_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_form_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_reconciliations ENABLE ROW LEVEL SECURITY;

-- Grants
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT ON public.promo_codes TO anon, authenticated;
GRANT SELECT ON public.tickets TO anon, authenticated;
GRANT ALL ON public.participants TO authenticated;
GRANT ALL ON public.basic_registrations TO authenticated;
GRANT ALL ON public.sports_registrations TO authenticated;
GRANT ALL ON public.cultural_registrations TO authenticated;
GRANT ALL ON public.accommodation_bookings TO authenticated;
GRANT ALL ON public.event_payments TO authenticated;
GRANT ALL ON public.event_form_responses TO authenticated;

-- Policies
CREATE POLICY "Public promo read" ON public.promo_codes FOR SELECT USING (true);
CREATE POLICY "Public tickets read" ON public.tickets FOR SELECT USING (true);
CREATE POLICY "Own participants read" ON public.participants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Own participants update" ON public.participants FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own accommodation read" ON public.accommodation_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Own accommodation insert" ON public.accommodation_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- SYNTHETIC TEST SEED DATA (SAFE FOR STAGING ONLY)
-- ==============================================================================
INSERT INTO public.promo_codes (code, discount_percent, description, is_active, max_uses, times_used)
VALUES
  ('TEST50', 50.00, '50% Staging Test Discount', true, 100, 0),
  ('TEST100', 100.00, '100% Free Pass Test Discount', true, 50, 0),
  ('STAGINGVIP', 25.00, '25% VIP Staging Test Code', true, 10, 0)
ON CONFLICT (code) DO NOTHING;
