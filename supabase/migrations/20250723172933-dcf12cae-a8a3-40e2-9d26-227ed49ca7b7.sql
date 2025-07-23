-- Create a table for temporary OAuth state storage
CREATE TABLE IF NOT EXISTS public.oauth_state (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  state_key TEXT NOT NULL,
  code_verifier TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '10 minutes'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.oauth_state ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can manage their own OAuth state" 
ON public.oauth_state 
FOR ALL
USING (auth.uid() = user_id);

-- Create index for cleanup
CREATE INDEX idx_oauth_state_expires_at ON public.oauth_state(expires_at);

-- Create function to cleanup expired OAuth state
CREATE OR REPLACE FUNCTION cleanup_expired_oauth_state()
RETURNS void AS $$
BEGIN
  DELETE FROM public.oauth_state WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;