
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
            Trusted by 1,000+ companies for CRM migrations
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="block">Enterprise-Grade</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              CRM Migration
            </span>
            <span className="block mt-1">Without the Complexity</span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            QuillSwitch simplifies CRM transitions with intelligent data mapping, AI-powered field matching, and automated validation - delivering flawless migrations in half the time.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              size="lg"
              onClick={() => navigate(user ? "/welcome" : "/auth")}
              className="gap-2 px-8 bg-primary text-white hover:bg-primary/90 shadow-glow-primary"
            >
              Start Free Migration <ArrowRight size={16} />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/demo")}
              className="gap-2 px-8 bg-transparent text-slate-200 border-slate-700 hover:bg-slate-800 hover:border-slate-600"
            >
              Watch Demo
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <span>Zero Data Loss</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <span>AI-Powered Field Mapping</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <span>SOC 2 Type II Certified</span>
            </div>
          </div>
        </div>
        
        {/* Stats section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "97%", label: "Migration Success Rate" },
            { value: "50%", label: "Faster Than Manual Migration" },
            { value: "1M+", label: "Records Migrated" },
            { value: "5.0", label: "Customer Satisfaction" }
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
