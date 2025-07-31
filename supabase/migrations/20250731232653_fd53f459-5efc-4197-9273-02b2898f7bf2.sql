-- Add 2FA support to user profiles
CREATE TABLE IF NOT EXISTS public.user_security_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    two_factor_enabled BOOLEAN NOT NULL DEFAULT false,
    totp_secret BYTEA, -- Encrypted TOTP secret
    backup_codes TEXT[], -- Encrypted backup codes
    last_totp_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_security_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for user security settings
CREATE POLICY "Users can view their own security settings" 
ON public.user_security_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own security settings" 
ON public.user_security_settings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own security settings" 
ON public.user_security_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_security_settings_updated_at
    BEFORE UPDATE ON public.user_security_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add encryption indicators table for tracking what data is encrypted
CREATE TABLE IF NOT EXISTS public.encryption_status (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    service_name TEXT NOT NULL,
    credential_count INTEGER NOT NULL DEFAULT 0,
    last_encrypted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    encryption_algorithm TEXT NOT NULL DEFAULT 'AES-256-GCM',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, service_name)
);

-- Enable RLS
ALTER TABLE public.encryption_status ENABLE ROW LEVEL SECURITY;

-- Create policies for encryption status
CREATE POLICY "Users can view their own encryption status" 
ON public.encryption_status 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can update encryption status" 
ON public.encryption_status 
FOR ALL 
USING (true);

-- Create trigger for encryption status timestamps
CREATE TRIGGER update_encryption_status_updated_at
    BEFORE UPDATE ON public.encryption_status
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_user_security_settings_user_id ON public.user_security_settings(user_id);
CREATE INDEX idx_encryption_status_user_id ON public.encryption_status(user_id);
CREATE INDEX idx_audit_log_user_id_created_at ON public.audit_log(user_id, created_at DESC);