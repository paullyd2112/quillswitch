
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";

const WizardHeader: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="border-b dark:border-slate-800/70">
      <div className="container flex items-center justify-between h-20 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary/70 flex items-center justify-center text-white font-bold">Q</div>
          <span className="font-bold text-lg">QuillSwitch</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to={user ? "/app/migrations" : "/"}>
              Cancel
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link to="/app/connect">
              Connection Hub
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WizardHeader;
