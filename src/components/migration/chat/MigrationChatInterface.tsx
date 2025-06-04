
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SendIcon, MessageSquare, Loader2, ArrowRight, CheckCircle } from "lucide-react";
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
        content: "Hi! I'm your QuillSwitch migration assistant. I'll help you plan your CRM migration by understanding your current setup and goals.\n\nLet's start with: What CRM system are you currently using?"
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
    <Card className={`flex flex-col h-full ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Migration Planning Chat
        </CardTitle>
        
        {/* Show extracted info */}
        {(extractedInfo.sourceCrm || extractedInfo.destinationCrm || extractedInfo.dataTypes?.length) && (
          <div className="flex flex-wrap gap-2 mt-2">
            {extractedInfo.sourceCrm && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300">
                From: {extractedInfo.sourceCrm}
              </Badge>
            )}
            {extractedInfo.destinationCrm && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300">
                To: {extractedInfo.destinationCrm}
              </Badge>
            )}
            {extractedInfo.dataTypes?.map(type => (
              <Badge key={type} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300">
                {type}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === "user" 
                    ? "bg-primary text-primary-foreground rounded-tr-none" 
                    : "bg-muted text-muted-foreground rounded-tl-none"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-lg rounded-tl-none flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">AI is thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Ready for setup indicator */}
        {extractedInfo.readyForSetup && (
          <div className="p-4 bg-green-50 dark:bg-green-950/20 border-t border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-300">Ready to Start Setup</p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    I have enough information to begin your migration setup
                  </p>
                </div>
              </div>
              <Button onClick={handleStartSetup} className="gap-2">
                Start Setup <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your migration needs or ask any questions..."
              className="min-h-[60px] resize-none"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputMessage.trim() || isLoading}
              size="icon"
              className="mt-auto mb-0 h-[60px] w-[60px]"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendIcon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MigrationChatInterface;
