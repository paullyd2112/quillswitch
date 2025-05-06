
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative py-32 px-4 md:px-8 overflow-hidden bg-modern-bg hero-gradient">
      <div className="container max-w-6xl mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-modern-text-primary">
            Seamless CRM Migration, 
            <span className="block text-modern-accent mt-2">
              Zero Complexity
            </span>
          </h1>
          
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            QuillSwitch simplifies your CRM migration with intelligent data mapping, 
            validation, and transformation tools that save time and reduce errors.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button size="lg" onClick={() => navigate("/migrations/setup")} className="gap-2 bg-modern-accent hover:bg-modern-accent/90 border-none">
              Start Migration <ArrowRight size={16} />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/features")} className="gap-2 border-modern-border text-modern-text-primary bg-modern-card hover:bg-modern-icon">
              View Features <CheckCircle size={16} />
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-modern-text-secondary">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-modern-accent" />
              <span>No Data Loss</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-modern-accent" />
              <span>AI-Powered Mapping</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-modern-accent" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-modern-accent" />
              <span>Gemini-Powered AI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
