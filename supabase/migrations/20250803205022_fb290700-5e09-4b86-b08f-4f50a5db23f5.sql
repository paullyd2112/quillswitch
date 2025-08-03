-- Create cleansing jobs table
CREATE TABLE public.cleansing_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  migration_project_id UUID REFERENCES public.migration_projects(id),
  source_data JSONB NOT NULL,
  target_data JSONB,
  total_records INTEGER NOT NULL DEFAULT 0,
  processed_records INTEGER NOT NULL DEFAULT 0,
  duplicates_found INTEGER NOT NULL DEFAULT 0,
  confidence_threshold DECIMAL(3,2) NOT NULL DEFAULT 0.75,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create duplicate matches table
CREATE TABLE public.duplicate_matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cleansing_job_id UUID NOT NULL REFERENCES public.cleansing_jobs(id) ON DELETE CASCADE,
  source_record_id TEXT NOT NULL,
  target_record_id TEXT,
  source_record_data JSONB NOT NULL,
  target_record_data JSONB,
  confidence_score DECIMAL(3,2) NOT NULL,
  match_type TEXT NOT NULL CHECK (match_type IN ('exact', 'fuzzy', 'phonetic', 'semantic')),
  conflict_fields JSONB,
  suggested_action TEXT NOT NULL CHECK (suggested_action IN ('merge', 'overwrite', 'keep_both', 'skip')),
  user_action TEXT CHECK (user_action IN ('approved', 'rejected', 'modified')),
  reconciliation_strategy JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user cleansing rules table
CREATE TABLE public.cleansing_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('matching_threshold', 'field_priority', 'auto_action', 'custom_logic')),
  conditions JSONB NOT NULL,
  actions JSONB NOT NULL,
  priority INTEGER NOT NULL DEFAULT 100,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cleansing reports table
CREATE TABLE public.cleansing_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cleansing_job_id UUID NOT NULL REFERENCES public.cleansing_jobs(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('summary', 'detailed', 'conflicts')),
  report_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.cleansing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duplicate_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleansing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleansing_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for cleansing_jobs
CREATE POLICY "Users can manage their own cleansing jobs" 
ON public.cleansing_jobs 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for duplicate_matches
CREATE POLICY "Users can manage duplicate matches for their cleansing jobs" 
ON public.duplicate_matches 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.cleansing_jobs 
  WHERE cleansing_jobs.id = duplicate_matches.cleansing_job_id 
  AND cleansing_jobs.user_id = auth.uid()
));

-- Create RLS policies for cleansing_rules
CREATE POLICY "Users can manage their own cleansing rules" 
ON public.cleansing_rules 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for cleansing_reports
CREATE POLICY "Users can view reports for their cleansing jobs" 
ON public.cleansing_reports 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.cleansing_jobs 
  WHERE cleansing_jobs.id = cleansing_reports.cleansing_job_id 
  AND cleansing_jobs.user_id = auth.uid()
));

-- Create indexes for performance
CREATE INDEX idx_cleansing_jobs_user_id ON public.cleansing_jobs(user_id);
CREATE INDEX idx_cleansing_jobs_status ON public.cleansing_jobs(status);
CREATE INDEX idx_duplicate_matches_job_id ON public.duplicate_matches(cleansing_job_id);
CREATE INDEX idx_duplicate_matches_confidence ON public.duplicate_matches(confidence_score);
CREATE INDEX idx_cleansing_rules_user_id ON public.cleansing_rules(user_id);
CREATE INDEX idx_cleansing_rules_active ON public.cleansing_rules(is_active);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_cleansing_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_cleansing_jobs_updated_at
  BEFORE UPDATE ON public.cleansing_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_cleansing_updated_at();

CREATE TRIGGER update_duplicate_matches_updated_at
  BEFORE UPDATE ON public.duplicate_matches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_cleansing_updated_at();

CREATE TRIGGER update_cleansing_rules_updated_at
  BEFORE UPDATE ON public.cleansing_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_cleansing_updated_at();