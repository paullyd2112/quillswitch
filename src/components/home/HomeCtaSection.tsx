
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
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
    <section className="py-24 px-6 bg-slate-900">
      <div className="container max-w-4xl mx-auto text-center">
        <div className="space-y-8 text-white">
          <h2 className="text-3xl md:text-5xl font-bold">
            Ready to switch?
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Start your free assessment. See exactly how we'll move your data safely.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4">
            <Button 
              size="lg"
              onClick={handleGetStarted}
              className="px-8 py-6 bg-white text-slate-900 hover:bg-slate-100 font-medium"
            >
              Start Free Migration
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate("/pricing")}
              className="px-8 py-6 border-slate-600 text-white hover:bg-slate-800 font-medium"
            >
              View Pricing
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-6 pt-6 text-sm text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <span>5 min setup</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCtaSection;
