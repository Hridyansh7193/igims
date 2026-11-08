-- Migration: Create separate tables for Sports, Cultural, and Basic Registrations
-- While maintaining a single candidate identity entry in `participants` table.

-- 1. Ensure participants table has unique constraint on user_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'participants_user_id_key'
  ) THEN
    ALTER TABLE public.participants ADD CONSTRAINT participants_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- 2. Basic Registrations Table (Concert / Pronite Pass Only)
CREATE TABLE IF NOT EXISTS public.basic_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
  pass_type TEXT NOT NULL DEFAULT 'CONCERT_PRONITES',
  fee_amount NUMERIC NOT NULL DEFAULT 800,
  payment_status TEXT NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT basic_registrations_user_id_key UNIQUE (user_id)
);

-- 3. Sports Registrations Table
CREATE TABLE IF NOT EXISTS public.sports_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Sports',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT sports_registrations_user_event_key UNIQUE (user_id, event_name)
);

-- 4. Cultural Registrations Table
CREATE TABLE IF NOT EXISTS public.cultural_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Cultural',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT cultural_registrations_user_event_key UNIQUE (user_id, event_name)
);

-- Enable RLS
ALTER TABLE public.basic_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultural_registrations ENABLE ROW LEVEL SECURITY;

-- Grants
GRANT ALL ON public.basic_registrations TO authenticated;
GRANT ALL ON public.sports_registrations TO authenticated;
GRANT ALL ON public.cultural_registrations TO authenticated;
GRANT SELECT ON public.basic_registrations TO anon;
GRANT SELECT ON public.sports_registrations TO anon;
GRANT SELECT ON public.cultural_registrations TO anon;

-- RLS Policies for basic_registrations
DROP POLICY IF EXISTS "Users can view own basic registrations" ON public.basic_registrations;
CREATE POLICY "Users can view own basic registrations" ON public.basic_registrations
  FOR SELECT TO authenticated USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own basic registrations" ON public.basic_registrations;
CREATE POLICY "Users can insert own basic registrations" ON public.basic_registrations
  FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own basic registrations" ON public.basic_registrations;
CREATE POLICY "Users can update own basic registrations" ON public.basic_registrations
  FOR UPDATE TO authenticated USING ((select auth.uid()) = user_id);

-- RLS Policies for sports_registrations
DROP POLICY IF EXISTS "Users can view own sports registrations" ON public.sports_registrations;
CREATE POLICY "Users can view own sports registrations" ON public.sports_registrations
  FOR SELECT TO authenticated USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own sports registrations" ON public.sports_registrations;
CREATE POLICY "Users can insert own sports registrations" ON public.sports_registrations
  FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own sports registrations" ON public.sports_registrations;
CREATE POLICY "Users can delete own sports registrations" ON public.sports_registrations
  FOR DELETE TO authenticated USING ((select auth.uid()) = user_id);

-- RLS Policies for cultural_registrations
DROP POLICY IF EXISTS "Users can view own cultural registrations" ON public.cultural_registrations;
CREATE POLICY "Users can view own cultural registrations" ON public.cultural_registrations
  FOR SELECT TO authenticated USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own cultural registrations" ON public.cultural_registrations;
CREATE POLICY "Users can insert own cultural registrations" ON public.cultural_registrations
  FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own cultural registrations" ON public.cultural_registrations;
CREATE POLICY "Users can delete own cultural registrations" ON public.cultural_registrations
  FOR DELETE TO authenticated USING ((select auth.uid()) = user_id);
