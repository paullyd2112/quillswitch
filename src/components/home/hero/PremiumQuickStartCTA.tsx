
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

const PremiumQuickStartCTA = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleMainCta = () => {
    if (user) {
      navigate("/app/migration-chat");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="relative group">
      {/* Ambient glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
      
      {/* Main CTA button */}
      <Button 
        size="lg"
        onClick={handleMainCta}
        className="relative px-12 py-6 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/25 group"
      >
        <div className="flex items-center gap-3">
          <Sparkles size={20} className="group-hover:animate-spin transition-transform duration-300" />
          <span>{user ? "Start AI Migration" : "Experience QuillSwitch"}</span>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
        </div>
        
        {/* Inner glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Button>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-float opacity-60" />
        <div className="absolute bottom-0 right-1/4 w-0.5 h-0.5 bg-blue-300 rounded-full animate-float-delayed opacity-40" />
        <div className="absolute top-1/2 right-0 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse opacity-50" />
      </div>
    </div>
  );
};

export default PremiumQuickStartCTA;
