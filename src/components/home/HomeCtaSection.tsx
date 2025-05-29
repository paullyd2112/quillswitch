
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, CheckCircle } from "lucide-react";
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
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Enhanced background with multiple gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-blue-500/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="container max-w-5xl mx-auto text-center relative z-10">
        <div className="space-y-8">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tight leading-none">
            Ready to Make Your
            <span className="block bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              CRM Migration Effortless?
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join hundreds of companies that have successfully migrated their CRM data with QuillSwitch. 
            <span className="block mt-2 text-white font-medium">Start your free migration today.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Button 
              size="lg"
              onClick={handleGetStarted}
              className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-white font-semibold px-10 py-5 text-xl rounded-xl shadow-2xl shadow-primary/25 border border-primary/20 transition-all duration-300 hover:shadow-primary/40 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-3">
                {user ? "Start New Migration" : "Start Free Migration"} 
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-blue-500/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/demo")}
              className="group bg-slate-800/50 text-slate-200 border-slate-600/50 hover:bg-slate-700/50 hover:border-slate-500/50 backdrop-blur-sm px-10 py-5 text-xl rounded-xl transition-all duration-300 hover:scale-105"
            >
              <Play size={24} className="mr-3 group-hover:scale-110 transition-transform" /> 
              Watch Demo
            </Button>
          </div>
          
          {/* Enhanced trust indicators */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-slate-400 text-lg">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-slate-600 rounded-full"></div>
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-green-400" />
              <span>Free test migration</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-slate-600 rounded-full"></div>
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-green-400" />
              <span>Setup in under 5 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCtaSection;
