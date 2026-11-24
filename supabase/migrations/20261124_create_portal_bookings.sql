-- Migration: Dedicated table for offline / desk booking portal
-- Allows booking multiple Basic Registrations (single or groups) with a single email address
-- without conflicts with auth.users or user_id unique constraints.

CREATE TABLE IF NOT EXISTS public.portal_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id TEXT UNIQUE NOT NULL,
  booked_by TEXT NOT NULL DEFAULT 'booking_desk',
  registration_type TEXT NOT NULL DEFAULT 'SINGLE', -- 'SINGLE' or 'GROUP'
  group_size INTEGER NOT NULL DEFAULT 1,
  lead_name TEXT NOT NULL,
  lead_email TEXT NOT NULL,
  lead_phone TEXT,
  lead_college TEXT,
  candidates JSONB NOT NULL DEFAULT '[]'::jsonb,
  promo_code TEXT,
  discount_amount NUMERIC NOT NULL DEFAULT 0,
  final_amount NUMERIC NOT NULL DEFAULT 2000,
  payment_status TEXT NOT NULL DEFAULT 'PAID',
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  ticket_numbers TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_portal_bookings_booking_id ON public.portal_bookings(booking_id);
CREATE INDEX IF NOT EXISTS idx_portal_bookings_lead_email ON public.portal_bookings(lead_email);
CREATE INDEX IF NOT EXISTS idx_portal_bookings_rzp_payment ON public.portal_bookings(razorpay_payment_id);

-- Enable RLS
ALTER TABLE public.portal_bookings ENABLE ROW LEVEL SECURITY;

-- Grants
GRANT ALL ON public.portal_bookings TO authenticated;
GRANT ALL ON public.portal_bookings TO service_role;
GRANT ALL ON public.portal_bookings TO anon;

-- Policies for portal_bookings
DROP POLICY IF EXISTS "Public can view portal bookings" ON public.portal_bookings;
CREATE POLICY "Public can view portal bookings" ON public.portal_bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert portal bookings" ON public.portal_bookings;
CREATE POLICY "Public can insert portal bookings" ON public.portal_bookings FOR INSERT WITH CHECK (true);

-- Ensure participants table allows insert for booking desk candidates
DROP POLICY IF EXISTS "Allow portal insert into participants" ON public.participants;
CREATE POLICY "Allow portal insert into participants" ON public.participants FOR INSERT WITH CHECK (true);
