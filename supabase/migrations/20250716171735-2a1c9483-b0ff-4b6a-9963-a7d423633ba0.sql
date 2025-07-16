-- Create demo completion leads table for founder-led sales
CREATE TABLE public.demo_completion_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  current_crm TEXT,
  target_crm TEXT,
  estimated_records INTEGER,
  timeline TEXT,
  pain_points TEXT,
  demo_session_id UUID REFERENCES demo_sessions(id),
  lead_status TEXT NOT NULL DEFAULT 'new',
  follow_up_scheduled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.demo_completion_leads ENABLE ROW LEVEL SECURITY;

-- Create policies

-- Policy 1: Users can create their own leads
CREATE POLICY "Users can create their own leads"
ON public.demo_completion_leads
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy 2: Users can view their own leads
CREATE POLICY "Users can view their own leads"
ON public.demo_completion_leads
FOR SELECT
USING (auth.uid() = user_id);

-- Policy 3: Users can update their own leads
CREATE POLICY "Users can update their own leads"
ON public.demo_completion_leads
FOR UPDATE
USING (auth.uid() = user_id);

-- Policy 4 (NEW): Admins can view all leads
-- This policy allows users with a specific role (e.g., 'service_role' or a custom 'admin' role)
-- to view all records, essentially bypassing the user_id restriction for administrative purposes.
-- You would typically interact with your database as an admin from your backend,
-- using a service role key that has higher privileges.
CREATE POLICY "Admins can view all leads"
ON public.demo_completion_leads
FOR SELECT
USING (
    -- Allow access if the request is coming from an authenticated service role (e.g., via a backend API)
    -- or if the user is explicitly identified as an admin in your auth system (e.g., by checking their 'role' column if you have one).
    -- For Supabase, 'service_role' is a common way to do this from a secure backend environment.
    -- If you have an 'admin' role assigned to your user account, you might use: auth.role() = 'admin'
    -- Or, if you manage user roles in the 'public.users' table, you'd join/subquery to check.
    -- For simplicity, let's assume you'll use the 'service_role' key from your backend for admin views.
    -- If you need a front-end admin view, you'd need a more explicit 'admin' role check on the user's JWT.
    current_setting('request.jwt.claims', true)::jsonb ->> 'role' = 'service_role'
    OR
    EXISTS (SELECT 1 FROM public.profiles WHERE public.profiles.id = auth.uid() AND public.profiles.is_admin = TRUE) -- Example: If you have an admin flag in a profiles table
);


-- Policy 5 (NEW): Admins can update all leads (optional, but likely needed for status changes)
-- This policy allows admins to update the status or other fields for any lead.
CREATE POLICY "Admins can update all leads"
ON public.demo_completion_leads
FOR UPDATE
USING (
    current_setting('request.jwt.claims', true)::jsonb ->> 'role' = 'service_role'
    OR
    EXISTS (SELECT 1 FROM public.profiles WHERE public.profiles.id = auth.uid() AND public.profiles.is_admin = TRUE)
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_demo_completion_leads_updated_at
BEFORE UPDATE ON public.demo_completion_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();