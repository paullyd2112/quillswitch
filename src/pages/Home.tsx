
import React from "react";
import Navbar from "@/components/layout/Navbar";
import HomeHero from "@/components/home/HomeHero";
import HomeFeaturesSection from "@/components/home/HomeFeaturesSection";
import HomeHowItWorksSection from "@/components/home/HomeHowItWorksSection";
import HomeBenefitsSection from "@/components/home/HomeBenefitsSection";
import HomeCtaSection from "@/components/home/HomeCtaSection";
import Footer from "@/components/layout/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main>
        <HomeHero />
        <HomeFeaturesSection />
        <HomeHowItWorksSection />
        <HomeBenefitsSection />
        <HomeCtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
