
-- Database functions for optimization services

-- Function to get migration records (used by bloom filter initialization)
CREATE OR REPLACE FUNCTION public.get_migration_records(
  p_project_id UUID,
  p_object_type TEXT
)
RETURNS TABLE (
  id UUID,
  external_id TEXT,
  last_modified TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  -- Check if user has access to this project (basic auth check)
  IF NOT EXISTS (
    SELECT 1 FROM public.migration_projects mp
    WHERE mp.id = p_project_id AND mp.user_id = auth.uid()
  ) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT mr.id, mr.external_id, mr.last_modified
  FROM public.migration_records mr
  WHERE mr.project_id = p_project_id 
    AND mr.object_type = p_object_type
    AND mr.user_id = auth.uid();
END;
$$;

-- Function to get a specific migration record by external ID
CREATE OR REPLACE FUNCTION public.get_migration_record_by_external_id(
  p_project_id UUID,
  p_object_type TEXT,
  p_external_id TEXT
)
RETURNS TABLE (
  id UUID,
  external_id TEXT,
  last_modified TIMESTAMP WITH TIME ZONE,
  data JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  -- Check if user has access to this project
  IF NOT EXISTS (
    SELECT 1 FROM public.migration_projects mp
    WHERE mp.id = p_project_id AND mp.user_id = auth.uid()
  ) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT mr.id, mr.external_id, mr.last_modified, mr.data
  FROM public.migration_records mr
  WHERE mr.project_id = p_project_id 
    AND mr.object_type = p_object_type
    AND mr.external_id = p_external_id
    AND mr.user_id = auth.uid()
  LIMIT 1;
END;
$$;

-- Function to upsert optimization cache
CREATE OR REPLACE FUNCTION public.upsert_optimization_cache(
  p_cache_key TEXT,
  p_project_id UUID DEFAULT NULL,
  p_object_type TEXT DEFAULT NULL,
  p_cache_type TEXT,
  p_cache_data JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_cache_id UUID;
BEGIN
  -- Upsert the cache entry
  INSERT INTO public.optimization_cache (
    cache_key,
    project_id,
    object_type,
    cache_type,
    cache_data,
    user_id
  )
  VALUES (
    p_cache_key,
    p_project_id,
    p_object_type,
    p_cache_type,
    p_cache_data,
    auth.uid()
  )
  ON CONFLICT (cache_key)
  DO UPDATE SET
    cache_data = EXCLUDED.cache_data,
    updated_at = now()
  RETURNING id INTO v_cache_id;

  RETURN v_cache_id;
END;
$$;

-- Function to get optimization cache
CREATE OR REPLACE FUNCTION public.get_optimization_cache(
  p_cache_key TEXT,
  p_cache_type TEXT
)
RETURNS TABLE (
  id UUID,
  cache_data JSONB,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  RETURN QUERY
  SELECT oc.id, oc.cache_data, oc.updated_at
  FROM public.optimization_cache oc
  WHERE oc.cache_key = p_cache_key 
    AND oc.cache_type = p_cache_type
    AND oc.user_id = auth.uid();
END;
$$;

-- Add unique constraint on cache_key to prevent duplicates
ALTER TABLE public.optimization_cache 
ADD CONSTRAINT optimization_cache_cache_key_key UNIQUE (cache_key);
