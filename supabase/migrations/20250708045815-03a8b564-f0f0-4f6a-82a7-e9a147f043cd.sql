-- Create multi-tenant workspace architecture
CREATE TABLE public.workspaces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  owner_id UUID NOT NULL,
  settings JSONB DEFAULT '{}',
  subscription_tier TEXT DEFAULT 'free',
  max_users INTEGER DEFAULT 5,
  max_projects INTEGER DEFAULT 10
);

-- Enable RLS for workspaces
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- Create workspace memberships table
CREATE TABLE public.workspace_memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  invited_by UUID,
  UNIQUE(workspace_id, user_id)
);

-- Enable RLS for workspace memberships
ALTER TABLE public.workspace_memberships ENABLE ROW LEVEL SECURITY;

-- Create migration schedules table
CREATE TABLE public.migration_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  description TEXT,
  cron_expression TEXT NOT NULL,
  next_run_at TIMESTAMP WITH TIME ZONE,
  last_run_at TIMESTAMP WITH TIME ZONE,
  migration_config JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3
);

-- Enable RLS for migration schedules
ALTER TABLE public.migration_schedules ENABLE ROW LEVEL SECURITY;

-- Create custom validation rules table
CREATE TABLE public.custom_validation_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  description TEXT,
  field_type TEXT NOT NULL,
  validation_type TEXT NOT NULL,
  rule_config JSONB NOT NULL,
  error_message TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS for custom validation rules
ALTER TABLE public.custom_validation_rules ENABLE ROW LEVEL SECURITY;

-- Create offline sync queue table
CREATE TABLE public.offline_sync_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  workspace_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  operation_type TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  data JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  retry_count INTEGER DEFAULT 0,
  last_error TEXT,
  synced_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS for offline sync queue
ALTER TABLE public.offline_sync_queue ENABLE ROW LEVEL SECURITY;

-- Add workspace_id to existing tables
ALTER TABLE public.migration_projects ADD COLUMN workspace_id UUID REFERENCES public.workspaces(id);
ALTER TABLE public.service_credentials ADD COLUMN workspace_id UUID REFERENCES public.workspaces(id);

-- Create workspace RLS policies
CREATE POLICY "Users can view workspaces they belong to"
ON public.workspaces FOR SELECT
USING (
  id IN (
    SELECT workspace_id FROM public.workspace_memberships 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Workspace owners can update their workspaces"
ON public.workspaces FOR UPDATE
USING (owner_id = auth.uid());

CREATE POLICY "Users can create workspaces"
ON public.workspaces FOR INSERT
WITH CHECK (owner_id = auth.uid());

-- Create workspace membership policies
CREATE POLICY "Users can view their workspace memberships"
ON public.workspace_memberships FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Workspace owners can manage memberships"
ON public.workspace_memberships FOR ALL
USING (
  workspace_id IN (
    SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
  )
);

-- Create migration schedules policies
CREATE POLICY "Users can manage schedules in their workspaces"
ON public.migration_schedules FOR ALL
USING (
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_memberships 
    WHERE user_id = auth.uid()
  )
);

-- Create custom validation rules policies
CREATE POLICY "Users can manage validation rules in their workspaces"
ON public.custom_validation_rules FOR ALL
USING (
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_memberships 
    WHERE user_id = auth.uid()
  )
);

-- Create offline sync queue policies
CREATE POLICY "Users can manage their own sync queue"
ON public.offline_sync_queue FOR ALL
USING (user_id = auth.uid());

-- Create functions for workspace management
CREATE OR REPLACE FUNCTION public.create_default_workspace_for_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  workspace_id UUID;
BEGIN
  -- Create default workspace
  INSERT INTO public.workspaces (name, slug, owner_id)
  VALUES (
    'Personal Workspace',
    'personal-' || NEW.id::text,
    NEW.id
  )
  RETURNING id INTO workspace_id;
  
  -- Add user as owner in memberships
  INSERT INTO public.workspace_memberships (workspace_id, user_id, role)
  VALUES (workspace_id, NEW.id, 'owner');
  
  RETURN NEW;
END;
$$;

-- Create trigger for auto workspace creation
CREATE TRIGGER create_default_workspace_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_workspace_for_user();

-- Create function to get user's workspaces
CREATE OR REPLACE FUNCTION public.get_user_workspaces(user_uuid UUID DEFAULT auth.uid())
RETURNS TABLE(
  workspace_id UUID,
  workspace_name TEXT,
  workspace_slug TEXT,
  user_role TEXT,
  member_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    w.id,
    w.name,
    w.slug,
    wm.role,
    COUNT(wm2.user_id) as member_count
  FROM public.workspaces w
  JOIN public.workspace_memberships wm ON w.id = wm.workspace_id
  LEFT JOIN public.workspace_memberships wm2 ON w.id = wm2.workspace_id
  WHERE wm.user_id = user_uuid
  GROUP BY w.id, w.name, w.slug, wm.role
  ORDER BY w.created_at;
END;
$$;

-- Add timestamp triggers
CREATE TRIGGER update_workspaces_updated_at
  BEFORE UPDATE ON public.workspaces
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_migration_schedules_updated_at
  BEFORE UPDATE ON public.migration_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_custom_validation_rules_updated_at
  BEFORE UPDATE ON public.custom_validation_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();