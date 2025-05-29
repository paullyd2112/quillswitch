
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

const HomeCtaSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate("/app/setup");
    } else {
      navigate("/auth");
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-primary/5">
      <div className="container max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Make Your CRM Migration Effortless?
        </h2>
        <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
          Join hundreds of companies that have successfully migrated their CRM data with QuillSwitch. 
          Start your free migration today.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button 
            size="lg"
            onClick={handleGetStarted}
            className="gap-2 px-8 py-4 text-lg bg-primary text-white hover:bg-primary/90 shadow-glow-primary"
          >
            {user ? "Start New Migration" : "Start Free Migration"} <ArrowRight size={20} />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate("/demo")}
            className="gap-2 px-8 py-4 text-lg bg-transparent text-slate-200 border-slate-600 hover:bg-slate-800 hover:border-slate-500"
          >
            <Play size={20} /> Watch Demo
          </Button>
        </div>
        
        <div className="text-sm text-slate-500">
          No credit card required • Free test migration • Setup in under 5 minutes
        </div>
      </div>
    </section>
  );
};

export default HomeCtaSection;
