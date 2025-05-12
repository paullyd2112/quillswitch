
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.24.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
const handleCors = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
};

// Authenticate with Google Cloud using service account credentials
async function authenticateWithGCP() {
  try {
    const serviceAccountKey = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
    if (!serviceAccountKey) {
      throw new Error("Google service account key is not set in environment variables");
    }

    // Create a JWT token for Google Cloud authentication
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: JSON.parse(serviceAccountKey).client_email,
      scope: "https://www.googleapis.com/auth/cloud-platform",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now
    };

    // Sign the JWT with the private key from the service account
    const encoder = new TextEncoder();
    const privateKey = JSON.parse(serviceAccountKey).private_key;
    
    const key = await crypto.subtle.importKey(
      "pkcs8",
      new Uint8Array(new TextEncoder().encode(privateKey)),
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signature = await crypto.subtle.sign(
      { name: "RSASSA-PKCS1-v1_5" },
      key,
      encoder.encode(JSON.stringify(payload))
    );
    
    // Create the JWT token
    const token = [
      btoa(JSON.stringify({ alg: "RS256", typ: "JWT" })),
      btoa(JSON.stringify(payload)),
      btoa(String.fromCharCode(...new Uint8Array(signature)))
    ].join('.');
    
    // Exchange JWT for Google access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: token,
      }),
    });
    
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      throw new Error(`Failed to obtain GCP access token: ${JSON.stringify(tokenData)}`);
    }
    
    return tokenData.access_token;
  } catch (error) {
    console.error("GCP authentication error:", error);
    throw error;
  }
}

// Function to access Google Cloud Secret Manager
async function accessSecret(projectId: string, secretName: string, version: string = "latest") {
  try {
    const accessToken = await authenticateWithGCP();
    const secretUrl = `https://secretmanager.googleapis.com/v1/projects/${projectId}/secrets/${secretName}/versions/${version}:access`;
    
    const response = await fetch(secretUrl, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Failed to access secret: ${JSON.stringify(data)}`);
    }
    
    // The secret value is base64 encoded
    const secretValue = atob(data.payload.data);
    return secretValue;
  } catch (error) {
    console.error("Error accessing secret:", error);
    throw error;
  }
}

// Function to list available secrets
async function listSecrets(projectId: string) {
  try {
    const accessToken = await authenticateWithGCP();
    const listUrl = `https://secretmanager.googleapis.com/v1/projects/${projectId}/secrets`;
    
    const response = await fetch(listUrl, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Failed to list secrets: ${JSON.stringify(data)}`);
    }
    
    // Transform the response to return just the secret names
    return data.secrets?.map(secret => ({
      name: secret.name.split('/').pop(),
      createTime: secret.createTime,
      labels: secret.labels || {}
    })) || [];
  } catch (error) {
    console.error("Error listing secrets:", error);
    throw error;
  }
}

// Supabase client setup for authentication verification
const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  
  try {
    // Verify JWT before proceeding
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    // Validate the token
    const token = authHeader.replace('Bearer ', '');
    const { data: user, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    // Get GCP project ID from environment
    const projectId = Deno.env.get("GCP_PROJECT_ID");
    if (!projectId) {
      return new Response(JSON.stringify({ error: 'Missing GCP project configuration' }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    // Process the request based on the action
    const { action, secretName, version } = await req.json();
    
    if (action === 'get') {
      if (!secretName) {
        return new Response(JSON.stringify({ error: 'No secret name provided' }), {
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const secretValue = await accessSecret(projectId, secretName, version || 'latest');
      
      // Log access to the secret (without revealing the value)
      await supabase.from('credential_access_log').insert({
        user_id: user.user?.id,
        action: 'access_gcp_secret',
        credential_id: null, // Not applicable for GCP secrets
        metadata: { 
          secret_name: secretName,
          provider: 'gcp_secret_manager'
        }
      });
      
      return new Response(JSON.stringify({ 
        success: true, 
        data: secretValue 
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    } 
    else if (action === 'list') {
      const secrets = await listSecrets(projectId);
      
      return new Response(JSON.stringify({ 
        success: true, 
        data: secrets 
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    else {
      return new Response(JSON.stringify({ error: 'Invalid action, must be "get" or "list"' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
  } catch (error) {
    console.error("Error in gcp-secrets function:", error.message);
    return new Response(JSON.stringify({ error: error.message || 'An unknown error occurred' }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});
