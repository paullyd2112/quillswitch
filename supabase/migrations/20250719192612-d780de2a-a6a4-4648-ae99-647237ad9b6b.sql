-- Fix database function security vulnerabilities by adding proper search_path settings

-- Update functions to include security definer with proper search path
ALTER FUNCTION public.update_updated_at_column() SET search_path = pg_catalog, public;
ALTER FUNCTION public.update_timestamp_column() SET search_path = pg_catalog, public;
ALTER FUNCTION public.handle_new_user() SET search_path = pg_catalog, public;