
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative py-32 px-4 md:px-8 overflow-hidden bg-friendly-bg hero-gradient">
      <div className="container max-w-6xl mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-friendly-text-primary">
            Seamless CRM Migration, 
            <span className="block text-friendly-accent mt-2">
              Zero Complexity
            </span>
          </h1>
          
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            QuillSwitch simplifies your CRM migration with intelligent data mapping, 
            validation, and transformation tools that save time and reduce errors.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button size="lg" onClick={() => navigate("/migrations/setup")} className="gap-2 bg-friendly-accent hover:bg-friendly-accent/90 border-none rounded-full">
              Start Migration <ArrowRight size={16} />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/features")} className="gap-2 border-friendly-border text-friendly-text-primary bg-white hover:bg-gray-50 rounded-full">
              View Features <CheckCircle size={16} />
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-friendly-text-secondary">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-friendly-accent" />
              <span>No Data Loss</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-friendly-accent" />
              <span>AI-Powered Mapping</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-friendly-accent" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-friendly-accent" />
              <span>Gemini-Powered AI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
