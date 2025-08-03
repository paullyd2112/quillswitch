-- Temporarily disable the problematic trigger for credential validation
-- This trigger is causing foreign key violations for OAuth connections
DROP TRIGGER IF EXISTS validate_credential_access_trigger ON public.service_credentials;

-- Create a simpler trigger that doesn't cause the foreign key issue
CREATE OR REPLACE FUNCTION public.validate_credential_access_simple()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog', 'public'
AS $function$
BEGIN
  -- Only ensure user_id is set correctly on insert (no logging to avoid FK issues)
  IF TG_OP = 'INSERT' THEN
    NEW.user_id := auth.uid();
  END IF;
  
  -- Validate expiry date
  IF NEW.expires_at IS NOT NULL AND NEW.expires_at <= now() THEN
    RAISE EXCEPTION 'Credential expiry date cannot be in the past';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create new trigger without the problematic logging
CREATE TRIGGER validate_credential_access_simple_trigger
  BEFORE INSERT OR UPDATE ON public.service_credentials
  FOR EACH ROW EXECUTE FUNCTION public.validate_credential_access_simple();