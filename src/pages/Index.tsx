
import React, { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CtaSection from "@/components/home/CtaSection";

const Index = () => {
  // Apply dark background to both html and body to ensure full coverage
  useEffect(() => {
    document.documentElement.style.backgroundColor = "#020617"; // slate-950
    document.body.style.backgroundColor = "#020617"; // slate-950
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    
    return () => {
      document.documentElement.style.backgroundColor = "";
      document.body.style.backgroundColor = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 relative overflow-x-hidden">
      <div className="absolute inset-0 hero-gradient" aria-hidden="true" />
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
