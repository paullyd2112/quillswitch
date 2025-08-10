import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { ChatMessage } from "../types";
import { useConversationContext } from "./useConversationContext";
import { useCTALogic } from "./useCTALogic";
import { useMessageHandling } from "./useMessageHandling";

export const useChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hey there! I'm Quilly, and I'm here to help with any questions you have about CRM migrations.\n\nI've helped tons of businesses move their data from one CRM to another, so whether you're just starting to think about it or you're deep in the weeds trying to figure something out, I'm here to help.\n\nWhat's on your mind?",
      timestamp: new Date(),
      sentiment: 'neutral',
      intent: 'research'
    }
  ]);
  
  // Initialize custom hooks
  const { conversationContext, updateConversationContext } = useConversationContext();
  const { shouldShowCTA, getContextualCTA } = useCTALogic(conversationContext);
  const { getGeminiResponse } = useMessageHandling(messages, conversationContext, setIsLoading);
  
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
    const newMessage = { 
      ...message, 
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Update conversation context based on new message
    if (message.type === 'user') {
      updateConversationContext(message.content);
    }
  }, [updateConversationContext]);

  // This is now handled by the useMessageHandling hook

  // This is now handled by the useCTALogic hook

  const addContextualCTA = useCallback((userInput: string) => {
    const { message, options } = getContextualCTA(userInput);
    addMessage({
      type: 'options',
      content: message,
      options: options
    });
  }, [addMessage, getContextualCTA]);

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
      
      // Only show CTAs when conversation flow indicates user is ready
      if (shouldShowCTA(userMessage, messages)) {
        setTimeout(() => {
          addContextualCTA(userMessage);
        }, 1500);
      }
      
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
        navigate("/comparison");
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
        window.open("https://calendly.com/paul-aqua-quillswitch/30min", "_blank");
        break;
      case "Get the Migration Playbook":
        navigate("/comparison");
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

// Re-export types for backward compatibility
export * from '../types';