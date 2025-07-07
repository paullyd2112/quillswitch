-- Create migration_roi_reports table for storing ROI analysis data
CREATE TABLE public.migration_roi_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  report_data JSONB NOT NULL,
  metrics JSONB NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.migration_roi_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view ROI reports for their own projects" 
ON public.migration_roi_reports 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.migration_projects mp 
  WHERE mp.id = migration_roi_reports.project_id 
  AND mp.user_id = auth.uid()
));

CREATE POLICY "Users can create ROI reports for their own projects" 
ON public.migration_roi_reports 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.migration_projects mp 
  WHERE mp.id = migration_roi_reports.project_id 
  AND mp.user_id = auth.uid()
));

CREATE POLICY "Users can update ROI reports for their own projects" 
ON public.migration_roi_reports 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.migration_projects mp 
  WHERE mp.id = migration_roi_reports.project_id 
  AND mp.user_id = auth.uid()
));

-- Add foreign key constraint
ALTER TABLE public.migration_roi_reports 
ADD CONSTRAINT migration_roi_reports_project_id_fkey 
FOREIGN KEY (project_id) REFERENCES public.migration_projects(id) ON DELETE CASCADE;

-- Add trigger for updated_at
CREATE TRIGGER update_migration_roi_reports_updated_at
BEFORE UPDATE ON public.migration_roi_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();