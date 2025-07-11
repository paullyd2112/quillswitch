-- ######################################################################
-- #
-- # DATABASE SECURITY SCRIPT FOR WEB APPLICATIONS
-- #
-- # This script establishes robust audit logging, row-level security,
-- # and proactive threat detection for your PostgreSQL database.
-- #
-- # IMPORTANT: Review comments marked 'NOTE' for application-specific
-- #            integration points and security considerations.
-- #
-- ######################################################################


-- SECTION 1: Comprehensive Audit Logging Table
-- ----------------------------------------------------------------------
-- Creates the main audit log table with enhanced columns for better
-- universality and contextual logging.

CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),  -- User who performed the action (from auth.uid())
  action TEXT NOT NULL,                   -- Type of operation (INSERT, UPDATE, DELETE, etc.)
  table_name TEXT NOT NULL,               -- Table on which the action occurred
  record_id TEXT,                         -- Primary key of the affected record (now TEXT for universality)
  old_values JSONB,                       -- JSON representation of the record BEFORE the action
  new_values JSONB,                       -- JSON representation of the record AFTER the action
  ip_address INET,                        -- IP address from which the action originated
  user_agent TEXT,                        -- User agent string of the client
  context_json JSONB DEFAULT NULL,        -- Additional application-specific context (e.g., API endpoint, session info)
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.audit_log IS 'Comprehensive audit log for all critical database operations.';
COMMENT ON COLUMN public.audit_log.record_id IS 'Primary key of the affected record, stored as TEXT for universality across different table types.';
COMMENT ON COLUMN public.audit_log.old_values IS 'Full row state before the operation (for UPDATE/DELETE).';
COMMENT ON COLUMN public.audit_log.new_values IS 'Full row state after the operation (for INSERT/UPDATE).';
COMMENT ON COLUMN public.audit_log.ip_address IS 'IP address of the user performing the action. Requires application to set session variable.';
COMMENT ON COLUMN public.audit_log.user_agent IS 'User agent string of the client. Requires application to set session variable.';
COMMENT ON COLUMN public.audit_log.context_json IS 'Application-specific context (e.g., API endpoint, request parameters, session ID).';


-- SECTION 2: Row Level Security (RLS) on Audit Log
-- ----------------------------------------------------------------------
-- Enables RLS on the audit_log table to ensure users can only view
-- their own audit entries, enhancing data privacy and isolation.

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own audit logs"
ON public.audit_log
FOR SELECT
USING (auth.uid() = user_id);

COMMENT ON POLICY "Users can view their own audit logs" ON public.audit_log IS 'Restricts users to viewing only their own audit log entries.';


-- SECTION 3: Automated Audit Trigger Function
-- ----------------------------------------------------------------------
-- This function is executed by triggers to automatically log all DML
-- operations (INSERT, UPDATE, DELETE) on audited tables.
-- It captures both old and new values for complete change tracking.

CREATE OR REPLACE FUNCTION public.create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_log (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values,
    ip_address,
    user_agent,
    context_json
  ) VALUES (
    auth.uid(),                            -- Get the current authenticated user's ID
    TG_OP,                                 -- The operation type (INSERT, UPDATE, DELETE)
    TG_TABLE_NAME,                         -- The name of the table affected
    COALESCE(NEW.id::TEXT, OLD.id::TEXT),  -- Primary key of the affected record, cast to TEXT
    CASE                                   -- Capture OLD values for UPDATE and DELETE operations
      WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD)
      WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
      ELSE NULL
    END,
    CASE                                   -- Capture NEW values for INSERT and UPDATE operations
      WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW)
      ELSE NULL
    END,
    -- NOTE: Your application or API gateway must set these PostgreSQL
    -- session variables for them to be captured by the trigger function.
    -- Example: SELECT set_config('app.user_ip_address', '192.0.2.1', FALSE);
    -- The 'FALSE' makes it local to the transaction.
    current_setting('app.user_ip_address', TRUE)::INET,
    current_setting('app.user_agent_string', TRUE),
    -- NOTE: Similarly, you can set an 'app.context_json_string' session variable
    -- and parse it here, or build the JSONB object directly from other variables.
    -- Example: current_setting('app.request_context', TRUE)::JSONB
    NULL -- Placeholder, populate from application context if available
  );

  RETURN COALESCE(NEW, OLD); -- Return the appropriate record based on operation type
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public;

COMMENT ON FUNCTION public.create_audit_log() IS 'Trigger function to log DML operations (INSERT, UPDATE, DELETE) to the public.audit_log table.';


-- SECTION 4: Add Audit Triggers to Critical Tables
-- ----------------------------------------------------------------------
-- Apply these triggers to all tables you want to audit.
-- Ensure these are critical application tables containing sensitive data
-- or representing core application state.

CREATE TRIGGER audit_service_credentials
  AFTER INSERT OR UPDATE OR DELETE ON public.service_credentials
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

CREATE TRIGGER audit_migration_projects
  AFTER INSERT OR UPDATE OR DELETE ON public.migration_projects
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

-- NOTE: Add similar TRIGGER statements for all other tables in your schema
-- that require comprehensive audit logging.
-- Example:
-- CREATE TRIGGER audit_users
--   AFTER INSERT OR UPDATE OR DELETE ON public.users
--   FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();
-- CREATE TRIGGER audit_organizations
--   AFTER INSERT OR UPDATE OR DELETE ON public.organizations
--   FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();


-- SECTION 5: Enhance Credential Access Log
-- ----------------------------------------------------------------------
-- Adds critical columns to the credential_access_log table for richer
-- monitoring and forensic analysis of credential usage.

ALTER TABLE public.credential_access_log
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT NULL, -- Additional structured details about the access event
ADD COLUMN IF NOT EXISTS ip_address INET,            -- IP address of the accessing client
ADD COLUMN IF NOT EXISTS user_agent TEXT;            -- User agent string of the accessing client

COMMENT ON COLUMN public.credential_access_log.metadata IS 'Application-specific metadata related to the credential access event.';
COMMENT ON COLUMN public.credential_access_log.ip_address IS 'IP address from which the credential access occurred.';
COMMENT ON COLUMN public.credential_access_log.user_agent IS 'User agent string of the client accessing the credential.';


-- SECTION 6: Advanced Suspicious Credential Access Detection Function
-- ----------------------------------------------------------------------
-- This function identifies potentially suspicious credential access patterns
-- (e.g., high volume access within a short period).
-- It is designed for *administrative monitoring* across *all users*.

CREATE OR REPLACE FUNCTION public.get_suspicious_credential_access(
    p_time_window_hours INT DEFAULT 24,     -- Time window to check (e.g., last 24 hours)
    p_high_threshold INT DEFAULT 50,        -- Access count threshold for 'HIGH' risk
    p_medium_threshold INT DEFAULT 20,      -- Access count threshold for 'MEDIUM' risk
    p_min_count_to_report INT DEFAULT 10    -- Minimum access count to be included in the results
)
RETURNS TABLE(
  user_id UUID,
  credential_id UUID,
  access_count BIGINT,
  last_access TIMESTAMP WITH TIME ZONE,
  risk_level TEXT
) LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    cal.user_id,
    cal.credential_id,
    COUNT(*) as access_count,
    MAX(cal.accessed_at) as last_access,
    CASE
      WHEN COUNT(*) > p_high_threshold THEN 'HIGH'
      WHEN COUNT(*) > p_medium_threshold THEN 'MEDIUM'
      ELSE 'LOW'
    END as risk_level
  FROM public.credential_access_log cal
  WHERE cal.accessed_at >= now() - (p_time_window_hours || ' hours')::interval
  -- NOTE: The 'AND cal.user_id = auth.uid()' filter has been REMOVED here.
  -- This function is intended for administrative monitoring across ALL users.
  -- DO NOT grant EXECUTE privileges on this function to regular application users.
  GROUP BY cal.user_id, cal.credential_id
  HAVING COUNT(*) > p_min_count_to_report
  ORDER BY access_count DESC;
END;
$$;

COMMENT ON FUNCTION public.get_suspicious_credential_access(INT, INT, INT, INT) IS 'Identifies suspicious credential access patterns (e.g., high frequency) for administrative monitoring across all users.';


-- ######################################################################
-- #
-- # CRITICAL POST-DEPLOYMENT SECURITY CONSIDERATIONS
-- #
-- ######################################################################

-- 1. INDEXING FOR PERFORMANCE:
--    As your audit and access logs grow, efficient querying is paramount.
--    Consider adding these indexes:
--    CREATE INDEX idx_audit_log_created_at ON public.audit_log (created_at DESC);
--    CREATE INDEX idx_audit_log_user_action ON public.audit_log (user_id, action, created_at DESC);
--    CREATE INDEX idx_audit_log_table_record ON public.audit_log (table_name, record_id);
--    CREATE INDEX idx_cred_access_user_time ON public.credential_access_log (user_id, accessed_at DESC, credential_id);

-- 2. LEAST PRIVILEGE PRINCIPLE:
--    * Your web application's database user should have only DML (SELECT, INSERT, UPDATE, DELETE)
--      privileges on tables it needs to interact with, and EXECUTE privileges only on
--      necessary functions. NO superuser or schema-modifying (CREATE, ALTER, DROP) permissions.
--    * Create a dedicated, low-privileged role (e.g., 'audit_owner') to OWN the
--      'create_audit_log' and 'get_suspicious_credential_access' functions. This role
--      should only have 'INSERT' on 'audit_log' and 'SELECT' on 'credential_access_log'
--      tables, respectively. This minimizes potential attack surface.

-- 3. SECURE SESSION VARIABLE SETTING:
--    Ensure your application securely sets 'app.user_ip_address' and 'app.user_agent_string'
--    (and any other 'app.context_json' components) via `SET LOCAL` commands within each
--    database transaction or connection, before any DML operations that trigger auditing.
--    This context is crucial for forensic analysis.

-- 4. SSL/TLS FOR CONNECTIONS:
--    Always enforce SSL/TLS encryption for all connections between your web application
--    and the PostgreSQL database to prevent eavesdropping.

-- 5. NO PLAINTEXT SENSITIVE DATA IN LOGS:
--    Be extremely vigilant about ensuring no plaintext sensitive data (e.g., passwords, API keys)
--    ends up in the JSONB 'old_values', 'new_values', 'metadata', or 'context_json' columns.
--    Implement application-level redaction or ensure such data is never passed to the database
--    in a form that would be logged if modified.

-- 6. REGULAR SECURITY AUDITS:
--    Database security is an ongoing process. Periodically review your roles, permissions,
--    policies, and examine your audit logs for any suspicious activity or deviations from
--    expected behavior.

-- ######################################################################