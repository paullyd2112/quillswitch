
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
    <section className="py-20 bg-white">
      <Container size="lg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-300">
            Ready to transform your CRM migration?
          </h2>
          
          <p className="text-xl mb-10 text-gray-400">
            Start your migration today and experience the difference with QuillSwitch's powerful features.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              onClick={handleGetStarted} 
              className="px-10 py-6 text-lg bg-blue-600 hover:bg-blue-700"
            >
              Start Migration
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate("/features")}
              className="px-10 py-6 text-lg bg-slate-900 text-white border-slate-800 hover:bg-slate-800"
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
