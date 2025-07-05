import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useChatbot } from "./hooks/useChatbot";
import { FloatingButton } from "./components/FloatingButton";
import { ChatHeader } from "./components/ChatHeader";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";

const LandingChatbot = () => {
  const {
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
  } = useChatbot();

  if (!isOpen) {
    return <FloatingButton onClick={() => setIsOpen(true)} />;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="border border-slate-200 dark:border-slate-800 shadow-xl">
        <ChatHeader onClose={() => setIsOpen(false)} />

        <CardContent className="pt-0">
          <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-thin">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onCTAClick={handleCTAClick}
              />
            ))}

            {messages.length > 0 && (
              <div ref={messagesEndRef} />
            )}
          </div>
          
          <ChatInput
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSendMessage={handleSendMessage}
            onKeyPress={handleKeyPress}
            inputRef={inputRef}
            disabled={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LandingChatbot;