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

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_demo_completion_leads_updated_at
BEFORE UPDATE ON public.demo_completion_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();