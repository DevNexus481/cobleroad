-- =============================================================================
-- COBLEROAD — Migration 005: Persistent Carts & Guest Sessions
-- Supports Amazon/Flipkart-style long-term guest cart persistence,
-- server-side merge idempotency, and activity tracking.
-- =============================================================================

-- 1. Ensure carts table has activity tracking and expiry
ALTER TABLE carts ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE carts ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '365 days');

-- 2. Ensure session_id has index for fast lookup of 1-year guest carts
CREATE INDEX IF NOT EXISTS idx_carts_session_id_lookup ON carts(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_carts_user_id_lookup ON carts(user_id) WHERE user_id IS NOT NULL;

-- 3. Update RLS policies to allow guest carts with session_id to be safely handled
-- Authenticated users own their cart by user_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'carts_user_owner' AND tablename = 'carts'
  ) THEN
    CREATE POLICY "carts_user_owner" ON carts
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;
