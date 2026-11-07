-- CareFur sharing metadata; no existing invitation, booking or owner is deleted.
BEGIN;
ALTER TABLE public.booking_access ADD COLUMN IF NOT EXISTS access_type text NOT NULL DEFAULT 'owner';
ALTER TABLE public.booking_access ADD COLUMN IF NOT EXISTS redeemed_by_user_id uuid REFERENCES auth.users(id);
-- Existing rows are owner invitations; only newly generated rows use 'shared'.
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.booking_access'::regclass AND conname='booking_access_type_check') THEN
  ALTER TABLE public.booking_access ADD CONSTRAINT booking_access_type_check CHECK(access_type IN ('owner','shared'));
 END IF;
END $$;
CREATE INDEX IF NOT EXISTS carefur_booking_shares_lookup ON public.booking_access (booking_id,access_type,expires_at) WHERE revoked_at IS NULL;
-- Protect the five-invite limit against concurrent requests at the database layer.
CREATE OR REPLACE FUNCTION public.carefur_limit_shared_invitations()
RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$
DECLARE v_count integer;
BEGIN
  IF NEW.access_type <> 'shared' OR NEW.revoked_at IS NOT NULL THEN RETURN NEW; END IF;
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(NEW.booking_id::text,0));
  SELECT count(*) INTO v_count FROM public.booking_access ba
   WHERE ba.booking_id=NEW.booking_id AND ba.access_type='shared'
   AND ba.revoked_at IS NULL AND ba.expires_at > now();
  IF v_count >= 5 THEN RAISE EXCEPTION 'Maximum five active shared invitations per booking'; END IF;
  IF EXISTS (SELECT 1 FROM public.booking_access ba WHERE ba.booking_id=NEW.booking_id
    AND ba.access_type='shared' AND ba.revoked_at IS NULL AND ba.expires_at>now()
    AND lower(btrim(ba.invited_email))=lower(btrim(NEW.invited_email))) THEN
    RAISE EXCEPTION 'This email already has active access';
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS carefur_limit_shared_invitations_insert ON public.booking_access;
CREATE TRIGGER carefur_limit_shared_invitations_insert
BEFORE INSERT ON public.booking_access FOR EACH ROW
EXECUTE FUNCTION public.carefur_limit_shared_invitations();
-- Direct writes remain staff-only under existing RLS; sharing endpoints use a server-side service role.
COMMIT;
