
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";
import { ArrowRight } from "lucide-react";

const AuthButtons = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Button 
          onClick={() => navigate("/app/migrations")}
          variant="outline"
          className="hidden md:flex border-slate-700 hover:bg-slate-800 text-white"
        >
          Dashboard
        </Button>
        
        <Button 
          onClick={() => navigate("/app/setup")}
          className="bg-primary text-white hover:bg-primary/90 gap-2"
        >
          New Migration <ArrowRight size={16} />
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        asChild 
        className="hidden md:flex text-slate-300 hover:text-white hover:bg-slate-800"
      >
        <Link to="/auth">Login</Link>
      </Button>
      
      <Button 
        asChild 
        className="bg-primary text-white hover:bg-primary/90"
      >
        <Link to="/auth">Get Started</Link>
      </Button>
    </div>
  );
};

export default AuthButtons;
