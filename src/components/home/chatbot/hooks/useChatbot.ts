import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { sendMessageToGemini, type ChatMessage as GeminiChatMessage } from "@/services/gemini/geminiService";
import { QUILLSWITCH_SYSTEM_PROMPT, CTA_OPTIONS } from "../constants";

export interface ChatMessage {
  id: string;
  type: 'bot' | 'user' | 'options';
  content: string;
  options?: string[];
}

export const useChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hey there! I'm Quilly, and I'm here to help with any questions you have about CRM migrations.\n\nI've helped tons of businesses move their data from one CRM to another, so whether you're just starting to think about it or you're deep in the weeds trying to figure something out, I'm here to help.\n\nWhat's on your mind?",
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addMessage = useCallback((message: Omit<ChatMessage, 'id'>) => {
    setMessages(prev => [...prev, { ...message, id: Date.now().toString() }]);
  }, []);

  const getGeminiResponse = async (userInput: string): Promise<string> => {
    try {
      setIsLoading(true);
      
      // Build conversation history for context
      const conversationHistory: GeminiChatMessage[] = messages
        .filter(msg => msg.type !== 'options')
        .slice(-6) // Keep last 6 messages for context
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));
      
      // Add current user message
      conversationHistory.push({
        role: 'user',
        content: userInput
      });

      const response = await sendMessageToGemini(conversationHistory, QUILLSWITCH_SYSTEM_PROMPT);
      
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
  };

  const addContextualCTA = useCallback((userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('cost') || input.includes('price') || input.includes('saving')) {
      addMessage({
        type: 'options',
        content: "Want to dig deeper into the numbers?",
        options: CTA_OPTIONS.cost
      });
    } else if (input.includes('how') || input.includes('process') || input.includes('start')) {
      addMessage({
        type: 'options', 
        content: "Ready to take the next step?",
        options: CTA_OPTIONS.process
      });
    } else {
      addMessage({
        type: 'options',
        content: "What would be most helpful right now?",
        options: CTA_OPTIONS.general
      });
    }
  }, [addMessage]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    addMessage({ type: 'user', content: userMessage });
    setInputValue('');
    
    // Add loading message
    const loadingMessage: ChatMessage = { 
      type: 'bot', 
      content: "Just a sec...",
      id: Date.now().toString()
    };
    setMessages(prev => [...prev, loadingMessage]);
    
    try {
      const response = await getGeminiResponse(userMessage);
      
      // Replace loading message with actual response
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessage.id 
          ? { ...msg, content: response }
          : msg
      ));
      
      // Add contextual CTAs after a delay
      setTimeout(() => {
        addContextualCTA(userMessage);
      }, 1500);
      
    } catch (error) {
      // Replace loading message with error
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessage.id 
          ? { ...msg, content: "I'm sorry, I encountered an error. Please try asking me about QuillSwitch pricing, features, or migration process!" }
          : msg
      ));
    }
  };

  const handleCTAClick = useCallback((action: string) => {
    addMessage({ type: 'user', content: action });
    
    switch (action) {
      case "Get My Custom Savings Estimate":
      case "Show Me What I Could Save":
      case "See All Pricing Options":
      case "Compare My Options":
        navigate("/pricing-estimator");
        break;
      case "Start Setting Up My Migration":
      case "Help Me Get Started":
        if (user) {
          navigate("/app/setup");
        } else {
          navigate("/auth?redirect=/app/setup");
        }
        break;
      case "Talk to a Migration Expert":
      case "Connect Me With an Expert":
      case "Talk to Someone About Costs":
        navigate("/support");
        break;
      case "Get the Migration Playbook":
        navigate("/resources");
        break;
    }
    setIsOpen(false);
  }, [addMessage, navigate, user]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return {
    isOpen,
    setIsOpen,
    inputValue,
    setInputValue,
    isLoading,
    messages,
    messagesEndRef,
    inputRef,
    handleSendMessage,
    handleCTAClick,
    handleKeyPress
  };
};