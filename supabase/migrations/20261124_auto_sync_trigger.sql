-- ==============================================================================
-- Migration: Automatic Database Trigger for Payment Reconciliation
-- Automatically and instantly syncs any new or updated ticket into
-- public.payment_reconciliations with zero manual action required.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.auto_sync_ticket_to_payment_reconciliation()
RETURNS TRIGGER AS $$
DECLARE
  v_pay_id TEXT;
  v_order_id TEXT;
  v_promo TEXT;
  v_ticket_count INT;
  v_ticket_nums TEXT[];
  v_names TEXT[];
  v_emails TEXT[];
BEGIN
  -- Extract razorpay_payment_id from metadata
  v_pay_id := TRIM(COALESCE(NEW.metadata->>'razorpay_payment_id', ''));
  
  -- Only process if payment_id exists
  IF v_pay_id IS NOT NULL AND v_pay_id <> '' THEN
    v_order_id := NEW.metadata->>'razorpay_order_id';
    v_promo := NEW.metadata->>'promo_code';

    -- Aggregate all tickets matching this payment_id
    SELECT 
      COUNT(*),
      ARRAY_AGG(ticket_number ORDER BY ticket_number),
      ARRAY_AGG(attendee_name ORDER BY ticket_number),
      ARRAY_AGG(attendee_email ORDER BY ticket_number)
    INTO 
      v_ticket_count,
      v_ticket_nums,
      v_names,
      v_emails
    FROM public.tickets
    WHERE metadata->>'razorpay_payment_id' = v_pay_id;

    -- Upsert directly into payment_reconciliations
    INSERT INTO public.payment_reconciliations (
      razorpay_payment_id,
      razorpay_order_id,
      lead_name,
      lead_email,
      lead_phone,
      lead_college,
      ticket_count,
      ticket_numbers,
      attendee_names,
      attendee_emails,
      amount_paid,
      promo_code,
      payment_status,
      source,
      updated_at
    ) VALUES (
      v_pay_id,
      v_order_id,
      COALESCE(NEW.attendee_name, 'Attendee'),
      COALESCE(NEW.attendee_email, ''),
      NEW.attendee_phone,
      NEW.attendee_college,
      COALESCE(v_ticket_count, 1),
      COALESCE(v_ticket_nums, ARRAY[NEW.ticket_number]),
      COALESCE(v_names, ARRAY[NEW.attendee_name]),
      COALESCE(v_emails, ARRAY[NEW.attendee_email]),
      COALESCE(v_ticket_count, 1) * 2000,
      v_promo,
      'PAID',
      COALESCE(NEW.metadata->>'source', 'AUTO_TRIGGER'),
      NOW()
    )
    ON CONFLICT (razorpay_payment_id) DO UPDATE SET
      ticket_count = EXCLUDED.ticket_count,
      ticket_numbers = EXCLUDED.ticket_numbers,
      attendee_names = EXCLUDED.attendee_names,
      attendee_emails = EXCLUDED.attendee_emails,
      amount_paid = EXCLUDED.amount_paid,
      promo_code = COALESCE(EXCLUDED.promo_code, payment_reconciliations.promo_code),
      updated_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_auto_sync_ticket_reconciliation ON public.tickets;
CREATE TRIGGER trg_auto_sync_ticket_reconciliation
AFTER INSERT OR UPDATE ON public.tickets
FOR EACH ROW
EXECUTE FUNCTION public.auto_sync_ticket_to_payment_reconciliation();
