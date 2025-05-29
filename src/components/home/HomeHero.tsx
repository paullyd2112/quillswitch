
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Play, Shield, Zap, Clock } from "lucide-react";
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="container relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          {/* Trust badge with animation */}
          <div className="inline-flex items-center gap-3 px-6 py-3 mb-8 text-sm font-medium rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-300 backdrop-blur-sm">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span>Trusted by 500+ businesses for seamless CRM migrations</span>
          </div>
          
          {/* Main headline with enhanced typography */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-black tracking-tight">
              <span className="block text-white mb-4 leading-none">
                Switch CRM Systems
              </span>
              <span className="block bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent leading-none">
                Without The Stress
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-4xl mx-auto font-light">
              QuillSwitch makes CRM migration simple and stress-free. Transfer all your contacts, deals, 
              and company data accurately - <span className="text-white font-medium">no technical expertise required</span>, 
              <span className="text-white font-medium"> no data loss</span>, 
              <span className="text-white font-medium"> no downtime</span>.
            </p>
          </div>
          
          {/* Enhanced CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Button 
              size="lg"
              onClick={handleGetStarted}
              className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-2xl shadow-primary/25 border border-primary/20 transition-all duration-300 hover:shadow-primary/40 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                {user ? "Start New Migration" : "Start Free Migration"} 
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-blue-500/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/demo")}
              className="group bg-slate-800/50 text-slate-200 border-slate-600/50 hover:bg-slate-700/50 hover:border-slate-500/50 backdrop-blur-sm px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105"
            >
              <Play size={20} className="mr-2 group-hover:scale-110 transition-transform" /> 
              See How It Works
            </Button>
          </div>
          
          {/* Enhanced key benefits with icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto">
            {[
              { icon: Shield, text: "No Data Loss Guaranteed", color: "text-green-400" },
              { icon: Zap, text: "95% Faster Than Manual", color: "text-yellow-400" },
              { icon: CheckCircle2, text: "Enterprise Security", color: "text-blue-400" },
              { icon: Clock, text: "No Technical Skills Needed", color: "text-purple-400" }
            ].map((benefit, index) => (
              <div key={index} className="flex flex-col items-center gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300">
                <benefit.icon size={24} className={benefit.color} />
                <span className="text-sm font-medium text-slate-300 text-center leading-tight">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Enhanced stats section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-5xl mx-auto">
          {[
            { value: "500+", label: "Successful Migrations", gradient: "from-green-400 to-green-600" },
            { value: "99.9%", label: "Data Accuracy Rate", gradient: "from-blue-400 to-blue-600" },
            { value: "95%", label: "Time Savings", gradient: "from-purple-400 to-purple-600" },
            { value: "24/7", label: "Expert Support", gradient: "from-orange-400 to-orange-600" }
          ].map((stat, index) => (
            <div key={index} className="text-center p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300 group">
              <div className={`text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                {stat.value}
              </div>
              <div className="text-slate-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
