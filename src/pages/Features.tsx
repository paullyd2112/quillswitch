
import React, { useEffect } from "react";
import { useTheme } from "next-themes";
import Navbar from "@/components/layout/Navbar";
import FeaturesHero from "@/components/features/FeaturesHero";
import FeaturesCategories from "@/components/features/FeaturesCategories";
import FeatureDeepDive from "@/components/features/FeatureDeepDive";
import FeaturesCta from "@/components/features/FeaturesCta";

const Features = () => {
  const { setTheme } = useTheme();
  
  // Set theme to dark on component mount
  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-950 dark:from-background dark:to-slate-950/90">
      <Navbar />
      <FeaturesHero />
      <FeaturesCategories />
      <FeatureDeepDive />
      <FeaturesCta />
    </div>
  );
};

export default Features;
