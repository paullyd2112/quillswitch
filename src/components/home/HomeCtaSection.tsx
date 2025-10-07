
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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
    <section className="py-24 px-4 bg-slate-900">
      <div className="container max-w-5xl mx-auto">
        <div className="relative p-12 md:p-16 rounded-3xl bg-gradient-to-br from-primary/10 via-blue-500/5 to-transparent border border-primary/20 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          
          <div className="relative text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Make the Switch?
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Join hundreds of businesses moving to better CRMs without the stress. 
              Start your free migration assessment today.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <Button 
                size="lg"
                onClick={handleGetStarted}
                className="px-10 py-6 text-base bg-white text-slate-900 hover:bg-slate-100 font-semibold rounded-lg shadow-xl"
              >
                Start Free Assessment <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/pricing")}
                className="px-10 py-6 text-base border-slate-700 text-white hover:bg-slate-800 font-semibold rounded-lg"
              >
                View Pricing
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-6 pt-6 text-sm text-slate-400">
              <span>✓ No credit card required</span>
              <span>✓ Setup in 5 minutes</span>
              <span>✓ Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCtaSection;
