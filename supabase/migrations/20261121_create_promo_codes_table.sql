-- Migration: Create promo_codes table for dynamic admin discount management
-- Festival: Cerebrexia '26, IGIMS Patna
-- Security Hardened: Restrict writes to service_role to prevent unauthorized anonymous tampering

CREATE TABLE IF NOT EXISTS public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_percent INTEGER NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
  description TEXT DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  max_uses INTEGER DEFAULT NULL,
  times_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Case-insensitive index on code
CREATE UNIQUE INDEX IF NOT EXISTS idx_promo_codes_upper_code ON public.promo_codes (UPPER(code));
CREATE INDEX IF NOT EXISTS idx_promo_codes_active ON public.promo_codes (is_active);

-- Enable Row Level Security
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- Allow public read of promo codes (so attendees can validate at checkout)
DROP POLICY IF EXISTS "Allow public read of promo_codes" ON public.promo_codes;
CREATE POLICY "Allow public read of promo_codes"
  ON public.promo_codes FOR SELECT
  USING (true);

-- Restrict write/insert/delete access to authenticated service role or admin (OWASP A01: Broken Access Control)
DROP POLICY IF EXISTS "Allow write access to promo_codes" ON public.promo_codes;
CREATE POLICY "Allow service_role write access to promo_codes"
  ON public.promo_codes FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
