-- Migration: Secure RPC function to allow Google Sheets Sync to export all existing fest data
-- Uses SECURITY DEFINER to bypass Row Level Security (RLS) safely for database synchronization.

CREATE OR REPLACE FUNCTION public.get_all_fest_data_for_sheets()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'participants', (SELECT coalesce(json_agg(p), '[]'::json) FROM public.participants p),
    'basic_registrations', (SELECT coalesce(json_agg(b), '[]'::json) FROM public.basic_registrations b),
    'sports_registrations', (SELECT coalesce(json_agg(s), '[]'::json) FROM public.sports_registrations s),
    'cultural_registrations', (SELECT coalesce(json_agg(c), '[]'::json) FROM public.cultural_registrations c),
    'event_form_responses', (SELECT coalesce(json_agg(f), '[]'::json) FROM public.event_form_responses f),
    'tickets', (SELECT coalesce(json_agg(t), '[]'::json) FROM public.tickets t)
  ) INTO result;
  RETURN result;
END;
$$;

-- Grant execution permission to anon, authenticated and service_role
GRANT EXECUTE ON FUNCTION public.get_all_fest_data_for_sheets() TO anon, authenticated, service_role;
