-- CareFur push notification delivery: app devices and sent-event idempotency.
-- Customers have no direct table access; functions authenticate with Supabase JWT.
CREATE TABLE IF NOT EXISTS public.carefur_feeding_push_tokens (
  expo_push_token text PRIMARY KEY,
  auth_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform IN ('android','ios')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS carefur_feeding_push_tokens_user_idx
  ON public.carefur_feeding_push_tokens(auth_user_id);
ALTER TABLE public.carefur_feeding_push_tokens ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.carefur_feeding_push_tokens FROM anon, authenticated;

CREATE TABLE IF NOT EXISTS public.carefur_feeding_push_events (
  event_key text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.carefur_feeding_push_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.carefur_feeding_push_events FROM anon, authenticated;
