
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
    <section className="py-32 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center space-y-10 text-white">
          <h2 className="text-4xl md:text-6xl font-black leading-tight">
            Ready to Switch Without<br />the Stress?
          </h2>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto font-medium">
            Join hundreds of teams who've made the smart move. Start your free assessment and see exactly how we'll migrate your data safely.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
            <Button 
              size="lg"
              onClick={handleGetStarted}
              className="px-12 py-7 text-lg bg-white text-slate-900 hover:bg-slate-100 font-black rounded-xl shadow-2xl hover:scale-105 transition-transform"
            >
              Start Free Migration <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate("/pricing")}
              className="px-12 py-7 text-lg border-2 border-white text-white hover:bg-white/10 font-black rounded-xl"
            >
              View Pricing
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 pt-8 text-base font-bold opacity-90">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>5 min setup</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCtaSection;
