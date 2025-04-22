
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 px-4 md:px-8 overflow-hidden">
      <div className="container max-w-6xl mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Seamless CRM Migration, 
            <span className="block text-brand-500 mt-2">
              Zero Complexity
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            QuillSwitch simplifies your CRM migration with intelligent data mapping, 
            validation, and transformation tools that save time and reduce errors.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button 
              size="lg" 
              onClick={() => navigate("/migrations/setup")}
              className="gap-2 bg-brand-600 hover:bg-brand-700"
            >
              Start Migration <ArrowRight size={16} />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/features")}
              className="gap-2 border-slate-700 text-white hover:bg-slate-800"
            >
              Learn More <CheckCircle size={16} />
            </Button>
          </div>
          
          <div className="flex justify-center items-center space-x-4 text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span>No Data Loss</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span>AI-Powered Mapping</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span>Enterprise Security</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
