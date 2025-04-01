
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Database, Loader, Repeat, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import ContentSection from "@/components/layout/ContentSection";
import FadeIn from "@/components/animations/FadeIn";
import SlideUp from "@/components/animations/SlideUp";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import FeatureCard from "@/components/ui-elements/FeatureCard";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [migrationStatus, setMigrationStatus] = useState<"idle" | "loading" | "success">("idle");
  
  const handleMigrationDemo = () => {
    if (migrationStatus !== "idle") return;
    
    setMigrationStatus("loading");
    
    // Simulate migration process
    setTimeout(() => {
      setMigrationStatus("success");
      toast({
        title: "Demo Migration Complete",
        description: "Your demonstration migration has completed successfully!",
      });
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
      <Navbar />
      
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn>
              <Badge className="mb-4 bg-brand-100 text-brand-700 hover:bg-brand-200 dark:bg-brand-900/30 dark:text-brand-400 dark:hover:bg-brand-900/40">
                CRM Migration Made Simple
              </Badge>
            </FadeIn>
            <FadeIn delay="100">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                Seamless CRM Migration, Simplified
              </h1>
            </FadeIn>
            <FadeIn delay="200">
              <p className="text-xl text-muted-foreground mb-8">
                Painlessly migrate from Salesforce to HubSpot, or between any other CRMs, 
                without expensive consultants or complicated processes.
              </p>
            </FadeIn>
            <FadeIn delay="300">
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/setup">
                    Start Migration <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/api-docs">
                    API Documentation
                  </Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      
      <ContentSection>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SlideUp delay="none">
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-brand-500" />}
              title="Automated Mapping"
              description="Smart field mapping between different CRM systems with AI assistance"
            />
          </SlideUp>
          <SlideUp delay="100">
            <FeatureCard
              icon={<Database className="h-10 w-10 text-brand-500" />}
              title="Full Data Transfer"
              description="Move contacts, deals, tickets, and custom objects between systems"
            />
          </SlideUp>
          <SlideUp delay="200">
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-brand-500" />}
              title="Data Security"
              description="Enterprise-grade security with encrypted data transfer and zero storage"
            />
          </SlideUp>
          <SlideUp delay="300">
            <FeatureCard
              icon={<Repeat className="h-10 w-10 text-brand-500" />}
              title="API-First Approach"
              description="Integrate with our APIs for programmatic migration of customer data"
            />
          </SlideUp>
        </div>
      </ContentSection>
      
      <ContentSection>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <FadeIn>
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Stop Overpaying for Your CRM
              </h2>
              <p className="text-muted-foreground mb-6">
                Salesforce and other enterprise CRMs are designed to be sticky, making it difficult 
                and expensive to switch. Our platform breaks those chains, letting you move to more 
                cost-effective solutions without the typical migration pain.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Save up to 70% on consultant fees</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Migrate in days instead of months</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Preserve all your valuable customer data</span>
                </li>
              </ul>
              <Button asChild className="gap-2">
                <Link to="/setup">
                  Start Your Migration <ArrowRight size={16} />
                </Link>
              </Button>
            </FadeIn>
          </div>
          <div>
            <SlideUp>
              <GlassPanel 
                className={`p-6 transition-all duration-300 ${migrationStatus !== "idle" ? "cursor-default" : "cursor-pointer hover:shadow-lg hover:scale-105"}`}
                onClick={handleMigrationDemo}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-100 text-red-600 p-2 rounded-full">
                        <Database size={20} />
                      </div>
                      <span className="font-medium">Salesforce</span>
                    </div>
                    <Badge variant="outline">Source</Badge>
                  </div>
                  <div className="flex items-center justify-center py-4">
                    {migrationStatus === "idle" && (
                      <Repeat className="h-8 w-8 text-brand-500" />
                    )}
                    {migrationStatus === "loading" && (
                      <Loader className="h-8 w-8 text-brand-500 animate-spin" />
                    )}
                    {migrationStatus === "success" && (
                      <Check className="h-8 w-8 text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 text-orange-600 p-2 rounded-full">
                        <Database size={20} />
                      </div>
                      <span className="font-medium">HubSpot</span>
                    </div>
                    <Badge variant="outline">Destination</Badge>
                  </div>
                </div>
                {migrationStatus === "idle" && (
                  <div className="text-center mt-4 text-sm text-muted-foreground">
                    Click to see a demo migration
                  </div>
                )}
                {migrationStatus === "loading" && (
                  <div className="text-center mt-4 text-sm text-brand-500 font-medium">
                    Migration in progress...
                  </div>
                )}
                {migrationStatus === "success" && (
                  <div className="text-center mt-4 text-sm text-green-500 font-medium">
                    Migration complete!
                  </div>
                )}
              </GlassPanel>
            </SlideUp>
          </div>
        </div>
      </ContentSection>
      
      <ContentSection className="pb-32">
        <div className="text-center max-w-2xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Ready to Switch CRM?
            </h2>
            <p className="text-muted-foreground mb-8">
              Start your CRM migration today and experience a seamless transition without the typical headaches and costs.
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link to="/setup">
                Start Your Migration <ArrowRight size={16} />
              </Link>
            </Button>
          </FadeIn>
        </div>
      </ContentSection>
    </div>
  );
};

export default Index;
