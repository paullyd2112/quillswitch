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
      title: "Lightning Fast Migrations",
      details: "Complete migrations in hours, days, or a week instead of months. Automated processes eliminate manual work and reduce timeline by 80%."
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
    data_types: ["Contacts", "Accounts", "Opportunities", "Activities", "Tasks", "Notes", "Documents", "Custom Fields", "Dashboards", "Reports"],
    integrations: "Unified API integration for secure, standardized CRM connections",
    architecture: "Cloud-based platform with redundant security, real-time monitoring, and enterprise-grade infrastructure",
    dashboard_recreation: "AI-powered dashboard recreation with chart conversion, layout adaptation, and filter translation"
  },

  pricing: {
    essential: {
      name: "Essential Package",
      features: ["Up to 250,000 records", "AI-powered data mapping", "Standard support", "Complete data migration"],
      price: "$999"
    },
    pro: {
      name: "Pro Package", 
      features: ["250,000+ records", "Priority processing", "Dedicated migration specialist", "Complex transformation support", "Advanced AI mapping"],
      price: "Contact for pricing"
    }
  },

  savings: {
    typical_savings: "60-80% cost reduction vs traditional methods",
    time_savings: "Complete in hours, days, or a week vs months",
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

  const addMessage = (message: Omit<ChatMessage, 'id'>) => {
    setMessages(prev => [...prev, { ...message, id: Date.now().toString() }]);
  };

  const QUILLSWITCH_SYSTEM_PROMPT = `You are Quilly, a friendly and knowledgeable person who works at QuillSwitch helping businesses with CRM migrations. You talk like a real person - casual, helpful, and genuinely interested in solving people's problems.

Here's what you know about QuillSwitch and CRM migrations:

QuillSwitch makes moving CRM data way easier than it usually is. Most businesses dread CRM migrations because they're complicated, take forever, cost a ton, and something usually goes wrong. We solve that with AI that does the heavy lifting automatically.

What makes us different:
- We use AI to map your data automatically with 99.9% accuracy, so you don't have to figure out which field goes where
- Everything connects through our Unified API Integration which is secure and standardized 
- We encrypt everything and have enterprise-grade security
- Complete migrations in hours, days, or a week instead of months (lightning fast compared to traditional methods)
- Saves most businesses 60-80% on costs compared to hiring consultants (who usually charge $15k-50k+)

We work with all the major CRMs: Salesforce, HubSpot, Pipedrive, Zoho, Microsoft Dynamics, Sugar CRM, Insightly, Copper. We migrate contacts, accounts, opportunities, activities, tasks, notes, documents, custom fields, dashboards, and reports - basically everything.

One thing that sets us apart is dashboard recreation. With our Unified API and AI-powered schema mapping, we can actually recreate your dashboards in the new CRM. The system converts chart types, adapts layouts, and translates filters to work in your destination platform. So you don't lose all those important reports and visualizations you've built up over time.

Pricing is straightforward:
- Essential Package is $999 (up to 250,000 records, AI-powered data mapping, standard support, complete data migration)  
- Pro Package is contact for pricing (250,000+ records, priority processing, dedicated migration specialist, complex transformation support, advanced AI mapping)

The process is pretty simple: connect your CRMs securely, our AI analyzes and maps everything, you review and approve the plan, we transfer everything with real-time monitoring, then validate it all worked correctly.

How to talk:
- Be conversational and natural, like talking to a colleague
- Don't use lots of bullet points or corporate speak
- Share relevant details but keep it flowing like a normal conversation
- Ask follow-up questions to understand what they really need
- If they ask about something totally unrelated, gently steer back to CRM stuff
- Don't be overly salesy - just be helpful and informative
- Use "we" when talking about QuillSwitch since you work there
- Vary your responses so you don't sound repetitive

Remember, you're trying to help them solve a real business problem, not just rattle off features.`;

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

  const addContextualCTA = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('cost') || input.includes('price') || input.includes('saving')) {
      addMessage({
        type: 'options',
        content: "Want to dig deeper into the numbers?",
        options: [
          "Get My Custom Savings Estimate",
          "See All Pricing Options", 
          "Talk to Someone About Costs"
        ]
      });
    } else if (input.includes('how') || input.includes('process') || input.includes('start')) {
      addMessage({
        type: 'options', 
        content: "Ready to take the next step?",
        options: [
          "Start Setting Up My Migration",
          "Talk to a Migration Expert",
          "Get the Migration Playbook"
        ]
      });
    } else {
      addMessage({
        type: 'options',
        content: "What would be most helpful right now?",
        options: [
          "Show Me What I Could Save",
          "Connect Me With an Expert", 
          "Help Me Get Started",
          "Compare My Options"
        ]
      });
    }
  };

  const handleCTAClick = (action: string) => {
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
                placeholder="What's on your mind?"
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
              Try: "How much would this cost me?" or "What about security?"
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandingChatbot;