
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

// Supabase client setup
const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// This function encrypts data using Deno's crypto APIs
async function encryptData(data: string, masterKey: string) {
  try {
    const encoder = new TextEncoder();
    const masterKeyData = encoder.encode(masterKey);
    
    // Create a key from the master key
    const key = await crypto.subtle.importKey(
      "raw",
      masterKeyData,
      { name: "AES-GCM" },
      false,
      ["encrypt"]
    );
    
    // Create a random initialization vector
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the data
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv
      },
      key,
      encoder.encode(data)
    );
    
    // Combine the IV and encrypted data
    const result = new Uint8Array(iv.length + encryptedData.byteLength);
    result.set(iv, 0);
    result.set(new Uint8Array(encryptedData), iv.length);
    
    // Return as base64
    return btoa(String.fromCharCode(...result));
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt data");
  }
}

// This function decrypts data
async function decryptData(encryptedData: string, masterKey: string) {
  try {
    // Convert from base64
    const data = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    
    // Extract the IV and encrypted content
    const iv = data.slice(0, 12);
    const encrypted = data.slice(12);
    
    const encoder = new TextEncoder();
    const masterKeyData = encoder.encode(masterKey);
    
    // Import the master key
    const key = await crypto.subtle.importKey(
      "raw",
      masterKeyData,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );
    
    // Decrypt the data
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv
      },
      key,
      encrypted
    );
    
    // Return as string
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt data");
  }
}

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
    
    // Get the master encryption key from environment
    const masterKey = Deno.env.get("ENCRYPTION_MASTER_KEY");
    if (!masterKey) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    // Process the request based on the action
    const { action, data } = await req.json();
    
    if (action === 'encrypt') {
      const encrypted = await encryptData(data, masterKey);
      return new Response(JSON.stringify({ data: encrypted }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    } 
    else if (action === 'decrypt') {
      const decrypted = await decryptData(data, masterKey);
      return new Response(JSON.stringify({ data: decrypted }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    } 
    else {
      return new Response(JSON.stringify({ error: 'Invalid action' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});
