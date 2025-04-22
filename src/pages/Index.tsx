
import React from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CtaSection from "@/components/home/CtaSection";

const Index = () => {
  return (
    <>
      <div className="fixed inset-0 bg-slate-950" aria-hidden="true" />
      <div className="fixed inset-0 hero-gradient" aria-hidden="true" />
      <div className="relative z-10 min-h-screen">
        <Navbar />
        <main>
          <HeroSection />
          <FeaturesSection />
          <CtaSection />
        </main>
      </div>
    </>
  );
};

export default Index;
