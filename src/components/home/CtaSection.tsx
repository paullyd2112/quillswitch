
import React from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { useNavigate } from "react-router-dom";

const CtaSection = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate("/migrations/setup");
  };
  
  return (
    <section className="py-20 bg-friendly-bg border-t border-friendly-border">
      <Container size="lg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-friendly-text-primary">
            Ready to switch CRMs without the stress?
          </h2>
          
          <p className="text-xl mb-10 text-friendly-text-secondary">
            Start your migration today and keep all your valuable customer data intact. No technical skills required.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button 
              size="lg" 
              onClick={handleGetStarted} 
              className="px-10 py-6 text-lg bg-friendly-accent hover:bg-friendly-accent/90"
            >
              Start Your Migration
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate("/features")}
              className="px-10 py-6 text-lg bg-friendly-card text-friendly-text-primary border-friendly-border hover:bg-friendly-card/80"
            >
              See How It Works
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CtaSection;
