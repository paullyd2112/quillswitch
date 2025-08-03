-- Create PII scan jobs table
CREATE TABLE public.pii_scan_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  migration_project_id UUID REFERENCES public.migration_projects(id),
  source_data JSONB NOT NULL,
  scan_results JSONB,
  compliance_report JSONB,
  total_records INTEGER NOT NULL DEFAULT 0,
  processed_records INTEGER NOT NULL DEFAULT 0,
  pii_findings_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create PII findings table
CREATE TABLE public.pii_findings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scan_job_id UUID NOT NULL REFERENCES public.pii_scan_jobs(id) ON DELETE CASCADE,
  record_id TEXT NOT NULL,
  field_name TEXT NOT NULL,
  pii_type TEXT NOT NULL CHECK (pii_type IN ('name', 'email', 'phone', 'ssn', 'credit_card', 'address', 'national_id', 'custom')),
  original_value TEXT NOT NULL,
  confidence_score DECIMAL(3,2) NOT NULL,
  masking_applied BOOLEAN DEFAULT false,
  masked_value TEXT,
  masking_method TEXT CHECK (masking_method IN ('redaction', 'tokenization', 'encryption', 'anonymization')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create PII masking policies table
CREATE TABLE public.pii_masking_policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  policy_name TEXT NOT NULL,
  pii_type TEXT NOT NULL,
  masking_method TEXT NOT NULL CHECK (masking_method IN ('redaction', 'tokenization', 'encryption', 'anonymization')),
  is_default BOOLEAN DEFAULT false,
  retention_days INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pii_scan_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pii_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pii_masking_policies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own PII scan jobs" 
ON public.pii_scan_jobs 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view PII findings for their scans" 
ON public.pii_findings 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.pii_scan_jobs 
  WHERE pii_scan_jobs.id = pii_findings.scan_job_id 
  AND pii_scan_jobs.user_id = auth.uid()
));

CREATE POLICY "Users can manage their own masking policies" 
ON public.pii_masking_policies 
FOR ALL 
USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_pii_scan_jobs_user_id ON public.pii_scan_jobs(user_id);
CREATE INDEX idx_pii_findings_scan_job_id ON public.pii_findings(scan_job_id);
CREATE INDEX idx_pii_findings_pii_type ON public.pii_findings(pii_type);
CREATE INDEX idx_pii_masking_policies_user_id ON public.pii_masking_policies(user_id);