
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FadeIn from "@/components/animations/FadeIn";

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative py-36 md:py-44 px-6 md:px-8 overflow-hidden hero-gradient">
      <div className="absolute top-0 left-0 w-full h-full z-0 opacity-20">
        <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-tech-accent/10 filter blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-[10%] w-72 h-72 rounded-full bg-tech-highlight/10 filter blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="container max-w-6xl mx-auto text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold mb-6 tracking-tight">
              <span className="block text-tech-text-primary">
                Seamless CRM Migration
              </span>
              <span className="block text-tech-accent mt-2">
                Zero Complexity
              </span>
            </h1>
          </FadeIn>
          
          <FadeIn delay="100">
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-tech-text-secondary leading-relaxed">
              QuillSwitch simplifies your CRM migration with intelligent data mapping, 
              validation, and transformation tools.
            </p>
          </FadeIn>
          
          <FadeIn delay="200">
            <div className="flex flex-col sm:flex-row justify-center gap-5 mb-12">
              <Button 
                onClick={() => navigate("/migrations/setup")} 
                className="btn-tech-primary text-lg px-8 py-4 h-auto"
              >
                Start Migration <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/features")}
                className="btn-tech-secondary text-lg px-8 py-4 h-auto"
              >
                View Features <CheckCircle size={18} className="ml-2" />
              </Button>
            </div>
          </FadeIn>
          
          <FadeIn delay="300">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 text-tech-text-secondary">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-tech-highlight" />
                <span>No Data Loss</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-tech-highlight" />
                <span>AI-Powered Mapping</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-tech-highlight" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-tech-highlight" />
                <span>Gemini-Powered AI</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
