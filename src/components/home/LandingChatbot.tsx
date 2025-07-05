import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MessageCircle, Calculator, TrendingUp, ArrowRight, X, Send, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { sendMessageToGemini, type ChatMessage as GeminiChatMessage } from "@/services/gemini/geminiService";

interface ChatMessage {
  id: string;
  type: 'bot' | 'user' | 'options';
  content: string;
  options?: string[];
}

// Comprehensive QuillSwitch Knowledge Base
const QUILLSWITCH_KNOWLEDGE = {
  overview: {
    mission: "QuillSwitch makes CRM data migration simple, secure, and fast for Small-to-Medium Businesses (SMBs) and Mid-Market companies.",
    problem: "Current CRM migration methods are complex, time-consuming, risky (data loss/errors), require technical expertise or expensive consultants.",
    solution: "Automated, secure CRM migration with AI-powered mapping and Unified API Integration security."
  },
  
  features: {
    security: {
      title: "Enterprise-Grade Security",
      details: "Unified API Integration, pgsodium encryption at rest, Row Level Security (RLS), secure API connections, data protection guarantees."
    },
    automation: {
      title: "AI-Powered Automation", 
      details: "Automated data mapping with 99.9% accuracy, intelligent field matching, transformation rules, validation, and error handling."
    },
    speed: {
      title: "5x Faster Migrations",
      details: "Complete migrations in weeks instead of months. Automated processes eliminate manual work and reduce timeline by 80%."
    },
    accuracy: {
      title: "99.9% Data Accuracy",
      details: "AI-powered mapping ensures precise data transfer. Comprehensive validation and error checking before migration."
    },
    support: {
      title: "Expert Support",
      details: "Dedicated migration specialists, step-by-step guidance, comprehensive documentation, and post-migration support."
    }
  },

  technical: {
    supported_crms: ["Salesforce", "HubSpot", "Pipedrive", "Zoho", "Microsoft Dynamics", "Sugar CRM", "Insightly", "Copper"],
    data_types: ["Contacts", "Accounts", "Opportunities", "Activities", "Tasks", "Notes", "Documents", "Custom Fields"],
    integrations: "Unified API integration for secure, standardized CRM connections",
    architecture: "Cloud-based platform with redundant security, real-time monitoring, and enterprise-grade infrastructure"
  },

  pricing: {
    standard: {
      name: "Standard Plan",
      features: ["Up to 50,000 records", "Basic data mapping", "Standard support", "30-day data retention"],
      price: "Starting at $2,500"
    },
    pro: {
      name: "Pro Plan", 
      features: ["Unlimited records", "Advanced AI mapping", "Priority support", "90-day data retention", "Custom integrations"],
      price: "Custom pricing"
    }
  },

  savings: {
    typical_savings: "60-80% cost reduction vs traditional methods",
    time_savings: "5x faster completion (weeks vs months)",
    consultant_cost_avoided: "$15,000-$50,000+ in consulting fees",
    internal_resource_savings: "80% reduction in internal staff time"
  },

  process: {
    steps: [
      "1. Connect your source and destination CRMs securely via Unified API Integration",
      "2. AI analyzes and maps your data automatically", 
      "3. Review and approve the migration plan",
      "4. Execute secure data transfer with real-time monitoring",
      "5. Validate data accuracy and completeness"
    ]
  }
};

const LandingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "👋 Hello! I'm **Quilly**, your interactive QuillSwitch assistant!\n\nI'm here to help you with everything about CRM migrations:\n\n• Migration planning & cost analysis\n• Security & technical details\n• Feature comparisons & benefits\n• Pricing recommendations\n• Step-by-step guidance\n\n**Ask me anything** - I'm powered by AI and have comprehensive knowledge about QuillSwitch!",
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

  const addMessage = (message: Omit<ChatMessage, 'id'>) => {
    setMessages(prev => [...prev, { ...message, id: Date.now().toString() }]);
  };

  const QUILLSWITCH_SYSTEM_PROMPT = `You are Quilly, the friendly and knowledgeable AI assistant for QuillSwitch. You help users understand CRM migration services and provide comprehensive information about QuillSwitch.

ABOUT QUILLSWITCH:
- Mission: Make CRM data migration simple, secure, and fast for SMBs and Mid-Market companies
- Core Problem Solved: Traditional CRM migrations are complex, time-consuming, risky, expensive, and require technical expertise or expensive consultants
- Solution: Automated, AI-powered, secure CRM migration with Unified API Integration

KEY FEATURES & BENEFITS:
🔒 Enterprise-Grade Security:
- Unified API Integration (secure, standardized connections)
- pgsodium encryption at rest
- Row Level Security (RLS)
- Data protection guarantee
- Compliance-ready infrastructure

🤖 AI-Powered Automation:
- 99.9% data accuracy with intelligent mapping
- Automated field matching and transformation
- Smart error detection and resolution
- Comprehensive validation

⚡ 5x Faster Migrations:
- Complete in weeks vs months (80% time reduction)
- Minimal business disruption
- Real-time monitoring and progress tracking

💰 Significant Cost Savings:
- 60-80% cost reduction vs traditional methods
- Avoid $15,000-$50,000+ in consulting fees
- 80% reduction in internal staff time

TECHNICAL CAPABILITIES:
- Supported CRMs: Salesforce, HubSpot, Pipedrive, Zoho, Microsoft Dynamics, Sugar CRM, Insightly, Copper
- Data Types: Contacts, Accounts, Opportunities, Activities, Tasks, Notes, Documents, Custom Fields
- Unified API Integration: Secure, standardized CRM connections
- Cloud-based platform with enterprise-grade infrastructure

PRICING PLANS:
Standard Plan ($2,500):
- Up to 50,000 records
- Basic data mapping
- Standard support
- 30-day data retention

Pro Plan (Custom pricing):
- Unlimited records
- Advanced AI mapping
- Priority support
- 90-day data retention
- Custom integrations

MIGRATION PROCESS:
1. Secure Connection (Unified API Integration - standardized, secure connections)
2. AI Analysis & Mapping (intelligent field matching)
3. Review & Approve (custom adjustments available)
4. Secure Transfer (real-time monitoring)
5. Validation & Verification (comprehensive accuracy checks)

PERSONALITY & TONE:
- Be friendly, helpful, and enthusiastic about QuillSwitch
- Use emojis and formatting to make responses engaging
- Provide specific, actionable information
- Always be ready to help with next steps
- Focus on benefits and value proposition
- Be concise but comprehensive

If users ask about topics outside QuillSwitch/CRM migration, politely redirect them back to how you can help with their migration needs.

Always end responses with a helpful question or suggestion for next steps to keep the conversation flowing.`;

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
      
      return response.response || "I apologize, but I'm having trouble processing your request right now. Please try asking me about QuillSwitch features, pricing, or migration process!";
      
    } catch (error) {
      console.error('Error getting Gemini response:', error);
      return "I'm sorry, I'm experiencing some technical difficulties. However, I'd still love to help you with your CRM migration questions! Try asking me about our pricing plans, security features, or migration process.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    addMessage({ type: 'user', content: userMessage });
    setInputValue('');
    
    // Add loading message
    const loadingMessage: ChatMessage = { 
      type: 'bot', 
      content: "🤔 Thinking...",
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

  const addContextualCTA = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('cost') || input.includes('price') || input.includes('saving')) {
      addMessage({
        type: 'options',
        content: "Would you like to:",
        options: [
          "Get Personalized Savings Calculation",
          "View Detailed Pricing Plans", 
          "Schedule Cost Consultation"
        ]
      });
    } else if (input.includes('how') || input.includes('process') || input.includes('start')) {
      addMessage({
        type: 'options', 
        content: "Ready to get started?",
        options: [
          "Start Migration Setup",
          "Schedule Expert Consultation",
          "Download Migration Guide"
        ]
      });
    } else {
      addMessage({
        type: 'options',
        content: "How can I help you further?",
        options: [
          "Calculate My Savings",
          "Schedule Consultation", 
          "Start Migration Setup",
          "Compare Plans"
        ]
      });
    }
  };

  const handleCTAClick = (action: string) => {
    addMessage({ type: 'user', content: action });
    
    switch (action) {
      case "Get Personalized Savings Calculation":
      case "Calculate My Savings":
      case "View Detailed Pricing Plans":
      case "Compare Plans":
        navigate("/pricing-estimator");
        break;
      case "Start Migration Setup":
        if (user) {
          navigate("/app/setup");
        } else {
          navigate("/auth?redirect=/app/setup");
        }
        break;
      case "Schedule Expert Consultation":
      case "Schedule Cost Consultation":
        navigate("/support");
        break;
      case "Download Migration Guide":
        navigate("/resources");
        break;
    }
    setIsOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 group"
          size="lg"
        >
          <MessageCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
        </Button>
        <div className="absolute -top-12 -left-8 bg-slate-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Chat with Quilly
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="border border-slate-200 dark:border-slate-800 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Quilly - Interactive QuillSwitch Assistant</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <Bot className="h-3 w-3 mr-1" />
              AI-Powered Assistant
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-thin">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'bot' && (
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 max-w-[85%]">
                    <div className="text-sm whitespace-pre-line">{message.content}</div>
                  </div>
                )}
                
                {message.type === 'user' && (
                  <div className="bg-primary text-white rounded-lg p-3 max-w-[85%]">
                    <div className="text-sm">{message.content}</div>
                  </div>
                )}

                {message.type === 'options' && (
                  <div className="w-full space-y-2">
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
                      <div className="text-sm mb-3">{message.content}</div>
                      <div className="space-y-2">
                        {message.options?.map((option, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="w-full justify-between text-left h-auto py-2 px-3"
                            onClick={() => handleCTAClick(option)}
                          >
                            <span className="text-sm">{option}</span>
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {messages.length > 0 && (
              <div ref={messagesEndRef} />
            )}
          </div>
          
          {/* Input Section */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-3 mt-3">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about QuillSwitch..."
                className="flex-1 text-sm"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                size="sm"
                className="px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Try asking: "How much can I save?" or "Tell me about security"
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandingChatbot;