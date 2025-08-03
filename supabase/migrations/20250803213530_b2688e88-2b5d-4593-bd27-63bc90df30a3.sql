-- Phase 1: Database Foundation for QuillSync Pro Bidirectional Sync

-- Create sync_projects table for overall sync configurations
CREATE TABLE public.sync_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  project_name TEXT NOT NULL,
  source_crm_id UUID NOT NULL,
  destination_crm_id UUID NOT NULL,
  sync_status TEXT NOT NULL DEFAULT 'paused',
  last_sync_run TIMESTAMP WITH TIME ZONE,
  sync_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Add foreign key constraints
  CONSTRAINT fk_sync_projects_source_crm 
    FOREIGN KEY (source_crm_id) REFERENCES public.service_credentials(id) ON DELETE CASCADE,
  CONSTRAINT fk_sync_projects_destination_crm 
    FOREIGN KEY (destination_crm_id) REFERENCES public.service_credentials(id) ON DELETE CASCADE,
    
  -- Add check constraints
  CONSTRAINT chk_sync_status 
    CHECK (sync_status IN ('active', 'paused', 'error', 'initializing')),
  CONSTRAINT chk_different_crms 
    CHECK (source_crm_id != destination_crm_id)
);

-- Create sync_maps table for object and field mappings
CREATE TABLE public.sync_maps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sync_project_id UUID NOT NULL,
  source_object TEXT NOT NULL,
  destination_object TEXT NOT NULL,
  field_map JSONB NOT NULL DEFAULT '{}',
  sync_direction TEXT NOT NULL DEFAULT 'bidirectional',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Add foreign key constraint
  CONSTRAINT fk_sync_maps_project 
    FOREIGN KEY (sync_project_id) REFERENCES public.sync_projects(id) ON DELETE CASCADE,
    
  -- Add check constraint
  CONSTRAINT chk_sync_direction 
    CHECK (sync_direction IN ('source_to_destination', 'destination_to_source', 'bidirectional')),
    
  -- Ensure unique mapping per project
  UNIQUE (sync_project_id, source_object, destination_object)
);

-- Create sync_conflicts table for conflict resolution logs
CREATE TABLE public.sync_conflicts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sync_project_id UUID NOT NULL,
  record_id TEXT NOT NULL,
  conflict_details JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending_review',
  resolution_rule TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID,
  
  -- Add foreign key constraint
  CONSTRAINT fk_sync_conflicts_project 
    FOREIGN KEY (sync_project_id) REFERENCES public.sync_projects(id) ON DELETE CASCADE,
    
  -- Add check constraint
  CONSTRAINT chk_conflict_status 
    CHECK (status IN ('pending_review', 'auto_resolved', 'manual_resolved', 'ignored'))
);

-- Enable Row Level Security
ALTER TABLE public.sync_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_conflicts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sync_projects
CREATE POLICY "Users can manage their own sync projects" 
ON public.sync_projects 
FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for sync_maps
CREATE POLICY "Users can manage sync maps for their projects" 
ON public.sync_maps 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.sync_projects sp 
    WHERE sp.id = sync_maps.sync_project_id 
    AND sp.user_id = auth.uid()
  )
);

-- RLS Policies for sync_conflicts
CREATE POLICY "Users can view conflicts for their projects" 
ON public.sync_conflicts 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.sync_projects sp 
    WHERE sp.id = sync_conflicts.sync_project_id 
    AND sp.user_id = auth.uid()
  )
);

-- Create indexes for better performance
CREATE INDEX idx_sync_projects_user_id ON public.sync_projects(user_id);
CREATE INDEX idx_sync_projects_status ON public.sync_projects(sync_status);
CREATE INDEX idx_sync_projects_last_sync ON public.sync_projects(last_sync_run);

CREATE INDEX idx_sync_maps_project_id ON public.sync_maps(sync_project_id);
CREATE INDEX idx_sync_maps_objects ON public.sync_maps(source_object, destination_object);

CREATE INDEX idx_sync_conflicts_project_id ON public.sync_conflicts(sync_project_id);
CREATE INDEX idx_sync_conflicts_status ON public.sync_conflicts(status);
CREATE INDEX idx_sync_conflicts_created_at ON public.sync_conflicts(created_at);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_sync_projects_updated_at
  BEFORE UPDATE ON public.sync_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sync_maps_updated_at
  BEFORE UPDATE ON public.sync_maps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();