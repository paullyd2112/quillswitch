import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  onInputChange,
  onSendMessage,
  onKeyPress,
  inputRef,
  disabled = false
}) => {
  return (
    <div className="border-t border-slate-200 dark:border-slate-700 pt-3 mt-3">
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="What's on your mind?"
          className="flex-1 text-sm"
          disabled={disabled}
        />
        <Button
          onClick={onSendMessage}
          disabled={!inputValue.trim() || disabled}
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
  );
};