-- ==============================================================================
-- Migration: Payment Reconciliations & Fraud Verification Table
-- Maps every Razorpay Payment ID / Reference ID directly to its issued BR tickets,
-- attendees, payment amounts, and promo codes for instant 2-second verification.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.payment_reconciliations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razorpay_payment_id TEXT UNIQUE NOT NULL,
  razorpay_order_id TEXT,
  lead_name TEXT NOT NULL,
  lead_email TEXT NOT NULL,
  lead_phone TEXT,
  lead_college TEXT,
  ticket_count INTEGER NOT NULL DEFAULT 1,
  ticket_numbers TEXT[] NOT NULL DEFAULT '{}',
  attendee_names TEXT[] NOT NULL DEFAULT '{}',
  attendee_emails TEXT[] NOT NULL DEFAULT '{}',
  amount_paid NUMERIC,
  promo_code TEXT,
  payment_status TEXT NOT NULL DEFAULT 'PAID',
  source TEXT DEFAULT 'WEB_CHECKOUT',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_reconcil_pay_id ON public.payment_reconciliations(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_reconcil_lead_email ON public.payment_reconciliations(lead_email);
CREATE INDEX IF NOT EXISTS idx_reconcil_lead_phone ON public.payment_reconciliations(lead_phone);

-- Enable RLS
ALTER TABLE public.payment_reconciliations ENABLE ROW LEVEL SECURITY;

-- Grants
GRANT ALL ON public.payment_reconciliations TO authenticated;
GRANT ALL ON public.payment_reconciliations TO service_role;
GRANT ALL ON public.payment_reconciliations TO anon;

-- Policies
DROP POLICY IF EXISTS "Public can view payment reconciliations" ON public.payment_reconciliations;
CREATE POLICY "Public can view payment reconciliations" ON public.payment_reconciliations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert payment reconciliations" ON public.payment_reconciliations;
CREATE POLICY "Public can insert payment reconciliations" ON public.payment_reconciliations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update payment reconciliations" ON public.payment_reconciliations;
CREATE POLICY "Public can update payment reconciliations" ON public.payment_reconciliations FOR UPDATE USING (true);
