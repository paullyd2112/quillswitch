import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MessageCircle, Calculator, TrendingUp, ArrowRight, X, Send, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

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
    problem: "Current CRM migration methods are complex, time-consuming, risky (data loss/errors), require technical expertise or expensive consultants, and neglect the hidden pain of manually reconnecting integrated applications post-migration.",
    solution: "Automated, secure CRM migration with AI-powered mapping, OAuth 2.0 security, and comprehensive ecosystem reconnection."
  },
  
  features: {
    security: {
      title: "Enterprise-Grade Security",
      details: "OAuth 2.0 authentication, pgsodium encryption at rest, Row Level Security (RLS), secure API connections, data protection guarantees."
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
    integrations: "Unified API integration supporting 200+ business tools for seamless ecosystem reconnection",
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
      "1. Connect your source and destination CRMs securely via OAuth",
      "2. AI analyzes and maps your data automatically", 
      "3. Review and approve the migration plan",
      "4. Execute secure data transfer with real-time monitoring",
      "5. Validate data accuracy and completeness",
      "6. Reconnect your integrated tools and applications"
    ]
  }
};

const LandingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "👋 Hi! I'm your QuillSwitch AI assistant. I can help you with:\n\n• CRM migration planning & costs\n• Technical details & security\n• Feature explanations & comparisons\n• Pricing & plan recommendations\n• Migration process & timeline\n\nWhat would you like to know about QuillSwitch?",
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

  const getIntelligentResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Cost & Savings related
    if (input.includes('cost') || input.includes('price') || input.includes('saving') || input.includes('expensive') || input.includes('budget')) {
      return `💰 **QuillSwitch Pricing & Savings:**

**Standard Plan:** Starting at $2,500
• Up to 50,000 records
• Basic data mapping  
• Standard support
• 30-day data retention

**Pro Plan:** Custom pricing
• Unlimited records
• Advanced AI mapping
• Priority support  
• 90-day data retention
• Custom integrations

**Typical Savings:** 60-80% vs traditional methods
• Avoid $15,000-$50,000+ in consulting fees
• 5x faster completion (weeks vs months)
• 80% reduction in internal staff time

Would you like a personalized savings calculation based on your specific situation?`;
    }

    // Security related
    if (input.includes('security') || input.includes('safe') || input.includes('secure') || input.includes('oauth') || input.includes('encryption')) {
      return `🔒 **Enterprise-Grade Security:**

• **OAuth 2.0 Authentication:** Secure API connections without exposing credentials
• **Encryption at Rest:** All data encrypted using pgsodium
• **Row Level Security (RLS):** Database-level access controls
• **Data Protection Guarantee:** 99.9% accuracy with comprehensive validation
• **Secure Infrastructure:** Cloud-based with redundant security measures
• **Compliance Ready:** Built for enterprise security standards

Your data is protected at every step of the migration process. We never store your actual CRM credentials - only secure OAuth tokens.`;
    }

    // Technical/Integration related  
    if (input.includes('technical') || input.includes('api') || input.includes('integration') || input.includes('crm') || input.includes('system')) {
      return `⚙️ **Technical Capabilities:**

**Supported CRMs:** 
Salesforce • HubSpot • Pipedrive • Zoho • Microsoft Dynamics • Sugar CRM • Insightly • Copper

**Data Types Migrated:**
• Contacts & Accounts
• Opportunities & Deals  
• Activities & Tasks
• Notes & Documents
• Custom Fields & Objects

**Unified API Integration:** 200+ business tools for ecosystem reconnection

**Architecture:** Cloud-based platform with real-time monitoring, automated scaling, and enterprise-grade infrastructure.

Need specifics about your CRM compatibility?`;
    }

    // Process/How it works
    if (input.includes('how') || input.includes('process') || input.includes('work') || input.includes('step') || input.includes('migration')) {
      return `🚀 **QuillSwitch Migration Process:**

**1. Secure Connection**
Connect source & destination CRMs via OAuth (no credentials stored)

**2. AI Analysis & Mapping** 
Our AI analyzes your data and creates intelligent field mappings

**3. Review & Approve**
Review the migration plan and make any custom adjustments

**4. Secure Transfer**
Execute migration with real-time monitoring and progress tracking

**5. Validation & Verification**
Comprehensive data accuracy checks and validation

**6. Ecosystem Reconnection**
Reconnect your integrated tools and applications seamlessly

**Timeline:** Weeks instead of months (5x faster than traditional methods)`;
    }

    // Features/Benefits
    if (input.includes('feature') || input.includes('benefit') || input.includes('advantage') || input.includes('better') || input.includes('why')) {
      return `✨ **Key QuillSwitch Features:**

🤖 **AI-Powered Automation**
• 99.9% data accuracy with intelligent mapping
• Automated field matching and transformation
• Smart error detection and resolution

⚡ **5x Faster Migrations**  
• Complete in weeks vs months
• 80% reduction in timeline
• Minimal business disruption

🔒 **Enterprise Security**
• OAuth 2.0 + encryption at rest
• No credential storage
• Data protection guarantee  

🎯 **Comprehensive Migration**
• All data types supported
• Custom field handling
• Document migration included

🔗 **Ecosystem Reconnection**
• 200+ tool integrations
• Automated reconnection process
• Minimal manual reconfiguration

Ready to see how this applies to your specific migration?`;
    }

    // Comparison related
    if (input.includes('compare') || input.includes('vs') || input.includes('versus') || input.includes('alternative') || input.includes('competitor')) {
      return `📊 **QuillSwitch vs Traditional Methods:**

**Manual Export/Import:**
❌ Weeks of manual work
❌ High error rates (10-30%)
❌ No automated validation
❌ Manual tool reconnection

**Consulting Services:**
❌ $15,000-$50,000+ costs
❌ 3-6 month timelines  
❌ Limited ongoing support
❌ External dependency

**QuillSwitch Automated:**
✅ AI-powered automation
✅ 99.9% accuracy guarantee
✅ 5x faster completion
✅ 60-80% cost savings
✅ Comprehensive ecosystem reconnection
✅ Ongoing support included

Want to see specific savings for your migration?`;
    }

    // Support/Help related
    if (input.includes('support') || input.includes('help') || input.includes('assistance') || input.includes('expert')) {
      return `🤝 **QuillSwitch Support:**

**Migration Specialists Available:**
• Dedicated expert for your migration
• Step-by-step guidance throughout
• Custom mapping assistance
• Post-migration validation

**Comprehensive Resources:**
• Detailed documentation
• Video tutorials
• Best practices guide
• Migration checklists

**Ongoing Support:**
• Email & chat support
• Phone consultation available
• Expert consultation scheduling
• Post-migration assistance

**Response Times:**
• Standard Plan: 24-48 hours
• Pro Plan: Same-day priority support

Ready to schedule a consultation with our migration experts?`;
    }

    // Default comprehensive response
    return `I can help you with detailed information about QuillSwitch! Here are some popular topics:

💰 **"pricing"** - Plans, costs, and savings calculations
🔒 **"security"** - OAuth, encryption, and data protection  
⚙️ **"technical"** - CRM compatibility and integrations
🚀 **"process"** - Step-by-step migration workflow
✨ **"features"** - AI automation and key benefits
📊 **"compare"** - How we compare to alternatives
🤝 **"support"** - Expert assistance and resources

Just ask me about any specific aspect you'd like to know more about!`;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    addMessage({ type: 'user', content: userMessage });
    
    // Simulate thinking delay
    setTimeout(() => {
      const response = getIntelligentResponse(userMessage);
      addMessage({ type: 'bot', content: response });
      
      // Add contextual CTAs based on the conversation
      setTimeout(() => {
        addContextualCTA(userMessage);
      }, 1000);
    }, 500);

    setInputValue('');
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
          Calculate Your Savings
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
              <Calculator className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">QuillSwitch Savings Calculator</CardTitle>
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
              <TrendingUp className="h-3 w-3 mr-1" />
              Live Savings Calculator
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