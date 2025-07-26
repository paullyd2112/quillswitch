
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

interface SalesforceOAuthRequest {
  action: 'authorize' | 'callback' | 'refresh' | 'revoke';
  code?: string;
  refreshToken?: string;
  state?: string;
  redirectUri: string;
  sandbox?: boolean;
}

interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2
};

// Enhanced fetch with SSL/TLS configuration and retry logic
async function enhancedFetch(
  url: string, 
  options: RequestInit = {}, 
  retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<Response> {
  const enhancedOptions: RequestInit = {
    ...options,
    // Enhanced headers for better SSL/TLS compatibility
    headers: {
      'User-Agent': 'QuillSwitch-OAuth/1.0',
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      ...options.headers
    }
  };

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retryConfig.maxAttempts; attempt++) {
    try {
      console.log(`Fetch attempt ${attempt}/${retryConfig.maxAttempts} to ${url}`);
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
      
      const response = await fetch(url, {
        ...enhancedOptions,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log(`Fetch successful on attempt ${attempt}, status: ${response.status}`);
      return response;
      
    } catch (error) {
      lastError = error as Error;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      console.error(`Fetch attempt ${attempt} failed:`, {
        error: errorMessage,
        url: url,
        attempt: attempt
      });
      
      // Check if this is an SSL/TLS related error
      const isSSLError = errorMessage.toLowerCase().includes('ssl') ||
                        errorMessage.toLowerCase().includes('tls') ||
                        errorMessage.toLowerCase().includes('handshake') ||
                        errorMessage.toLowerCase().includes('certificate') ||
                        errorMessage.toLowerCase().includes('connection reset') ||
                        errorMessage.toLowerCase().includes('network error');
      
      // Check if this is a timeout error
      const isTimeoutError = errorMessage.toLowerCase().includes('timeout') ||
                            errorMessage.toLowerCase().includes('aborted');
      
      // Don't retry on the last attempt
      if (attempt === retryConfig.maxAttempts) {
        console.error(`All ${retryConfig.maxAttempts} attempts failed. Last error:`, errorMessage);
        break;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        retryConfig.baseDelay * Math.pow(retryConfig.backoffFactor, attempt - 1),
        retryConfig.maxDelay
      );
      
      console.log(`Retrying in ${delay}ms due to ${isSSLError ? 'SSL/TLS' : isTimeoutError ? 'timeout' : 'network'} error`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError || new Error('All retry attempts failed');
}

serve(async (req) => {
  console.log(`=== Salesforce OAuth Function Start ===`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`Headers:`, Object.fromEntries(req.headers.entries()));
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== Starting auth check ===');
    
    // Check if we have authorization header
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header exists:', !!authHeader);
    console.log('Auth header value preview:', authHeader ? authHeader.substring(0, 20) + '...' : 'null');
    
    if (!authHeader) {
      console.log('No auth header - returning 401');
      return new Response(
        JSON.stringify({ success: false, error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Simple auth check - create client and try to get user
    console.log('Creating Supabase client...');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );
    
    console.log('Getting user...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    console.log('Auth result:', {
      hasUser: !!user,
      userId: user?.id,
      error: userError?.message,
      errorCode: userError?.code
    });
    
    if (!user || userError) {
      console.log('Auth failed - returning 401');
      return new Response(
        JSON.stringify({ success: false, error: userError?.message || 'Authentication failed' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Auth successful for user:', user.id);

    const body: SalesforceOAuthRequest = await req.json()
    console.log('Request body:', { action: body.action, sandbox: body.sandbox });
    
    // Get Salesforce OAuth credentials from Supabase secrets
    const clientId = Deno.env.get('SALESFORCE_CLIENT_ID')
    const clientSecret = Deno.env.get('SALESFORCE_CLIENT_SECRET')
    
    console.log('OAuth credentials:', { clientIdPresent: !!clientId, clientSecretPresent: !!clientSecret });
    
    if (!clientId || !clientSecret) {
      console.error('Missing Salesforce OAuth credentials');
      throw new Error('Salesforce OAuth credentials not configured')
    }

    const baseUrl = body.sandbox ? 'https://test.salesforce.com' : 'https://login.salesforce.com'
    console.log('Using Salesforce base URL:', baseUrl);

    switch (body.action) {
      case 'authorize': {
        // Generate PKCE code verifier and challenge
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = await generateCodeChallenge(codeVerifier);
        
        // Store code verifier temporarily (in a real app, you'd want to use a more secure storage)
        const state = `sf_${user.id}_${Date.now()}`;
        
        // Generate authorization URL with PKCE
        const scopes = ['id', 'api', 'refresh_token', 'offline_access']
        const params = new URLSearchParams({
          response_type: 'code',
          client_id: clientId,
          redirect_uri: body.redirectUri,
          scope: scopes.join(' '),
          code_challenge: codeChallenge,
          code_challenge_method: 'S256',
          state: state
        })

        const authUrl = `${baseUrl}/services/oauth2/authorize?${params.toString()}`
        console.log('Generated auth URL:', authUrl);
        
        // Store the code verifier in the database temporarily
        const { error: storeError } = await supabase
          .from('oauth_state')
          .insert({
            user_id: user.id,
            state_key: state,
            code_verifier: codeVerifier
          });
        
        if (storeError) {
          console.error('Failed to store PKCE data:', storeError);
          throw new Error('Failed to store OAuth state');
        }
        
        console.log('Successfully stored PKCE data for user:', user.id);
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            authUrl,
            state
          }),
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        )
      }

      case 'callback': {
        if (!body.code) {
          throw new Error('Authorization code is required')
        }

        // Get the stored code verifier from the database
        const { data: oauthData, error: fetchError } = await supabase
          .from('oauth_state')
          .select('code_verifier, state_key')
          .eq('user_id', user.id)
          .eq('state_key', body.state)
          .gte('expires_at', new Date().toISOString())
          .single();
        
        console.log('Retrieved PKCE data:', { 
          codeVerifierPresent: !!oauthData?.code_verifier,
          stateMatch: oauthData?.state_key === body.state,
          fetchError: fetchError?.message
        });
        
        if (fetchError || !oauthData?.code_verifier) {
          console.error('Code verifier not found or expired:', fetchError);
          throw new Error('Code verifier not found or expired. Please restart the OAuth flow.');
        }

        const codeVerifier = oauthData.code_verifier;

        // Exchange code for tokens with PKCE using enhanced fetch
        const tokenParams = new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: clientId,
          redirect_uri: body.redirectUri,
          code: body.code,
          code_verifier: codeVerifier
        })

        const tokenUrl = `${baseUrl}/services/oauth2/token`;
        console.log('Token exchange request:', {
          url: tokenUrl,
          params: tokenParams.toString()
        });

        const tokenResponse = await enhancedFetch(tokenUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          body: tokenParams.toString()
        });

        console.log('Token response status:', tokenResponse.status);

        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text()
          console.error('Token exchange failed:', {
            status: tokenResponse.status,
            statusText: tokenResponse.statusText,
            error: errorText
          });
          throw new Error(`Token exchange failed: ${tokenResponse.status} - ${errorText}`)
        }

        const tokens = await tokenResponse.json()
        console.log('Token data received:', {
          hasAccessToken: !!tokens.access_token,
          hasRefreshToken: !!tokens.refresh_token,
          instanceUrl: tokens.instance_url
        });
        
        // Store encrypted credentials in Supabase
        const credentialData = {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          instance_url: tokens.instance_url,
          id: tokens.id,
          token_type: tokens.token_type,
          issued_at: tokens.issued_at,
          signature: tokens.signature,
          scope: tokens.scope
        }

        const { data: credentialId, error: storeError } = await supabase
          .rpc('encrypt_and_store_credential', {
            p_service_name: 'salesforce',
            p_credential_name: 'Salesforce OAuth',
            p_credential_type: 'oauth',
            p_credential_value: JSON.stringify(credentialData),
            p_environment: body.sandbox ? 'sandbox' : 'production',
            p_metadata: {
              instance_url: tokens.instance_url,
              organization_id: tokens.id.split('/').pop()
            }
          })

        console.log('Credential storage result:', { 
          credentialId, 
          error: storeError?.message 
        });

        if (storeError) {
          console.error('Error storing credential:', storeError)
          throw new Error('Failed to store Salesforce credentials')
        }

        // Clean up PKCE data from database
        await supabase
          .from('oauth_state')
          .delete()
          .eq('user_id', user.id)
          .eq('state_key', body.state);

        console.log('OAuth callback completed successfully for user:', user.id);

        return new Response(
          JSON.stringify({ 
            success: true, 
            credentialId,
            instanceUrl: tokens.instance_url
          }),
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        )
      }

      case 'refresh': {
        if (!body.refreshToken) {
          throw new Error('Refresh token is required')
        }

        const refreshParams = new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: body.refreshToken
        })

        const refreshUrl = `${baseUrl}/services/oauth2/token`;
        const refreshResponse = await enhancedFetch(refreshUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          body: refreshParams.toString()
        });

        if (!refreshResponse.ok) {
          const errorText = await refreshResponse.text()
          throw new Error(`Token refresh failed: ${refreshResponse.status} - ${errorText}`)
        }

        const newTokens = await refreshResponse.json()
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            tokens: newTokens
          }),
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        )
      }

      case 'revoke': {
        if (!body.refreshToken) {
          throw new Error('Token is required for revocation')
        }

        const revokeParams = new URLSearchParams({
          token: body.refreshToken
        })

        const revokeUrl = `${baseUrl}/services/oauth2/revoke`;
        const revokeResponse = await enhancedFetch(revokeUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: revokeParams.toString()
        });

        return new Response(
          JSON.stringify({ 
            success: revokeResponse.ok,
            message: revokeResponse.ok ? 'Token revoked successfully' : 'Token revocation failed'
          }),
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        )
      }

      default:
        throw new Error('Invalid action specified')
    }

  } catch (error) {
    console.error('Salesforce OAuth error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Enhanced error classification
    let errorType = 'unknown';
    let userMessage = 'An unexpected error occurred';
    
    if (error.message.toLowerCase().includes('ssl') || 
        error.message.toLowerCase().includes('handshake') ||
        error.message.toLowerCase().includes('certificate')) {
      errorType = 'ssl_error';
      userMessage = 'SSL connection failed. Please try again in a moment.';
    } else if (error.message.toLowerCase().includes('timeout')) {
      errorType = 'timeout_error';
      userMessage = 'Request timed out. Please try again.';
    } else if (error.message.toLowerCase().includes('network')) {
      errorType = 'network_error';
      userMessage = 'Network error occurred. Please check your connection and try again.';
    } else if (error.message.includes('Invalid token')) {
      errorType = 'auth_error';
      userMessage = 'Authentication failed. Please log in again.';
    } else if (error.message.includes('Code verifier not found')) {
      errorType = 'oauth_state_error';
      userMessage = 'OAuth state expired. Please restart the connection process.';
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: userMessage,
        errorType: errorType,
        details: Deno.env.get('NODE_ENV') === 'development' ? error.message : undefined
      }),
      { 
        status: errorType === 'auth_error' ? 401 : 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})

// PKCE utility functions
function generateCodeVerifier(): string {
  const array = new Uint32Array(56);
  crypto.getRandomValues(array);
  return Array.from(array, (dec) => ('0' + dec.toString(16)).substr(-2)).join('');
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
