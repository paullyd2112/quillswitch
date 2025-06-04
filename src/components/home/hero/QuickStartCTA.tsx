
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickStartCTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
      <Button 
        size="lg" 
        onClick={() => navigate("/app/migration-chat")}
        className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-8 py-3 text-lg font-semibold"
      >
        <MessageSquare className="h-5 w-5" />
        Chat with AI Assistant
        <ArrowRight className="h-5 w-5" />
      </Button>
      <Button 
        size="lg" 
        variant="outline"
        onClick={() => navigate("/app/setup")}
        className="gap-2 px-8 py-3 text-lg"
      >
        <Settings className="h-5 w-5" />
        Use Setup Wizard
      </Button>
    </div>
  );
};

export default QuickStartCTA;
