
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Shield, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import HeroBackground from "./hero/HeroBackground";

const HomeHero = () => {
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <HeroBackground />

      <div className="container relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
            <Shield className="h-4 w-4" />
            <span>100% Data Integrity Guaranteed</span>
          </div>
          
          {/* Main headline - cleaner, more modern */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.1] max-w-5xl mx-auto">
            Switch CRMs in Days,{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-primary">
              Not Months
            </span>
          </h1>
          
          {/* Subtitle - simpler, clearer */}
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Enterprise-grade CRM migration that keeps your business running. 
            No downtime, no data loss, no expensive consultants.
          </p>
          
          {/* CTA */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="text-base px-8 py-6 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
            >
              Start Free Migration <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/pricing")}
              className="text-base px-8 py-6 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg font-semibold"
            >
              View Pricing
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 pt-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Setup in 5 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Cancel anytime</span>
            </div>
          </div>

          {/* Stats section - cleaner design */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 max-w-5xl mx-auto">
            {[
              { value: "95%", label: "Faster Than Traditional Methods" },
              { value: "Zero", label: "Business Downtime" },
              { value: "$50K+", label: "Saved on Consultants" },
              { value: "100%", label: "Data Accuracy" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="group p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
