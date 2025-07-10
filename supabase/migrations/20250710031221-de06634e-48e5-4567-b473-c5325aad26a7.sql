-- Create demo access control table
CREATE TABLE public.demo_access_control (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email_domain TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id), -- User ID is now nullable to allow domain-level records
  demo_type TEXT NOT NULL DEFAULT 'basic', -- 'basic', 'real_data', 'premium'
  data_record_limit INTEGER DEFAULT 100,
  access_granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_demo_at TIMESTAMP WITH TIME ZONE,
  demo_count INTEGER DEFAULT 0,
  is_blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.demo_access_control ENABLE ROW LEVEL SECURITY;

-- Create policies for demo access control
-- These policies will still require a user_id to be present for a user to manage their own records.
-- Initial domain access checks (via check_demo_access) and updates (via update_demo_access) are handled by SECURITY DEFINER functions.
CREATE POLICY "Users can view their own demo access" ON public.demo_access_control FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create demo access records" ON public.demo_access_control FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own demo access" ON public.demo_access_control FOR UPDATE USING (auth.uid() = user_id);

-- Create demo sessions table
CREATE TABLE public.demo_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  session_token UUID NOT NULL DEFAULT gen_random_uuid(),
  demo_type TEXT NOT NULL,
  source_connection_id UUID,
  destination_connection_id UUID,
  data_source_type TEXT NOT NULL, -- 'unified_api', 'manual_api', 'csv_upload'
  record_count INTEGER DEFAULT 0,
  processing_status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  session_data JSONB DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '24 hours'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.demo_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for demo sessions
CREATE POLICY "Users can manage their own demo sessions" ON public.demo_sessions FOR ALL USING (auth.uid() = user_id);

-- Create demo data table to store limited real data for demos
CREATE TABLE public.demo_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.demo_sessions(id) ON DELETE CASCADE,
  object_type TEXT NOT NULL,
  external_id TEXT,
  data JSONB NOT NULL,
  source_system TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.demo_data ENABLE ROW LEVEL SECURITY;

-- Create policies for demo data
CREATE POLICY "Users can access demo data for their sessions" ON public.demo_data FOR ALL USING (EXISTS (
  SELECT 1 FROM public.demo_sessions ds
  WHERE ds.id = demo_data.session_id
  AND ds.user_id = auth.uid()));

-- Create function to check demo access
CREATE OR REPLACE FUNCTION public.check_demo_access(p_email_domain TEXT)
RETURNS TABLE(
  can_access BOOLEAN,
  demo_type TEXT,
  record_limit INTEGER,
  reason TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'pg_catalog', 'public'
AS $$
DECLARE
  v_access_record RECORD;
BEGIN
  -- Check if domain exists and get access info
  SELECT * INTO v_access_record
  FROM public.demo_access_control
  WHERE email_domain = p_email_domain;

  -- If no record exists, allow basic demo access with a default record limit
  IF NOT FOUND THEN
    RETURN QUERY SELECT true, 'basic'::TEXT, 100::INTEGER, 'New domain - basic access granted'::TEXT;
    RETURN;
  END IF;

  -- Check if blocked
  IF v_access_record.is_blocked THEN
    RETURN QUERY SELECT false, v_access_record.demo_type, v_access_record.data_record_limit, 'Domain is blocked'::TEXT;
    RETURN;
  END IF;

  -- Check demo count limits (max 3 demos per domain for real data)
  IF v_access_record.demo_type = 'real_data' AND v_access_record.demo_count >= 3 THEN
    RETURN QUERY SELECT false, v_access_record.demo_type, v_access_record.data_record_limit, 'Demo limit exceeded for this domain'::TEXT;
    RETURN;
  END IF;

  -- Access granted
  RETURN QUERY SELECT true, v_access_record.demo_type, v_access_record.data_record_limit, 'Access granted'::TEXT;
END;
$$;

-- Create function to update demo access
CREATE OR REPLACE FUNCTION public.update_demo_access(
  p_email_domain TEXT,
  p_demo_type TEXT DEFAULT 'real_data',
  p_data_record_limit INTEGER DEFAULT 100 -- New parameter for flexible record limit
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'pg_catalog', 'public'
AS $$
DECLARE
  v_access_id UUID;
BEGIN
  -- Insert or update demo access record
  INSERT INTO public.demo_access_control
     (email_domain, user_id, demo_type, data_record_limit, demo_count)
  VALUES
     (p_email_domain, auth.uid(), p_demo_type, p_data_record_limit, 1) -- Use p_data_record_limit
  ON CONFLICT (email_domain)
   DO UPDATE SET
    user_id = COALESCE(demo_access_control.user_id, auth.uid()), -- Ensure user_id is set if it was null
    demo_count = demo_access_control.demo_count + 1,
    last_demo_at = now(),
    updated_at = now(),
    -- Optionally update demo_type and data_record_limit on conflict
    demo_type = EXCLUDED.demo_type,
    data_record_limit = EXCLUDED.data_record_limit
  RETURNING id INTO v_access_id;

  RETURN v_access_id;
END;
$$;

-- Placeholder for the update_updated_at_column function if not already defined:
-- This function is typically used for `updated_at` triggers.
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for timestamp updates
CREATE TRIGGER update_demo_access_control_updated_at
  BEFORE UPDATE ON public.demo_access_control
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_demo_sessions_updated_at
  BEFORE UPDATE ON public.demo_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();