import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Calculator, TrendingUp, ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

interface ChatMessage {
  id: string;
  type: 'bot' | 'user' | 'options';
  content: string;
  options?: string[];
  data?: any;
}

interface UserData {
  migrationWeeks?: number;
  consultantCost?: number;
  internalStaffCost?: number;
  crmSavings?: number;
}

const LandingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm here to help you understand how QuillSwitch can save your business time and money on CRM migrations. What best describes your current situation?",
      options: [
        "Planning a CRM migration",
        "Stuck with current migration issues", 
        "Comparing migration solutions",
        "Just exploring options"
      ]
    }
  ]);
  const [userData, setUserData] = useState<UserData>({});
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  const addMessage = (message: Omit<ChatMessage, 'id'>) => {
    setMessages(prev => [...prev, { ...message, id: Date.now().toString() }]);
  };

  const calculateSavings = (data: UserData) => {
    const migrationWeeks = data.migrationWeeks || 12;
    const consultantCost = data.consultantCost || 12500; // $125/hr * 100 hours
    const internalStaffCost = data.internalStaffCost || 8000; // 2 staff * $2000/week * 2 weeks
    const crmSavings = data.crmSavings || 7200; // $600/month * 12 months
    
    const totalTraditionalCost = consultantCost + internalStaffCost;
    const quillswitchCost = 2500; // Our service cost
    const totalSavings = totalTraditionalCost - quillswitchCost + crmSavings;
    const timeSavings = Math.round((migrationWeeks * 0.8) * 10) / 10; // 80% time reduction

    return {
      totalSavings: Math.round(totalSavings),
      timeSavings,
      costBreakdown: {
        traditional: totalTraditionalCost,
        quillswitch: quillswitchCost,
        crmSavings
      }
    };
  };

  const handleOptionClick = (option: string, step: number) => {
    addMessage({ type: 'user', content: option });

    switch (step) {
      case 0:
        if (option === "Planning a CRM migration") {
          addMessage({
            type: 'bot',
            content: "Great! How long do you expect your current migration approach to take?",
            options: ["3-6 months", "6-12 months", "12+ months", "Not sure yet"]
          });
          setCurrentStep(1);
        } else if (option === "Stuck with current migration issues") {
          addMessage({
            type: 'bot',
            content: "I understand how frustrating migration challenges can be. What's your biggest concern right now?",
            options: ["Data mapping complexity", "Timeline delays", "Cost overruns", "Technical roadblocks"]
          });
          setCurrentStep(2);
        } else {
          addMessage({
            type: 'bot',
            content: "Perfect! Let me show you how QuillSwitch compares. What's most important to you?",
            options: ["Cost savings", "Time to completion", "Data accuracy", "Ease of use"]
          });
          setCurrentStep(3);
        }
        break;

      case 1:
        const weeks = option === "3-6 months" ? 16 : option === "6-12 months" ? 32 : 48;
        setUserData(prev => ({ ...prev, migrationWeeks: weeks }));
        addMessage({
          type: 'bot',
          content: "Are you planning to use external consultants for the migration?",
          options: ["Yes, hiring consultants", "No, doing it internally", "Combination of both"]
        });
        setCurrentStep(4);
        break;

      case 2:
        addMessage({
          type: 'bot',
          content: "Those are exactly the challenges QuillSwitch eliminates. Let me show you how we can help. What's your approximate budget for this migration?",
          options: ["Under $10k", "$10k-$25k", "$25k-$50k", "Over $50k"]
        });
        setCurrentStep(5);
        break;

      case 3:
        showComparisonResults(option);
        break;

      case 4:
        const consultantCost = option === "Yes, hiring consultants" ? 25000 : option === "Combination of both" ? 15000 : 0;
        const internalCost = option === "No, doing it internally" ? 16000 : option === "Combination of both" ? 8000 : 4000;
        setUserData(prev => ({ ...prev, consultantCost, internalStaffCost: internalCost }));
        showSavingsCalculation({ ...userData, consultantCost, internalStaffCost: internalCost });
        break;

      case 5:
        showSavingsCalculation(userData);
        break;
    }
  };

  const showComparisonResults = (priority: string) => {
    const benefits = {
      "Cost savings": "Save 60-80% on migration costs",
      "Time to completion": "Complete migrations 5x faster", 
      "Data accuracy": "99.9% accuracy with AI-powered mapping",
      "Ease of use": "No technical skills required"
    };

    addMessage({
      type: 'bot',
      content: `Excellent choice! QuillSwitch excels at ${priority.toLowerCase()}. Here's how we deliver: ${benefits[priority as keyof typeof benefits]}`
    });

    setTimeout(() => {
      showCTA("comparison");
    }, 1500);
  };

  const showSavingsCalculation = (data: UserData) => {
    const savings = calculateSavings(data);
    
    addMessage({
      type: 'bot',
      content: `Based on your situation, here's what QuillSwitch can save you:

💰 **Total Cost Savings: $${savings.totalSavings.toLocaleString()}**
⏱️ **Time Savings: ${savings.timeSavings} weeks faster**

**Cost Breakdown:**
• Traditional approach: $${savings.costBreakdown.traditional.toLocaleString()}
• QuillSwitch solution: $${savings.costBreakdown.quillswitch.toLocaleString()}
• Additional CRM savings: $${savings.costBreakdown.crmSavings.toLocaleString()}/year

These savings are immediate and guaranteed with our data protection promise.`
    });

    setTimeout(() => {
      showCTA("calculator");
    }, 2000);
  };

  const showCTA = (type: string) => {
    const ctaMessage = type === "calculator" 
      ? "Ready to claim these savings? Start your free migration analysis now - no commitment required, just clear insights into your potential savings."
      : "Want to see exactly how much you could save? Get your personalized migration analysis in just 2 minutes.";

    addMessage({
      type: 'bot',
      content: ctaMessage
    });

    addMessage({
      type: 'options',
      content: "What would you like to do next?",
      options: [
        "Get Free Savings Analysis",
        "Start My Migration Setup", 
        "View Detailed Pricing",
        "Schedule Expert Consultation"
      ]
    });
  };

  const handleCTAClick = (action: string) => {
    addMessage({ type: 'user', content: action });
    
    switch (action) {
      case "Get Free Savings Analysis":
        navigate("/pricing-estimator");
        break;
      case "Start My Migration Setup":
        if (user) {
          navigate("/app/setup");
        } else {
          navigate("/auth");
        }
        break;
      case "View Detailed Pricing":
        navigate("/pricing-estimator");
        break;
      case "Schedule Expert Consultation":
        navigate("/support");
        break;
    }
    setIsOpen(false);
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

            {messages.length > 1 && messages[messages.length - 1].type === 'bot' && messages[messages.length - 1].options && (
              <div className="space-y-2">
                {messages[messages.length - 1].options?.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left h-auto py-2 px-3 hover:bg-primary/5"
                    onClick={() => handleOptionClick(option, currentStep)}
                  >
                    <span className="text-sm">{option}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandingChatbot;