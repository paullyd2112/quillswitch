
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import ChatInterface from "@/components/gemini/ChatInterface";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const GeminiChat = () => {
  const { user } = useAuth();
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="container mx-auto py-6 px-4 max-w-6xl">
        <div className="mb-6 flex items-center">
          <Button
            variant="link"
            className="text-slate-300 hover:text-white mr-4 p-0"
            asChild
          >
            <Link to="/">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Gemini Advanced AI Chat</h1>
        </div>
        
        <div className="h-[calc(100vh-160px)]">
          <ChatInterface 
            systemPrompt="You are Gemini Advanced, a helpful and advanced AI assistant. Respond in a conversational style and provide detailed, accurate information."
            placeholder="Ask me anything..."
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default GeminiChat;
