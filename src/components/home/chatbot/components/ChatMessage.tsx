import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ChatMessage as ChatMessageType } from "../hooks/useChatbot";

interface ChatMessageProps {
  message: ChatMessageType;
  onCTAClick: (action: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onCTAClick }) => {
  return (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
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
                  onClick={() => onCTAClick(option)}
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
  );
};