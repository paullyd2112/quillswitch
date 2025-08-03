-- Fix security warning by updating search path for the function
CREATE OR REPLACE FUNCTION public.update_cleansing_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'pg_catalog', 'public';