
import React from "react";
import { Helmet } from "react-helmet";
import HomeHero from "@/components/home/HomeHero";
import FeaturesSection from "@/components/home/FeaturesSection";
import CtaSection from "@/components/home/CtaSection";
import MigrationDemoSection from "@/components/home/MigrationDemoSection";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>QuillSwitch - Seamless CRM Migration</title>
        <meta 
          name="description" 
          content="Effortlessly migrate your CRM data with QuillSwitch's intelligent data mapping, validation, and transformation tools." 
        />
      </Helmet>
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <Navbar />
        <main>
          <HomeHero />
          <MigrationDemoSection />
          <FeaturesSection />
          <CtaSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Home;
