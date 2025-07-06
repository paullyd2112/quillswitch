import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const unifiedApiKey = Deno.env.get('UNIFIED_API_KEY');
    
    if (!unifiedApiKey) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "UNIFIED_API_KEY not found in environment" 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      );
    }

    const { integration_type, redirect_uri, state } = await req.json();
    
    if (!integration_type || !redirect_uri) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Missing required parameters: integration_type and redirect_uri" 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }

    console.log(`Initiating OAuth for ${integration_type} with redirect ${redirect_uri}`);

    // Create a workspace connection in Unified.to
    const workspaceResponse = await fetch('https://api.unified.to/unified/connection', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${unifiedApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        integration_type: integration_type,
        auth: {
          type: 'oauth2',
          redirect_uri: redirect_uri,
          state: state || `${integration_type}_${Date.now()}`
        }
      })
    });

    console.log('Workspace response status:', workspaceResponse.status);

    if (!workspaceResponse.ok) {
      const errorText = await workspaceResponse.text();
      console.error('Workspace creation error:', errorText);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `Failed to create workspace: ${workspaceResponse.status} ${errorText}` 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }

    const workspaceData = await workspaceResponse.json();
    console.log('Workspace created:', workspaceData);

    // The response should contain the authorization URL
    return new Response(
      JSON.stringify({
        success: true,
        authorization_url: workspaceData.auth_url || workspaceData.redirect_url,
        workspace_id: workspaceData.workspace_id,
        connection_id: workspaceData.id,
        state: workspaceData.auth?.state || state
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('OAuth authorization error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Unknown error occurred during OAuth setup" 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});