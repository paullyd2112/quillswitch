
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if API key is configured
    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Gemini API key not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the request body
    const { messages, systemPrompt, sourceFields, destinationFields } = await req.json();
    
    let content;
    
    if (sourceFields && destinationFields) {
      // This is a schema mapping request
      content = [{
        role: "model",
        parts: [{ 
          text: `You are a schema mapping assistant. Given the source fields and destination fields, suggest the best mapping between them. Consider naming conventions, data types, and common patterns.` 
        }]
      }, {
        role: "user",
        parts: [{ 
          text: `Source fields: ${JSON.stringify(sourceFields)}\nDestination fields: ${JSON.stringify(destinationFields)}\n\nProvide mapping suggestions in valid JSON format with this structure: [{"source_field": "string", "destination_field": "string", "confidence": number, "reason": "string"}]` 
        }]
      }];
    } else if (messages) {
      // Format messages for Gemini API (for general purpose use)
      content = messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }));

      // Add system prompt if provided
      if (systemPrompt) {
        content.unshift({
          role: "model",
          parts: [{ text: systemPrompt }]
        });
      }
    } else {
      throw new Error("Invalid request: missing required parameters");
    }
    
    // Make request to Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: content,
        generationConfig: {
          temperature: 0.2,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    const data = await response.json();
    console.log("Gemini API response:", JSON.stringify(data, null, 2));

    // Handle different response formats
    let responseText;
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      responseText = data.candidates[0].content.parts[0].text;
    } else if (data.error) {
      throw new Error(data.error.message || "Unknown error from Gemini API");
    } else {
      throw new Error("Unexpected response format from Gemini API");
    }

    // Return the response
    return new Response(
      JSON.stringify({ response: responseText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in gemini-chat function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
