
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";
import { Container } from "@/components/ui/container";

const CtaSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleGetStarted = () => {
    navigate(user ? "/migrations/setup" : "/auth");
  };
  
  return (
    <section className="py-20 bg-friendly-bg border-t border-friendly-border">
      <Container size="lg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-friendly-text-primary">
            Ready to transform your CRM migration?
          </h2>
          
          <p className="text-xl mb-10 text-friendly-text-secondary">
            Start your migration today and experience the difference with QuillSwitch's powerful features.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              onClick={handleGetStarted} 
              className="px-10 py-6 text-lg bg-friendly-accent hover:bg-friendly-accent/90"
            >
              Start Migration
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate("/features")}
              className="px-10 py-6 text-lg bg-friendly-card text-friendly-text-primary border-friendly-border hover:bg-friendly-card/80"
            >
              Learn More
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CtaSection;
