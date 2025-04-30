
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { SendIcon, SparklesIcon, Loader2 } from "lucide-react";
import { ChatMessage, sendMessageToGemini } from "@/services/gemini/geminiService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ChatInterfaceProps {
  systemPrompt?: string;
  placeholder?: string;
  className?: string;
}

const ChatInterface = ({
  systemPrompt = "You are a helpful AI assistant powered by Google's Gemini Advanced model. Provide accurate, detailed, and helpful responses.",
  placeholder = "Ask me anything...",
  className = ""
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    if (!user) {
      toast.error("Please sign in to use the AI chat feature");
      return;
    }

    const userMessage: ChatMessage = {
      role: "user",
      content: inputMessage.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini([...messages, userMessage], systemPrompt);

      if (response.error) {
        toast.error(response.error);
        return;
      }

      if (response.response) {
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: response.response
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Error in chat:", error);
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

  return (
    <Card className={`flex flex-col h-full overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 bg-slate-900 p-4 border-b border-slate-800">
        <SparklesIcon className="h-5 w-5 text-brand-500" />
        <h2 className="text-lg font-semibold text-white">Gemini Advanced Chat</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 p-6">
            <SparklesIcon className="h-12 w-12 mb-4 text-brand-500" />
            <h3 className="text-xl font-medium mb-2">Welcome to Gemini Advanced</h3>
            <p>Ask anything to start a conversation with Google's powerful AI model.</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === "user" 
                    ? "bg-brand-600 text-white rounded-tr-none" 
                    : "bg-slate-800 text-slate-200 rounded-tl-none"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <form 
          onSubmit={(e) => { 
            e.preventDefault();
            handleSendMessage();
          }} 
          className="flex gap-2"
        >
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="min-h-[60px] resize-none bg-slate-800 border-slate-700 focus-visible:ring-brand-500"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={!inputMessage.trim() || isLoading} 
            className="bg-brand-600 hover:bg-brand-700 text-white"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendIcon className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default ChatInterface;
