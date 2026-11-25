-- Migration: Add permanent unique 4-digit gate number per ticket/person
-- Once assigned on first scan, it remains locked to this ticket across all 4 fest days
-- and cannot be assigned to another attendee.

ALTER TABLE public.tickets
  ADD COLUMN IF NOT EXISTS unique_code TEXT,
  ADD COLUMN IF NOT EXISTS unique_code_assigned_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS unique_code_assigned_by TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_tickets_unique_code
  ON public.tickets (unique_code)
  WHERE unique_code IS NOT NULL;
