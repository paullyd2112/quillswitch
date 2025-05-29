
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

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
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
      </div>

      <div className="container relative z-10 max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium rounded-full bg-primary/10 border border-primary/20 text-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Trusted by 500+ businesses for seamless CRM migrations
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            <span className="block text-white mb-2">
              Switch CRM Systems
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Without The Stress
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-4xl mx-auto mb-12">
            QuillSwitch makes CRM migration simple and stress-free. Transfer all your contacts, deals, 
            and company data accurately - no technical expertise required, no data loss, no downtime.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
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
              <Play size={20} /> See How It Works
            </Button>
          </div>
          
          {/* Key benefits */}
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-green-500" />
              <span className="text-lg">No Data Loss Guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-green-500" />
              <span className="text-lg">95% Faster Than Manual</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-green-500" />
              <span className="text-lg">Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-green-500" />
              <span className="text-lg">No Technical Skills Needed</span>
            </div>
          </div>
        </div>
        
        {/* Stats section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {[
            { value: "500+", label: "Successful Migrations" },
            { value: "99.9%", label: "Data Accuracy Rate" },
            { value: "95%", label: "Time Savings" },
            { value: "24/7", label: "Expert Support" }
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 rounded-lg bg-slate-900/50 border border-slate-800">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
