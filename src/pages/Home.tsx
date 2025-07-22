
import React from "react";
import HomeHero from "@/components/home/HomeHero";
import BenefitsSection from "@/components/home/sections/BenefitsSection";
import SimplifiedHowItWorksSection from "@/components/home/sections/SimplifiedHowItWorksSection";
import HomeCtaSection from "@/components/home/HomeCtaSection";
import MinimalFooter from "@/components/layout/MinimalFooter";

const Home = () => {
  return (
    <div className="min-h-screen w-full bg-slate-950">
      <main className="w-full">
        <HomeHero />
        <BenefitsSection />
        <SimplifiedHowItWorksSection />
        <HomeCtaSection />
      </main>
      <MinimalFooter />
    </div>
  );
};

export default Home;
