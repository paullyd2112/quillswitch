
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
            Switch CRMs Without 
            <span className="block text-friendly-accent mt-2">
              The Headache
            </span>
          </h1>
          
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Finally, a CRM migration that doesn't disrupt your business. 
            Keep your team selling while we handle the switch.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button size="lg" onClick={() => navigate("/app/setup")} className="gap-2 bg-friendly-accent hover:bg-friendly-accent/90 border-none rounded-sm">
              Get My Free Assessment <ArrowRight size={16} />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/features")} className="gap-2 border-friendly-border text-friendly-text-primary bg-friendly-card hover:bg-friendly-card/80 rounded-sm">
              See How It Works <CheckCircle size={16} />
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-friendly-text-secondary">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-friendly-accent" />
              <span>Business Keeps Running</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-friendly-accent" />
              <span>Zero Data Loss</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-friendly-accent" />
              <span>No IT Headaches</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-friendly-accent" />
              <span>Done in Days, Not Months</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
