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
  timestamp?: Date;
  sentiment?: 'positive' | 'negative' | 'neutral' | 'frustrated' | 'excited';
  intent?: 'research' | 'compare' | 'pricing' | 'technical' | 'ready' | 'concerned';
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
      timestamp: new Date(),
      sentiment: 'neutral',
      intent: 'research'
    }
  ]);
  
  // Conversation context tracking  
  const [conversationContext, setConversationContext] = useState({
    userDetails: {
      currentCRM: null as string | null,
      targetCRM: null as string | null,
      companySize: null as string | null,
      recordCount: null as string | null,
      industry: null as string | null,
      timeline: null as string | null,
      concerns: [] as string[],
      interests: [] as string[]
    },
    journeyStage: 'initial' as 'initial' | 'researching' | 'comparing' | 'evaluating' | 'ready' | 'concerned',
    conversationTone: 'neutral' as 'formal' | 'casual' | 'neutral',
    previousTopics: [] as string[],
    lastSentiment: 'neutral' as 'positive' | 'negative' | 'neutral' | 'frustrated' | 'excited'
  });
  
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
  }, []);

  // Analyze user message and update context
  const updateConversationContext = useCallback((userMessage: string) => {
    const message = userMessage.toLowerCase();
    
    setConversationContext(prev => {
      const updated = { ...prev };
      
      // Detect CRM mentions
      const crmKeywords = {
        'salesforce': 'Salesforce',
        'hubspot': 'HubSpot', 
        'pipedrive': 'Pipedrive',
        'zoho': 'Zoho',
        'dynamics': 'Microsoft Dynamics',
        'sugar': 'Sugar CRM'
      };
      
      Object.entries(crmKeywords).forEach(([keyword, name]) => {
        if (message.includes(keyword)) {
          if (message.includes('from') || message.includes('current')) {
            updated.userDetails.currentCRM = name;
          } else if (message.includes('to') || message.includes('switch')) {
            updated.userDetails.targetCRM = name;
          }
        }
      });
      
      // Detect company size indicators
      if (message.includes('small business') || message.includes('startup')) {
        updated.userDetails.companySize = 'small';
      } else if (message.includes('enterprise') || message.includes('large company')) {
        updated.userDetails.companySize = 'enterprise';
      } else if (message.includes('medium') || message.includes('mid-size')) {
        updated.userDetails.companySize = 'medium';
      }
      
      // Detect concerns
      const concernKeywords = ['worried', 'concerned', 'scared', 'risk', 'afraid', 'problem', 'issue', 'fail'];
      if (concernKeywords.some(word => message.includes(word))) {
        updated.lastSentiment = 'frustrated';
        if (!updated.userDetails.concerns.includes('risk_averse')) {
          updated.userDetails.concerns.push('risk_averse');
        }
      }
      
      // Detect positive sentiment
      const positiveKeywords = ['excited', 'great', 'awesome', 'perfect', 'exactly', 'love'];
      if (positiveKeywords.some(word => message.includes(word))) {
        updated.lastSentiment = 'positive';
      }
      
      // Detect urgency
      if (message.includes('urgent') || message.includes('quickly') || message.includes('asap')) {
        if (!updated.userDetails.concerns.includes('timeline_pressure')) {
          updated.userDetails.concerns.push('timeline_pressure');
        }
      }
      
      // Update journey stage
      if (message.includes('price') || message.includes('cost') || message.includes('budget')) {
        updated.journeyStage = 'evaluating';
      } else if (message.includes('ready') || message.includes('start') || message.includes('begin')) {
        updated.journeyStage = 'ready';
      } else if (message.includes('compare') || message.includes('vs') || message.includes('difference')) {
        updated.journeyStage = 'comparing';
      }
      
      return updated;
    });
  }, []);

  const getGeminiResponse = async (userInput: string): Promise<string> => {
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
  };

  const shouldShowCTA = useCallback((userInput: string, conversationHistory: ChatMessage[]): boolean => {
    const input = userInput.toLowerCase();
    const userMessageCount = conversationHistory.filter(msg => msg.type === 'user').length;
    
    // Enhanced logic based on conversation context and user journey
    
    // PRIORITY: Explicit expert requests
    const expertRequestIndicators = [
      'talk to a specialist', 'migration specialist', 'talk to someone', 'speak to someone',
      'connect me with', 'talk to a person', 'human help', 'live person', 'expert help',
      'migration expert', 'talk to an expert', 'speak with expert', 'connect with specialist',
      'want to talk', 'need to talk', 'let me talk', 'talk to your team', 'schedule a call'
    ];
    
    if (expertRequestIndicators.some(indicator => input.includes(indicator)) && userMessageCount >= 1) {
      return true;
    }
    
    // Don't show CTAs too early unless user is clearly ready
    if (userMessageCount < 2) return false;
    
    // Context-aware CTA timing based on journey stage
    const { journeyStage, lastSentiment } = conversationContext;
    
    // Show CTAs when user reaches key decision points
    if (journeyStage === 'ready' || journeyStage === 'evaluating') {
      return true;
    }
    
    // High-intent signals
    const readinessIndicators = [
      'ready', 'interested', 'sounds good', 'makes sense', 'convinced', 'sold',
      'let\'s do', 'want to', 'need to', 'should we', 'next step', 'move forward',
      'get started', 'sign up', 'try it', 'demo', 'setup', 'how much', 'pricing'
    ];
    
    // Question/concern indicators (don't show CTAs yet)
    const hesitationIndicators = [
      'what if', 'but what about', 'concerned about', 'worried about', 'issue with',
      'problem with', 'not sure', 'hesitant', 'doubt', 'risk', 'what happens',
      'tell me more', 'how does', 'can you explain'
    ];
    
    const showsReadiness = readinessIndicators.some(indicator => input.includes(indicator));
    const showsHesitation = hesitationIndicators.some(indicator => input.includes(indicator)) ||
                           input.includes('?');
    
    // Smart timing based on conversation flow
    if (showsReadiness && !showsHesitation) return true;
    if (showsHesitation) return false;
    
    // Natural conversation pause detection
    if (lastSentiment === 'positive' && userMessageCount >= 3) return true;
    if (userMessageCount >= 5 && !showsHesitation) return true;
    
    return false;
  }, [conversationContext]);

  const addContextualCTA = useCallback((userInput: string) => {
    const input = userInput.toLowerCase();
    const { journeyStage, userDetails, lastSentiment } = conversationContext;
    
    // Intelligent CTA selection based on conversation context
    let ctaMessage: string;
    let ctaOptions: string[];
    
    // Context-aware CTA messaging
    if (input.includes('cost') || input.includes('price') || input.includes('saving') || journeyStage === 'evaluating') {
      ctaMessage = userDetails.companySize === 'small' 
        ? "Want to see exactly how much you could save with your size business?"
        : "Ready to get a custom savings estimate for your specific situation?";
      ctaOptions = CTA_OPTIONS.cost;
    } 
    else if (input.includes('how') || input.includes('process') || input.includes('start') || journeyStage === 'ready') {
      ctaMessage = lastSentiment === 'positive' 
        ? "Sounds like you're ready to make this happen. What's the best next step for you?"
        : "Ready to take the next step?";
      ctaOptions = CTA_OPTIONS.process;
    }
    else if (userDetails.concerns.includes('risk_averse')) {
      ctaMessage = "I get it - migrations can feel risky. Want to talk through your specific concerns with one of our specialists?";
      ctaOptions = ["Talk to a Migration Expert", "Get the Migration Playbook", "See Risk-Free Options"];
    }
    else if (userDetails.concerns.includes('timeline_pressure')) {
      ctaMessage = "Time is crucial for you. Let's see what we can do to fast-track this:";
      ctaOptions = ["Talk to a Migration Expert", "Get Emergency Migration Quote", "See Fastest Options"];
    }
    else {
      // Default contextual message based on journey stage
      const messages = {
        'researching': "What would help you make the best decision?",
        'comparing': "Ready to see how we stack up?",
        'evaluating': "What would be most helpful for your evaluation?",
        'ready': "Looks like you're ready to move forward. What's next?",
        'initial': "What would be most helpful right now?"
      };
      ctaMessage = messages[journeyStage] || messages['initial'];
      ctaOptions = CTA_OPTIONS.general;
    }
    
    addMessage({
      type: 'options',
      content: ctaMessage,
      options: ctaOptions
    });
  }, [addMessage, conversationContext]);

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
        window.open("https://calendly.com/paul-aqua-quillswitch/30min", "_blank");
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