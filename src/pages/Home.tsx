
import React from "react";
import HomeHero from "@/components/home/HomeHero";
import ProblemSolutionSection from "@/components/home/sections/ProblemSolutionSection";
import EnhancedFeaturesSection from "@/components/home/sections/EnhancedFeaturesSection";
import HowItWorksSection from "@/components/home/sections/HowItWorksSection";
import HomeBenefitsSection from "@/components/home/HomeBenefitsSection";
import HomeCtaSection from "@/components/home/HomeCtaSection";
import Footer from "@/components/layout/Footer";
import FeaturesSection from "@/components/home/FeaturesSection";
import LandingChatbot from "@/components/home/chatbot/LandingChatbot";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <main>
        <HomeHero />
        <ProblemSolutionSection />
        <EnhancedFeaturesSection />
        <FeaturesSection />
        <HowItWorksSection />
        <HomeBenefitsSection />
        <HomeCtaSection />
      </main>
      <Footer />
      <LandingChatbot />
    </div>
  );
};

export default Home;
