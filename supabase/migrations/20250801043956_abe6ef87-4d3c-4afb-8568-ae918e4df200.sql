-- ###############################################################
-- ###          Enhanced Authentication Security Script          ###
-- ###############################################################

-- ## Section 1: Password Strength Validation ##
-- =============================================================
-- This function uses a single, combined regular expression to validate password complexity.
CREATE OR REPLACE FUNCTION public.validate_password_strength(password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN
    LENGTH(password) >= 8 AND
    password ~ '(?=.*[A-Z])' AND -- Must contain one uppercase letter
    password ~ '(?=.*[a-z])' AND -- Must contain one lowercase letter
    password ~ '(?=.*[0-9])' AND -- Must contain one number
    password ~ '(?=.*[!@#$%^&*(),.?":{}|<>])'; -- Must contain one special character
END;
$$ LANGUAGE plpgsql;

-- ## Section 2: Login Attempt Tracking & Account Lockout ##
-- =================================================================
-- Create table to track failed login attempts.
CREATE TABLE IF NOT EXISTS public.login_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  ip_address INET,
  attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  success BOOLEAN NOT NULL DEFAULT FALSE,
  user_agent TEXT
);

-- Enable Row Level Security (RLS) on the login attempts table.
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view login attempt records.
-- Assumes a 'profiles' table with a 'role' column exists.
CREATE POLICY "Admins can view login attempts" ON public.login_attempts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create an index for performance on checking failed attempts.
CREATE INDEX IF NOT EXISTS idx_login_attempts_email_time ON public.login_attempts(email, attempted_at DESC);

-- This function logs every login attempt.
CREATE OR REPLACE FUNCTION public.log_login_attempt(
  user_email TEXT,
  client_ip INET DEFAULT NULL,
  is_success BOOLEAN DEFAULT FALSE,
  client_user_agent TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.login_attempts (email, ip_address, success, user_agent)
  VALUES (user_email, client_ip, is_success, client_user_agent);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- This function checks if an account should be locked due to too many failed attempts.
CREATE OR REPLACE FUNCTION public.check_account_lockout(
  user_email TEXT,
  client_ip INET DEFAULT NULL
)
RETURNS TABLE(is_locked BOOLEAN, lockout_until TIMESTAMP WITH TIME ZONE) AS $$
DECLARE
  failed_attempts INTEGER;
  last_failure TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Count failed attempts in the last 15 minutes. Locks after 5 failures.
  SELECT COUNT(*), MAX(attempted_at)
  INTO failed_attempts, last_failure
  FROM public.login_attempts
  WHERE email = user_email
    AND attempted_at > now() - INTERVAL '15 minutes'
    AND success = FALSE
    AND (client_ip IS NULL OR ip_address = client_ip);

  IF failed_attempts >= 5 THEN
    RETURN QUERY SELECT TRUE, last_failure + INTERVAL '15 minutes';
  ELSE
    RETURN QUERY SELECT FALSE, NULL::TIMESTAMP WITH TIME ZONE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ## Section 3: Efficient API Rate Limiting ##
-- ===================================================
-- This implementation uses an efficient "UPSERT" method to avoid table bloat.
-- It has one row per key per time window, which is much more scalable.
CREATE TABLE IF NOT EXISTS public.rate_limits (
  key TEXT PRIMARY KEY,
  request_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for efficient cleanup of old records.
CREATE INDEX IF NOT EXISTS idx_rate_limits_created_at ON public.rate_limits(created_at);

-- This function checks and increments the rate limit counter.
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  key_prefix TEXT,
  max_requests INTEGER,
  window_minutes INTEGER DEFAULT 1
)
RETURNS BOOLEAN AS $$
DECLARE
  rate_limit_key TEXT;
  current_count INTEGER;
  window_start_time BIGINT;
BEGIN
  -- Generate a unique key for the current time window.
  window_start_time := (EXTRACT(EPOCH FROM now()) / (window_minutes * 60))::BIGINT;
  rate_limit_key := key_prefix || ':' || window_start_time;

  -- Atomically insert or update the request count and return the new count.
  INSERT INTO public.rate_limits (key) VALUES (rate_limit_key)
  ON CONFLICT (key) DO UPDATE
  SET request_count = public.rate_limits.request_count + 1
  RETURNING request_count INTO current_count;

  -- Check if the limit has been exceeded.
  RETURN current_count <= max_requests;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ## Section 4: Database Cleanup ##
-- =====================================
-- This function deletes old records to keep tables lean.
CREATE OR REPLACE FUNCTION public.cleanup_old_records()
RETURNS VOID AS $$
BEGIN
  -- Delete rate limit records older than 1 hour.
  DELETE FROM public.rate_limits
  WHERE created_at < now() - INTERVAL '1 hour';

  -- Delete login attempt records older than 24 hours.
  DELETE FROM public.login_attempts
  WHERE attempted_at < now() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;