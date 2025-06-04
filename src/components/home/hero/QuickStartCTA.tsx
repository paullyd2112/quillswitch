
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

const QuickStartCTA: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleQuickStart = () => {
    if (user) {
      // User is authenticated, go directly to the protected quick-start route
      navigate("/app/quick-start");
    } else {
      // User is not authenticated, redirect to auth with return URL
      navigate("/auth?mode=register&redirect=/app/quick-start");
    }
  };

  return (
    <Button 
      size="lg"
      onClick={handleQuickStart}
      className="gap-2 px-8 py-6 text-lg bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
    >
      <Zap className="h-5 w-5" />
      Start 5-Step Migration
      <ArrowRight className="h-5 w-5" />
    </Button>
  );
};

export default QuickStartCTA;
