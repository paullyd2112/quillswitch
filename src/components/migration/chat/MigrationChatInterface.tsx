
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SendIcon, MessageSquare, Loader2, ArrowRight, CheckCircle, Sparkles, Bot, User } from "lucide-react";
import { ChatMessage, sendMessageToGemini } from "@/services/gemini/geminiService";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ExtractedMigrationInfo {
  sourceCrm?: string;
  destinationCrm?: string;
  dataTypes?: string[];
  recordCount?: string;
  timeline?: string;
  challenges?: string[];
  readyForSetup?: boolean;
}

interface MigrationChatInterfaceProps {
  onMigrationInfoExtracted?: (info: ExtractedMigrationInfo) => void;
  className?: string;
}

const MIGRATION_SYSTEM_PROMPT = `You are QuillSwitch's AI migration assistant. Help users plan their CRM migration by asking relevant questions and providing guidance.

Key areas to explore:
- Current CRM system (Salesforce, HubSpot, Pipedrive, etc.)
- Destination CRM system
- Types of data to migrate (contacts, deals, companies, etc.)
- Approximate record counts
- Timeline and urgency
- Specific challenges or concerns
- Integration requirements

Be conversational and helpful. When you have enough information, suggest they're ready to start the setup wizard. Format any structured information clearly.

Keep responses concise and actionable. Ask one or two questions at a time to avoid overwhelming the user.

When you determine the user has provided enough information to proceed (source CRM, destination CRM, and data types), inform them that you have enough information and ask if they're ready to begin the setup wizard.`;

const MigrationChatInterface = ({ onMigrationInfoExtracted, className = "" }: MigrationChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState<ExtractedMigrationInfo>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        role: "assistant",
        content: "Hello! I'm your QuillSwitch AI migration assistant. I'll help you plan your CRM migration by understanding your current setup and goals.\n\nTo get started, could you tell me:\n• What CRM system are you currently using?\n• What's prompting you to consider a migration?"
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const extractMigrationInfo = (conversationHistory: ChatMessage[]): ExtractedMigrationInfo => {
    const fullConversation = conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    
    const info: ExtractedMigrationInfo = {};
    
    // Simple keyword extraction (in a real implementation, you'd use AI for this)
    const text = fullConversation.toLowerCase();
    
    // Extract CRM mentions
    const crmSystems = ['salesforce', 'hubspot', 'pipedrive', 'zoho', 'freshworks', 'monday', 'airtable', 'copper'];
    for (const crm of crmSystems) {
      if (text.includes(crm)) {
        if (text.includes(`from ${crm}`) || text.includes(`currently ${crm}`) || text.includes(`using ${crm}`) || text.includes(`migrate from ${crm}`)) {
          info.sourceCrm = crm;
        }
        if (text.includes(`to ${crm}`) || text.includes(`switch to ${crm}`) || text.includes(`move to ${crm}`) || text.includes(`migrate to ${crm}`)) {
          info.destinationCrm = crm;
        }
      }
    }
    
    // Extract data types
    const dataTypes = [];
    if (text.includes('contact')) dataTypes.push('contacts');
    if (text.includes('deal') || text.includes('opportunity')) dataTypes.push('deals');
    if (text.includes('company') || text.includes('account')) dataTypes.push('companies');
    if (text.includes('task')) dataTypes.push('tasks');
    if (text.includes('note')) dataTypes.push('notes');
    
    if (dataTypes.length > 0) {
      info.dataTypes = dataTypes;
    }
    
    // Check if ready for setup - need source, destination, and at least one data type
    info.readyForSetup = !!(info.sourceCrm && info.destinationCrm && info.dataTypes?.length);
    
    return info;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    if (!user) {
      toast.error("Please sign in to use the migration chat");
      return;
    }

    const userMessage: ChatMessage = {
      role: "user",
      content: inputMessage.trim()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini(newMessages, MIGRATION_SYSTEM_PROMPT);

      if (response.error) {
        toast.error(response.error);
        return;
      }

      if (response.response) {
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: response.response
        };
        
        const updatedMessages = [...newMessages, assistantMessage];
        setMessages(updatedMessages);
        
        // Extract migration info from conversation
        const info = extractMigrationInfo(updatedMessages);
        setExtractedInfo(info);
        onMigrationInfoExtracted?.(info);
      }
    } catch (error) {
      console.error("Error in migration chat:", error);
      toast.error("Failed to get a response from the AI assistant");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartSetup = () => {
    toast.success("Starting setup wizard...");
    navigate('/app/setup');
  };

  return (
    <Card className={`flex flex-col h-full bg-slate-900/95 border-slate-700/50 backdrop-blur-xl shadow-2xl ${className}`}>
      <CardHeader className="pb-4 border-b border-slate-700/50">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-primary to-blue-500 rounded-lg shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">AI Migration Planner</h3>
            <p className="text-sm text-slate-400 font-normal">Powered by advanced AI technology</p>
          </div>
        </CardTitle>
        
        {/* Enhanced extracted info display */}
        {(extractedInfo.sourceCrm || extractedInfo.destinationCrm || extractedInfo.dataTypes?.length) && (
          <div className="flex flex-wrap gap-2 mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
            {extractedInfo.sourceCrm && (
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30">
                From: {extractedInfo.sourceCrm}
              </Badge>
            )}
            {extractedInfo.destinationCrm && (
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30">
                To: {extractedInfo.destinationCrm}
              </Badge>
            )}
            {extractedInfo.dataTypes?.map(type => (
              <Badge key={type} className="bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30">
                {type}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-96 custom-scrollbar">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === "user" 
                  ? "bg-gradient-to-r from-primary to-blue-500 shadow-lg" 
                  : "bg-gradient-to-r from-slate-700 to-slate-600 shadow-lg"
              }`}>
                {message.role === "user" ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>
              
              {/* Message bubble */}
              <div 
                className={`max-w-[85%] p-4 rounded-2xl shadow-lg ${
                  message.role === "user" 
                    ? "bg-gradient-to-r from-primary to-blue-500 text-white rounded-tr-md" 
                    : "bg-slate-800/80 text-slate-100 border border-slate-700/50 rounded-tl-md"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-slate-700 to-slate-600 flex items-center justify-center shadow-lg">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-slate-800/80 border border-slate-700/50 p-4 rounded-2xl rounded-tl-md flex items-center gap-3 shadow-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                </div>
                <span className="text-sm text-slate-300">AI is analyzing your requirements...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Ready for setup indicator */}
        {extractedInfo.readyForSetup && (
          <div className="mx-6 mb-4 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-green-300">Ready to Start Migration</p>
                  <p className="text-sm text-green-400">
                    I have all the information needed to configure your migration
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleStartSetup} 
                className="gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
              >
                Start Setup <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Enhanced input area */}
        <div className="p-6 border-t border-slate-700/50 bg-slate-900/50">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your migration needs, current CRM, or ask any questions..."
                className="min-h-[60px] resize-none bg-slate-800/80 border-slate-700/50 focus:border-primary/50 focus:ring-primary/20 text-slate-100 placeholder:text-slate-400 rounded-xl"
                disabled={isLoading}
              />
              <div className="absolute bottom-3 right-3 text-xs text-slate-500">
                Press Enter to send
              </div>
            </div>
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputMessage.trim() || isLoading}
              size="icon"
              className="h-[60px] w-[60px] bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white shadow-lg transition-all duration-200"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <SendIcon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MigrationChatInterface;
