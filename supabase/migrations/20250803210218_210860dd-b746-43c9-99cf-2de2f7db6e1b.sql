-- Create preview jobs table
CREATE TABLE public.preview_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  migration_project_id UUID REFERENCES public.migration_projects(id),
  source_system TEXT NOT NULL,
  target_system TEXT NOT NULL,
  source_data JSONB NOT NULL,
  transformation_rules JSONB,
  preview_results JSONB,
  health_report JSONB,
  potential_issues JSONB,
  estimated_success_rate DECIMAL(3,2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create transformation previews table
CREATE TABLE public.transformation_previews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  preview_job_id UUID NOT NULL REFERENCES public.preview_jobs(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  original_value TEXT,
  transformed_value TEXT,
  transformation_type TEXT NOT NULL,
  data_loss_risk TEXT CHECK (data_loss_risk IN ('none', 'low', 'medium', 'high')),
  warning_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create preview warnings table
CREATE TABLE public.preview_warnings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  preview_job_id UUID NOT NULL REFERENCES public.preview_jobs(id) ON DELETE CASCADE,
  warning_type TEXT NOT NULL CHECK (warning_type IN ('data_truncation', 'type_incompatibility', 'field_mapping', 'data_loss', 'performance')),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  field_name TEXT,
  message TEXT NOT NULL,
  recommendation TEXT,
  affected_records INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.preview_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transformation_previews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preview_warnings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own preview jobs" 
ON public.preview_jobs 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view transformation previews for their jobs" 
ON public.transformation_previews 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.preview_jobs 
  WHERE preview_jobs.id = transformation_previews.preview_job_id 
  AND preview_jobs.user_id = auth.uid()
));

CREATE POLICY "Users can view preview warnings for their jobs" 
ON public.preview_warnings 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.preview_jobs 
  WHERE preview_jobs.id = preview_warnings.preview_job_id 
  AND preview_jobs.user_id = auth.uid()
));

-- Create indexes
CREATE INDEX idx_preview_jobs_user_id ON public.preview_jobs(user_id);
CREATE INDEX idx_preview_jobs_status ON public.preview_jobs(status);
CREATE INDEX idx_transformation_previews_job_id ON public.transformation_previews(preview_job_id);
CREATE INDEX idx_preview_warnings_job_id ON public.preview_warnings(preview_job_id);

-- Create trigger for timestamp updates
CREATE TRIGGER update_preview_jobs_updated_at
  BEFORE UPDATE ON public.preview_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_cleansing_updated_at();