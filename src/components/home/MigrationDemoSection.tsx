
import React, { useState } from "react";
import { Database, Loader, Check, Repeat } from "lucide-react";
import ContentSection from "@/components/layout/ContentSection";
import FadeIn from "@/components/animations/FadeIn";
import SlideUp from "@/components/animations/SlideUp";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const MigrationDemoSection = () => {
  const [migrationStatus, setMigrationStatus] = useState<"idle" | "loading" | "success">("idle");
  
  const handleMigrationDemo = () => {
    if (migrationStatus === "loading") return;
    
    // If already completed, reset to idle and return
    if (migrationStatus === "success") {
      setMigrationStatus("idle");
      return;
    }
    
    // Start migration process
    setMigrationStatus("loading");
    
    // Simulate migration process
    setTimeout(() => {
      setMigrationStatus("success");
      toast({
        title: "Demo Migration Complete",
        description: "Your demonstration migration has completed successfully!",
      });
      
      // Remove the automatic reset timer
    }, 2000);
  };

  return (
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
              className={`p-6 transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-105`}
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
                  Migration complete! Click to run again.
                </div>
              )}
            </GlassPanel>
          </SlideUp>
        </div>
      </div>
    </ContentSection>
  );
};

export default MigrationDemoSection;
