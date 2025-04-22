
import React, { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CtaSection from "@/components/home/CtaSection";

const Index = () => {
  // Apply styles to ensure full-page dark background with no white gaps
  useEffect(() => {
    // Target both html and body to prevent any white space
    document.documentElement.style.backgroundColor = "#020617"; // slate-950
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100%";
    
    document.body.style.backgroundColor = "#020617"; // slate-950
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "auto";
    document.body.style.height = "100%";
    document.body.style.width = "100%";
    document.body.style.position = "fixed";
    
    return () => {
      document.documentElement.style.backgroundColor = "";
      document.documentElement.style.margin = "";
      document.documentElement.style.padding = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
      
      document.body.style.backgroundColor = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.body.style.width = "";
      document.body.style.position = "";
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 w-full overflow-x-hidden">
      <div className="fixed inset-0 hero-gradient" aria-hidden="true" />
      <div className="relative">
        <Navbar />
        <main className="pt-16">
          <HeroSection />
          <FeaturesSection />
          <CtaSection />
        </main>
      </div>
    </div>
  );
};

export default Index;
