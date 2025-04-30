
import { supabase } from "@/integrations/supabase/client";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface GeminiResponse {
  response?: string;
  error?: string;
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
