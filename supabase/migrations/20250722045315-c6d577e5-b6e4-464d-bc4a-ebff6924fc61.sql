
-- Remove Unified API key from secrets
DELETE FROM vault.secrets WHERE name = 'UNIFIED_API_KEY';

-- Add native CRM engine configuration secrets
INSERT INTO vault.secrets (name, secret, description) 
VALUES 
  ('NATIVE_CRM_ENGINE_URL', 'https://api.quillswitch.com/v1', 'Native CRM Engine Base URL'),
  ('NATIVE_CRM_ENGINE_KEY', 'your-native-api-key-here', 'Native CRM Engine API Key')
ON CONFLICT (name) DO UPDATE SET 
  secret = EXCLUDED.secret,
  description = EXCLUDED.description;
