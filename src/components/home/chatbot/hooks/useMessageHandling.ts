import { useCallback } from 'react';
import { sendMessageToGemini, type ChatMessage as GeminiChatMessage } from "@/services/gemini/geminiService";
import { QUILLSWITCH_SYSTEM_PROMPT } from "../constants";
import { ChatMessage, ConversationContext } from '../types';

export const useMessageHandling = (
  messages: ChatMessage[],
  conversationContext: ConversationContext,
  setIsLoading: (loading: boolean) => void
) => {
  const getGeminiResponse = useCallback(async (userInput: string): Promise<string> => {
    try {
      setIsLoading(true);
      
      // Build enhanced conversation history with context
      const conversationHistory: GeminiChatMessage[] = messages
        .filter(msg => msg.type !== 'options')
        .slice(-8) // Keep more messages for better context
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));
      
      // Add current user message
      conversationHistory.push({
        role: 'user',
        content: userInput
      });

      // Create context-aware system prompt
      const contextualPrompt = `${QUILLSWITCH_SYSTEM_PROMPT}

CURRENT CONVERSATION CONTEXT:
${conversationContext.userDetails.currentCRM ? `- Current CRM: ${conversationContext.userDetails.currentCRM}` : ''}
${conversationContext.userDetails.targetCRM ? `- Target CRM: ${conversationContext.userDetails.targetCRM}` : ''}
${conversationContext.userDetails.companySize ? `- Company size: ${conversationContext.userDetails.companySize}` : ''}
${conversationContext.userDetails.concerns.length ? `- Concerns: ${conversationContext.userDetails.concerns.join(', ')}` : ''}
- Journey stage: ${conversationContext.journeyStage}
- Last sentiment: ${conversationContext.lastSentiment}
- Previous topics discussed: ${conversationContext.previousTopics.slice(-3).join(', ')}

IMPORTANT: Use this context to provide personalized, relevant responses that build on our conversation history. Reference previous details naturally and proactively address their specific situation.`;

      const response = await sendMessageToGemini(conversationHistory, contextualPrompt);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return response.response || "Sorry, I'm having a bit of trouble right now. But I'm still here to help with any CRM migration questions you have!";
      
    } catch (error) {
      console.error('Error getting Gemini response:', error);
      return "I'm having some technical issues at the moment, but I'd still love to help with your CRM migration questions. What would you like to know?";
    } finally {
      setIsLoading(false);
    }
  }, [messages, conversationContext, setIsLoading]);

  return {
    getGeminiResponse
  };
};