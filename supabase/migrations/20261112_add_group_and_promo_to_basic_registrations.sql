-- Migration: Add group registration & promo code support to basic_registrations table
ALTER TABLE public.basic_registrations 
  ADD COLUMN IF NOT EXISTS registration_type TEXT DEFAULT 'SINGLE',
  ADD COLUMN IF NOT EXISTS group_size INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS group_members JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS promo_code TEXT,
  ADD COLUMN IF NOT EXISTS discount_amount NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS final_amount NUMERIC DEFAULT 2000,
  ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
  ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;

