
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";

const AuthButtons = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Button 
          onClick={() => navigate("/welcome")}
          variant="outline"
          className="hidden md:flex border-slate-700 hover:bg-slate-800 text-white"
        >
          Dashboard
        </Button>
        
        <Button 
          onClick={() => navigate("/migrations/setup")}
          className="bg-primary text-white hover:bg-primary/90"
        >
          New Migration
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
        <Link to="/auth/register">Get Started</Link>
      </Button>
    </div>
  );
};

export default AuthButtons;
