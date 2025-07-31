/**
 * Centralized API endpoint constants for QuillSwitch
 * Eliminates hardcoded URLs throughout the codebase
 */

// Supabase configuration
export const SUPABASE_CONFIG = {
  url: 'https://kxjidapjtcxwzpwdomnm.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4amlkYXBqdGN4d3pwd2RvbW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NjUzNzUsImV4cCI6MjA1ODU0MTM3NX0.U1kLjAztYB-Jfye3dIkJ7gx9U7aNDYHrorkI1Bax_g8',
} as const;

// Edge Functions endpoints
export const EDGE_FUNCTIONS = {
  nangoCreateSession: `${SUPABASE_CONFIG.url}/functions/v1/nango-create-session`,
  nangoProxy: `${SUPABASE_CONFIG.url}/functions/v1/nango-proxy`,
  monitoring: `${SUPABASE_CONFIG.url}/functions/v1/monitoring/log`,
} as const;

// Nango configuration
export const NANGO_CONFIG = {
  host: 'https://api.nango.dev',
} as const;

// Standard headers factory
export const createAuthHeaders = (accessToken: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${accessToken}`,
  'apikey': SUPABASE_CONFIG.anonKey,
});

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface EdgeFunctionResponse<T = any> extends ApiResponse<T> {
  statusCode?: number;
}