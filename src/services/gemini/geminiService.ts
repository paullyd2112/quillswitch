
import { supabase } from "@/integrations/supabase/client";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface GeminiResponse {
  response?: string;
  error?: string;
}

export interface MappingSuggestion {
  source_field: string;
  destination_field: string;
  confidence: number;
  reason?: string;
  is_required?: boolean;
}

export const sendMessageToGemini = async (
  messages: ChatMessage[],
  systemPrompt?: string
): Promise<GeminiResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke("gemini-chat", {
      body: { messages, systemPrompt },
    });

    if (error) {
      console.error("Error calling Gemini function:", error);
      return { error: error.message || "Failed to communicate with AI assistant" };
    }

    return data as GeminiResponse;
  } catch (error: any) {
    console.error("Exception in gemini service:", error);
    return { error: error.message || "An unexpected error occurred" };
  }
};

export const generateFieldMappingSuggestions = async (
  sourceFields: string[],
  destinationFields: string[]
): Promise<MappingSuggestion[]> => {
  try {
    const { data, error } = await supabase.functions.invoke("gemini-chat", {
      body: { sourceFields, destinationFields },
    });

    if (error) {
      console.error("Error calling Gemini mapping function:", error);
      throw new Error(error.message || "Failed to generate mapping suggestions");
    }

    if (!data?.response) {
      throw new Error("No mapping suggestions received");
    }

    try {
      // Parse the JSON response
      const suggestions = JSON.parse(data.response);
      
      if (!Array.isArray(suggestions)) {
        throw new Error("Invalid mapping suggestions format");
      }
      
      return suggestions;
    } catch (parseError) {
      console.error("Error parsing mapping suggestions:", parseError);
      throw new Error("Failed to parse mapping suggestions");
    }
  } catch (error: any) {
    console.error("Exception in gemini mapping service:", error);
    throw error;
  }
};
