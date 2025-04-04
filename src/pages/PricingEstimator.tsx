
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import PricingCalculator from "@/components/pricing/PricingCalculator";
import ContactPricingCalculator from "@/components/pricing/ContactPricingCalculator";
import { Calculator, DollarSign, Users, Check, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import FadeIn from "@/components/animations/FadeIn";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import SlideUp from "@/components/animations/SlideUp";
import { Card } from "@/components/ui/card";

const PricingEstimator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("record-based");
  
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        
        <Navbar />
        
        <div className="container relative mx-auto px-4 py-16 pt-28 z-10">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Hero section */}
            <FadeIn>
              <div className="text-center space-y-4">
                <div className="inline-block mb-2">
                  <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                    Transparent Pricing
                  </span>
                </div>
                <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                  Calculate Your Migration Costs
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
                  Get an accurate estimate based on your specific requirements with our interactive calculator
                </p>
              </div>
            </FadeIn>

            {/* Benefits cards */}
            <SlideUp className="grid gap-6 md:grid-cols-3" staggerChildren={true} staggerDelay={100}>
              <GlassPanel className="p-6 flex flex-col items-center text-center space-y-3 hover:scale-105 transition-transform duration-300">
                <div className="p-3 bg-primary/10 rounded-full">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Pay-As-You-Go</h3>
                <p className="text-sm text-muted-foreground">
                  Only pay for what you use with no hidden fees or long-term commitments
                </p>
              </GlassPanel>
              
              <GlassPanel className="p-6 flex flex-col items-center text-center space-y-3 hover:scale-105 transition-transform duration-300">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Transparent Pricing</h3>
                <p className="text-sm text-muted-foreground">
                  See exactly what you're paying for with detailed breakdowns and no surprises
                </p>
              </GlassPanel>
              
              <GlassPanel className="p-6 flex flex-col items-center text-center space-y-3 hover:scale-105 transition-transform duration-300">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">80%+ Cost Savings</h3>
                <p className="text-sm text-muted-foreground">
                  Save significantly compared to traditional consultants while maintaining quality
                </p>
              </GlassPanel>
            </SlideUp>

            {/* Calculator tabs */}
            <FadeIn delay="200">
              <Tabs
                defaultValue="record-based"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 mb-8 p-1 w-full max-w-md mx-auto bg-muted/80 backdrop-blur">
                  <TabsTrigger value="record-based" className="flex items-center gap-2 transition-all">
                    <Calculator className="h-4 w-4" />
                    <span>Record-Based</span>
                  </TabsTrigger>
                  <TabsTrigger value="user-based" className="flex items-center gap-2 transition-all">
                    <Users className="h-4 w-4" />
                    <span>User-Based</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="record-based" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <PricingCalculator />
                </TabsContent>
                <TabsContent value="user-based" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <ContactPricingCalculator />
                </TabsContent>
              </Tabs>
            </FadeIn>

            {/* Value proposition */}
            <FadeIn delay="300">
              <Card className="p-8 border border-primary/10 bg-gradient-to-br from-background to-primary/5">
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold">Why Choose Our Pricing Model?</h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">Cost Efficiency</span> — Save up to 80% compared to traditional consultants who charge premium rates regardless of project size.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">Scalability</span> — Our model scales with your needs, whether you're migrating thousands or millions of records.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">Customization</span> — Choose additional options like detailed validation and rollback capabilities to fit your exact requirements.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </FadeIn>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PricingEstimator;
