import React from "react";
import { Check, Sparkles, ArrowRight, Users, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SlideUp from "@/components/animations/SlideUp";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatNumber } from "./pricingUtils";

const PricingTiers: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = (tier: 'essentials' | 'pro') => {
    navigate(`/signup?tier=${tier}`);
  };

  return (
    <SlideUp className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto" staggerChildren={true} staggerDelay={100}>
      {/* Essentials Tier Card */}
      <GlassPanel className="p-8 text-center hover:scale-105 transition-transform duration-300 border-primary/20 flex flex-col h-full">
        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-bold">Essentials</h3>
          </div>
          <div className="text-4xl font-bold text-primary">{formatCurrency(1999)}</div>
          <p className="text-muted-foreground">Up to {formatNumber(250000)} records</p>
          <p className="text-sm text-muted-foreground/80">Perfect for Small Businesses</p>
        </div>

        {/* Features Section */}
        <div className="space-y-3 text-left my-6 flex-grow">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Complete data migration</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">AI-powered field mapping</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Data validation & cleansing</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">24/7 support during migration</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Standard integrations</span>
          </div>
        </div>

        {/* Action Section */}
        <div className="mt-auto">
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white"
            onClick={() => handleGetStarted('essentials')}
          >
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Ideal for small businesses migrating contacts, companies, deals, and their associated activities & notes
          </p>
        </div>
      </GlassPanel>
      
      {/* Pro Tier Card */}
      <GlassPanel className="p-8 text-center hover:scale-105 transition-transform duration-300 border-primary/40 bg-gradient-to-br from-primary/5 to-primary/10 relative flex flex-col h-full">
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
            Most Popular
          </span>
        </div>
        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Building2 className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-bold">Pro</h3>
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="text-4xl font-bold text-primary">{formatCurrency(4999)}</div>
          <p className="text-muted-foreground">Up to {formatNumber(500000)} records</p>
          <p className="text-sm text-muted-foreground/80">Built for SMB & Mid-Market</p>
        </div>

        {/* Features Section */}
        <div className="space-y-3 text-left my-6 flex-grow">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Everything in Essentials</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Priority processing</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Advanced custom object support</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Dedicated migration specialist</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Complex transformation support</span>
          </div>
        </div>
        
        {/* Action Section */}
        <div className="mt-auto">
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white"
            onClick={() => handleGetStarted('pro')}
          >
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Perfect for larger SMBs and Mid-Market companies with extensive CRM history and complex data relationships
          </p>
        </div>
      </GlassPanel>
    </SlideUp>
  );
};

export default PricingTiers;
