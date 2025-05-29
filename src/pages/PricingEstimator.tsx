
import React from "react";
import { Check, Sparkles, ArrowRight, Users, Building2, DollarSign } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import FadeIn from "@/components/animations/FadeIn";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import SlideUp from "@/components/animations/SlideUp";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { formatCurrency, formatNumber } from "@/components/pricing/pricingUtils";

const PricingEstimator: React.FC = () => {
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
            <div className="max-w-6xl mx-auto space-y-12">
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
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
                    Choose the plan that fits your business size. No surprises, no hidden fees, no hourly rates.
                  </p>
                </div>
              </FadeIn>

              {/* Pricing Tiers */}
              <SlideUp className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto" staggerChildren={true} staggerDelay={100}>
                <GlassPanel className="p-8 text-center space-y-6 hover:scale-105 transition-transform duration-300 border-primary/20">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Users className="h-6 w-6 text-primary" />
                      <h3 className="text-2xl font-bold">Essentials</h3>
                    </div>
                    <div className="text-4xl font-bold text-primary">{formatCurrency(1999)}</div>
                    <p className="text-muted-foreground">Up to {formatNumber(50000)} records</p>
                    <p className="text-sm text-muted-foreground/80">Perfect for Small Businesses</p>
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
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Standard integrations</span>
                    </div>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Ideal for small businesses migrating contacts, companies, deals, and their associated activities & notes
                  </p>
                </GlassPanel>
                
                <GlassPanel className="p-8 text-center space-y-6 hover:scale-105 transition-transform duration-300 border-primary/40 bg-gradient-to-br from-primary/5 to-primary/10 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                      Most Popular
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Building2 className="h-6 w-6 text-primary" />
                      <h3 className="text-2xl font-bold">Pro</h3>
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-primary">{formatCurrency(3999)}</div>
                    <p className="text-muted-foreground">Up to {formatNumber(200000)} records</p>
                    <p className="text-sm text-muted-foreground/80">Built for SMB & Mid-Market</p>
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
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Complex transformation support</span>
                    </div>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Perfect for larger SMBs and Mid-Market companies with extensive CRM history and complex data relationships
                  </p>
                </GlassPanel>
              </SlideUp>

              {/* Value Comparison */}
              <FadeIn delay="200">
                <Card className="p-8 border border-primary/10 bg-gradient-to-br from-background to-primary/5">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-semibold mb-2">Why Choose Fixed Pricing?</h3>
                      <p className="text-muted-foreground">Save thousands compared to traditional consultants</p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                      <div className="text-center space-y-2">
                        <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
                          <DollarSign className="h-6 w-6 text-red-500" />
                        </div>
                        <h4 className="font-medium">Traditional Consultants</h4>
                        <p className="text-sm text-muted-foreground">$8,000 - $60,000+</p>
                        <p className="text-xs text-red-600">Hourly rates, scope creep, hidden fees</p>
                      </div>
                      <div className="text-center space-y-2">
                        <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                          <Check className="h-6 w-6 text-green-500" />
                        </div>
                        <h4 className="font-medium">QuillSwitch</h4>
                        <p className="text-sm text-muted-foreground">{formatCurrency(1999)} - {formatCurrency(3999)}</p>
                        <p className="text-xs text-green-600">Fixed price, complete solution</p>
                      </div>
                      <div className="text-center space-y-2">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                          <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                        <h4 className="font-medium">Your Savings</h4>
                        <p className="text-sm text-muted-foreground">Up to 80% less</p>
                        <p className="text-xs text-primary">Predictable budgeting</p>
                      </div>
                    </div>
                  </div>
                </Card>
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

              {/* Features Included */}
              <FadeIn delay="400">
                <Card className="p-8 border border-primary/10 bg-gradient-to-br from-background to-primary/5">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-center">What's Included in Every Plan</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <div className="flex gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Complete Data Migration</p>
                          <p className="text-sm text-muted-foreground">All your CRM data transferred securely</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">AI-Powered Mapping</p>
                          <p className="text-sm text-muted-foreground">Smart field matching and data transformation</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Data Validation</p>
                          <p className="text-sm text-muted-foreground">Comprehensive quality checks and cleansing</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Rollback Protection</p>
                          <p className="text-sm text-muted-foreground">Safe migration with instant rollback option</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">24/7 Support</p>
                          <p className="text-sm text-muted-foreground">Expert assistance throughout the process</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Success Guarantee</p>
                          <p className="text-sm text-muted-foreground">We ensure your migration completes successfully</p>
                        </div>
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
