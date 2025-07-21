
import React from "react";
import HomeHero from "@/components/home/HomeHero";
import BenefitsSection from "@/components/home/sections/BenefitsSection";
import SimplifiedHowItWorksSection from "@/components/home/sections/SimplifiedHowItWorksSection";
import HomeCtaSection from "@/components/home/HomeCtaSection";
import MinimalFooter from "@/components/layout/MinimalFooter";
import LazyLandingChatbot from "@/components/home/chatbot/LazyLandingChatbot";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <main>
        <HomeHero />
        <BenefitsSection />
        <SimplifiedHowItWorksSection />
        <HomeCtaSection />
      </main>
      <MinimalFooter />
      <LazyLandingChatbot />
    </div>
  );
};

export default Home;
