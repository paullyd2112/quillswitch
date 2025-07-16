
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create Supabase client using the anon key for user authentication
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    // Get request body
    const { tier, priceId, planName, metadata } = await req.json();
    
    // Retrieve authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) {
      throw new Error("User not authenticated or email not available");
    }

    console.log("Creating payment for user:", user.email, "tier:", tier, "planName:", planName);

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if a Stripe customer record exists for this user
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Define pricing based on tier or planName
    let amount: number;
    let productName: string;
    let successUrl: string;
    let cancelUrl: string;
    
    if (planName === 'Express Migration') {
      amount = 299700; // $2,997 in cents
      productName = "Express CRM Migration Service";
      successUrl = `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}&plan=express`;
      cancelUrl = `${req.headers.get("origin")}/demo`;
    } else if (planName === 'Premium Migration') {
      amount = 499700; // $4,997 in cents
      productName = "Premium CRM Migration Service with Support";
      successUrl = `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}&plan=premium`;
      cancelUrl = `${req.headers.get("origin")}/demo`;
    } else if (tier === 'essentials') {
      amount = 99900; // $999 in cents
      productName = "QuillSwitch Essentials Plan";
      successUrl = `${req.headers.get("origin")}/payment-success?tier=${tier}`;
      cancelUrl = `${req.headers.get("origin")}/pricing`;
    } else if (tier === 'pro') {
      amount = 249900; // $2499 in cents
      productName = "QuillSwitch Professional Migration Plan";
      successUrl = `${req.headers.get("origin")}/payment-success?tier=${tier}`;
      cancelUrl = `${req.headers.get("origin")}/pricing`;
    } else {
      throw new Error("Invalid tier or plan specified");
    }

    // Create a one-time payment session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: productName,
              description: planName ? `Complete CRM migration service - ${planName}` :
                (tier === 'essentials' 
                  ? "Complete data migration for up to 250,000 records with AI-powered field mapping"
                  : "Advanced migration for up to 500,000 records with priority processing and dedicated specialist")
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        tier: tier || '',
        plan_name: planName || '',
        user_id: user.id,
        source: metadata?.source || 'unknown',
        record_count: metadata?.recordCount?.toString() || '0'
      },
    });

    // If this is a migration service payment, create lead record
    if (planName) {
      const supabaseService = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false } }
      );

      await supabaseService.from("demo_completion_leads").insert({
        user_id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email.split('@')[0],
        company_name: 'TBD', // Will be filled during founder outreach
        current_crm: 'TBD', // Will be determined from demo data
        target_crm: 'TBD', // Will be determined from demo data
        estimated_records: metadata?.recordCount || 100,
        timeline: planName === 'Express Migration' ? '7 days' : '14 days',
        pain_points: `Demo completed with ${metadata?.recordCount || 100} records. Selected ${planName}.`,
        lead_status: 'payment_pending',
        follow_up_scheduled: false
      });

      console.log(`Lead created for migration service: ${planName}, user: ${user.email}`);
    }

    console.log("Payment session created:", session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
