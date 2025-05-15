
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

const HomeHero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <section className="relative pt-28 pb-20 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-xs font-medium rounded-full bg-primary/10 border border-primary/20 text-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Trusted by businesses for smooth CRM switches
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="block text-white">
              Switch CRM Systems
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Without The Headaches
            </span>
          </h1>
          
          <p className="mt-6 text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
            QuillSwitch helps you move all your customer data from one CRM to another - quickly, accurately, and without technical expertise. No more spreadsheets or data loss.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => navigate(user ? "/welcome" : "/auth")}
              className="gap-2 px-8 bg-primary text-white hover:bg-primary/90 shadow-glow-primary"
            >
              {user ? "Go to Dashboard" : "Start Free Migration"} <ArrowRight size={16} />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/demo")}
              className="gap-2 px-8 bg-transparent text-slate-200 border-slate-700 hover:bg-slate-800 hover:border-slate-600"
            >
              See How It Works
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-sm text-slate-400 mt-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <span>No Data Gets Lost</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <span>Smart Contact Matching</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <span>Bank-Level Security</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <span>No IT Team Needed</span>
            </div>
          </div>
        </div>
        
        {/* Stats section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { value: "97%", label: "Success Rate" },
            { value: "90%", label: "Faster Than Manual" },
            { value: "200k+", label: "Records Moved" }
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 rounded-lg bg-slate-900/50 border border-slate-800">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
