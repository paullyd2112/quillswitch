
import React, { useState } from "react";
import PricingCalculator from "@/components/pricing/PricingCalculator";
import ContactPricingCalculator from "@/components/pricing/ContactPricingCalculator";
import { Calculator, DollarSign, Users, Check, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import FadeIn from "@/components/animations/FadeIn";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import SlideUp from "@/components/animations/SlideUp";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { formatCurrency, formatNumber } from "@/components/pricing/pricingUtils";

const PricingEstimator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("record-based");
  
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <TooltipProvider>
        <div className="min-h-screen bg-background relative overflow-hidden pt-20">
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute top-1/3 -left-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          </div>
          
          <div className="container relative mx-auto px-4 py-8 pt-16 z-10">
            <div className="max-w-4xl mx-auto space-y-12">
              {/* Hero section */}
              <FadeIn>
                <div className="text-center space-y-4">
                  <div className="inline-block mb-2">
                    <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                      Simple, Transparent Pricing
                    </span>
                  </div>
                  <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                    Fixed-Price Migration Plans
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
                    Choose the plan that fits your record count. No surprises, no hidden fees.
                  </p>
                </div>
              </FadeIn>

              {/* Pricing Tiers */}
              <SlideUp className="grid gap-6 md:grid-cols-2" staggerChildren={true} staggerDelay={100}>
                <GlassPanel className="p-8 text-center space-y-6 hover:scale-105 transition-transform duration-300 border-primary/20">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Essentials</h3>
                    <div className="text-4xl font-bold text-primary">{formatCurrency(1999)}</div>
                    <p className="text-muted-foreground">Up to {formatNumber(50000)} records</p>
                  </div>
                  <div className="space-y-3 text-left">
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
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Perfect for smaller SMBs migrating contacts, companies, deals, and their associated activities & notes
                  </p>
                </GlassPanel>
                
                <GlassPanel className="p-8 text-center space-y-6 hover:scale-105 transition-transform duration-300 border-primary/40 bg-gradient-to-br from-primary/5 to-primary/10">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <h3 className="text-2xl font-bold">Pro</h3>
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-primary">{formatCurrency(3999)}</div>
                    <p className="text-muted-foreground">Up to {formatNumber(200000)} records</p>
                  </div>
                  <div className="space-y-3 text-left">
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
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ideal for larger SMBs with extensive CRM history and complex data relationships
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

              {/* Record Definition */}
              <FadeIn delay="300">
                <Card className="p-8 border border-primary/10 bg-gradient-to-br from-background to-primary/5">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold">How We Count Records</h3>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Check className="h-4 w-4 text-green-500" />
                        </div>
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">Comprehensive Counting</span> — Every individual item being migrated counts as one record: contacts, companies, deals, activities, notes, attachments, custom objects, and more.
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Check className="h-4 w-4 text-green-500" />
                        </div>
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">Real Example</span> — A contact with 5 activities and 3 notes = 9 total records (1 contact + 5 activities + 3 notes).
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Check className="h-4 w-4 text-green-500" />
                        </div>
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">Transparent Estimates</span> — Our setup wizard shows you the estimated total record count before you commit to a plan.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </FadeIn>

              {/* Value proposition */}
              <FadeIn delay="400">
                <Card className="p-8 border border-primary/10 bg-gradient-to-br from-background to-primary/5">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold">Why Choose Our Fixed-Price Model?</h3>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Check className="h-4 w-4 text-green-500" />
                        </div>
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">Cost Efficiency</span> — Save up to 80% compared to traditional consultants who charge premium hourly rates regardless of complexity.
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Check className="h-4 w-4 text-green-500" />
                        </div>
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">Predictable Budgeting</span> — Know exactly what you'll pay upfront with no hidden fees or scope creep.
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Check className="h-4 w-4 text-green-500" />
                        </div>
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">Complete Solution</span> — Each plan includes everything you need: migration, mapping, validation, and support.
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
      <Footer />
    </div>
  );
};

export default PricingEstimator;
