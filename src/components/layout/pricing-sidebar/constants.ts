
import { DollarSign, Calculator, GitCompare, FileText } from "lucide-react";
import type { PricingSection } from "./types";

export const pricingSections: PricingSection[] = [
  {
    id: "pricing-hero",
    title: "Pricing Overview",
    icon: DollarSign,
    action: () => {
      document.getElementById("pricing-hero")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    }
  },
  {
    id: "savings-calculator",
    title: "Savings Calculator",
    icon: Calculator,
    action: () => {
      document.getElementById("savings-calculator")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    }
  },
  {
    id: "pricing-tiers",
    title: "Pricing Tiers",
    icon: DollarSign,
    action: () => {
      document.getElementById("pricing-tiers")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    }
  },
  {
    id: "value-comparison",
    title: "Value Comparison",
    icon: GitCompare,
    action: () => {
      document.getElementById("value-comparison")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    }
  },
  {
    id: "features-included",
    title: "Features Included",
    icon: FileText,
    action: () => {
      document.getElementById("features-included")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    }
  }
];
