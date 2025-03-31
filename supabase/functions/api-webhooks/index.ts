
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as crypto from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock webhooks storage
const webhooks = new Map();

const baseResponse = (success: boolean, data: any, meta?: any, error?: any) => {
  if (success) {
    return { success, data, meta: meta || {} };
  }
  return { success, error };
};

const createSignature = async (payload: any, secret: string): Promise<string> => {
  const encoder = new TextEncoder();
  const message = encoder.encode(JSON.stringify(payload));
  const secretKey = encoder.encode(secret);
  
  const key = await crypto.subtle.importKey(
    "raw",
    secretKey,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signature = await crypto.subtle.sign("HMAC", key, message);
  const hashArray = Array.from(new Uint8Array(signature));
  const hexString = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `sha256=${hexString}`;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    
    // Authentication check
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify(baseResponse(false, null, null, {
          code: 'invalid_auth',
          message: 'Invalid authentication credentials',
        })),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Register new webhook
    if (path === 'webhooks' && req.method === 'POST') {
      const body = await req.json();
      
      // Validate required fields
      if (!body.url || !body.events || !Array.isArray(body.events) || body.events.length === 0) {
        return new Response(
          JSON.stringify(baseResponse(false, null, null, {
            code: 'invalid_request',
            message: 'Missing required fields: url and events are required',
          })),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const webhookId = `wh_${Math.floor(Math.random() * 1000000)}`;
      const webhook = {
        webhookId,
        url: body.url,
        events: body.events,
        secret: body.secret || crypto.randomUUID(),
        createdAt: new Date().toISOString()
      };
      
      // Store webhook
      webhooks.set(webhookId, webhook);

      // Remove secret from response for security
      const responseWebhook = { ...webhook };
      delete responseWebhook.secret;

      return new Response(
        JSON.stringify(baseResponse(true, responseWebhook)),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // List webhooks
    if (path === 'webhooks' && req.method === 'GET') {
      const webhooksList = Array.from(webhooks.values()).map(webhook => {
        const { secret, ...rest } = webhook;
        return rest;
      });
      
      return new Response(
        JSON.stringify(baseResponse(true, webhooksList)),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Delete webhook
    if (path && path.startsWith('wh_') && req.method === 'DELETE') {
      const webhookId = path;
      
      if (!webhooks.has(webhookId)) {
        return new Response(
          JSON.stringify(baseResponse(false, null, null, {
            code: 'not_found',
            message: 'Webhook not found',
          })),
          { 
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      webhooks.delete(webhookId);
      
      return new Response(
        JSON.stringify(baseResponse(true, { deleted: true })),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Test webhook
    if (path === 'test' && req.method === 'POST') {
      const body = await req.json();
      
      if (!body.webhookId) {
        return new Response(
          JSON.stringify(baseResponse(false, null, null, {
            code: 'invalid_request',
            message: 'Missing required field: webhookId',
          })),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      const webhook = webhooks.get(body.webhookId);
      
      if (!webhook) {
        return new Response(
          JSON.stringify(baseResponse(false, null, null, {
            code: 'not_found',
            message: 'Webhook not found',
          })),
          { 
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      // Create test event payload
      const eventPayload = {
        event: 'migration.completed',
        timestamp: new Date().toISOString(),
        data: {
          migrationId: `mig_${Math.floor(Math.random() * 1000000)}`,
          name: 'Test Migration',
          source: 'salesforce',
          destination: 'hubspot',
          stats: {
            total: 1475,
            migrated: 1450,
            failed: 25,
            duration: '01:10:23'
          }
        }
      };
      
      // Generate signature
      const signature = await createSignature(eventPayload, webhook.secret);
      
      // Send test webhook (we're not actually sending it, just simulating)
      return new Response(
        JSON.stringify(baseResponse(true, {
          sent: true,
          url: webhook.url,
          payload: eventPayload,
          headers: {
            'Content-Type': 'application/json',
            'X-Signature': signature,
            'X-Webhook-ID': webhook.webhookId
          }
        })),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return 404 for other paths
    return new Response(
      JSON.stringify(baseResponse(false, null, null, {
        code: 'not_found',
        message: 'Endpoint not found',
      })),
      { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify(baseResponse(false, null, null, {
        code: 'server_error',
        message: error.message,
      })),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
