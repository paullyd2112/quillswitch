import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SalesforceOAuthRequest {
  action: 'authorize' | 'callback' | 'refresh' | 'revoke';
  code?: string;
  refreshToken?: string;
  state?: string;
  redirectUri: string;
  sandbox?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      throw new Error('Invalid token')
    }

    const body: SalesforceOAuthRequest = await req.json()
    
    // Get Salesforce OAuth credentials from Supabase secrets
    const clientId = Deno.env.get('SALESFORCE_CLIENT_ID')
    const clientSecret = Deno.env.get('SALESFORCE_CLIENT_SECRET')
    
    if (!clientId || !clientSecret) {
      throw new Error('Salesforce OAuth credentials not configured')
    }

    const baseUrl = body.sandbox ? 'https://test.salesforce.com' : 'https://login.salesforce.com'

    switch (body.action) {
      case 'authorize': {
        // Generate authorization URL
        const scopes = ['id', 'api', 'refresh_token', 'offline_access']
        const params = new URLSearchParams({
          response_type: 'code',
          client_id: clientId,
          redirect_uri: body.redirectUri,
          scope: scopes.join(' '),
          state: body.state || `sf_${user.id}_${Date.now()}`
        })

        const authUrl = `${baseUrl}/services/oauth2/authorize?${params.toString()}`
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            authUrl,
            state: body.state || `sf_${user.id}_${Date.now()}`
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

        // Exchange code for tokens
        const tokenParams = new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: body.redirectUri,
          code: body.code
        })

        const tokenResponse = await fetch(`${baseUrl}/services/oauth2/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          body: tokenParams.toString()
        })

        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text()
          throw new Error(`Token exchange failed: ${tokenResponse.status} - ${errorText}`)
        }

        const tokens = await tokenResponse.json()
        
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

        if (storeError) {
          console.error('Error storing credential:', storeError)
          throw new Error('Failed to store Salesforce credentials')
        }

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

        const refreshResponse = await fetch(`${baseUrl}/services/oauth2/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          body: refreshParams.toString()
        })

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

        const revokeResponse = await fetch(`${baseUrl}/services/oauth2/revoke`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: revokeParams.toString()
        })

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
    console.error('Salesforce OAuth error:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})