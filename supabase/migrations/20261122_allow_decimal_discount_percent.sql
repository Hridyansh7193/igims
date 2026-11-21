-- Migration: Allow decimal discount percentages (e.g. 12.5%, 33.33%, 7.5%) in promo_codes table
-- Festival: Cerebrexia '26, IGIMS Patna

-- 1. Alter discount_percent from INTEGER to NUMERIC (supports any decimal / fractional discount)
ALTER TABLE public.promo_codes 
  ALTER COLUMN discount_percent TYPE NUMERIC;

-- 2. Update CHECK constraint to support positive decimals up to 100
ALTER TABLE public.promo_codes 
  DROP CONSTRAINT IF EXISTS promo_codes_discount_percent_check;

ALTER TABLE public.promo_codes 
  ADD CONSTRAINT promo_codes_discount_percent_check 
  CHECK (discount_percent > 0 AND discount_percent <= 100);
