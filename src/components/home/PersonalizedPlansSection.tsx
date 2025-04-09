
import React from "react";
import ContentSection from "@/components/layout/ContentSection";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";
import { Card, CardContent } from "@/components/ui/card";

const PersonalizedPlansSection = () => {
  const migrationPairs = [
    { source: "Salesforce", destination: "HubSpot" },
    { source: "Zoho", destination: "Pipedrive" },
    { source: "Microsoft Dynamics", destination: "Salesforce" },
    { source: "Freshsales", destination: "Zoho" }
  ];
  
  return (
    <ContentSection className="py-24 bg-slate-50/50 dark:bg-slate-900/20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Personalized Migration Plans
            </h2>
            <p className="text-muted-foreground mb-6">
              Get a customized migration strategy tailored to your specific CRM pair, data complexity, and business requirements.
            </p>
            
            <div className="space-y-4 mb-8">
              {migrationPairs.map((pair, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between p-4 rounded-none h-auto"
                      onClick={() => {}}
                    >
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-brand-500 mr-3" />
                        <span>{pair.source} to {pair.destination} Migration Guide</span>
                      </div>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <p>Don't see your CRM pair? We support 50+ CRM platforms.</p>
              <Button variant="link" size="sm" className="font-normal">
                View all
              </Button>
            </div>
          </FadeIn>
        </div>
        
        <div>
          <FadeIn delay="200">
            <div className="rounded-lg overflow-hidden border shadow-md">
              <div className="bg-brand-50 dark:bg-brand-900/20 p-4 border-b border-brand-100 dark:border-brand-800/30">
                <h3 className="font-semibold text-lg">Salesforce to HubSpot Migration Plan</h3>
                <p className="text-sm text-muted-foreground">Recommended migration strategy</p>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="space-y-2">
                  <h4 className="font-medium">1. Pre-Migration Tasks</h4>
                  <ul className="text-sm text-muted-foreground space-y-1.5 ml-5 list-disc">
                    <li>Clean up duplicate Salesforce contacts (est. 430 duplicates)</li>
                    <li>Review custom fields compatibility (14 fields need mapping)</li>
                    <li>Verify API access and permissions</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">2. Data Migration Order</h4>
                  <ul className="text-sm text-muted-foreground space-y-1.5 ml-5 list-disc">
                    <li>Users and Teams</li>
                    <li>Products and Price Books</li>
                    <li>Companies/Accounts</li>
                    <li>Contacts and Leads</li>
                    <li>Opportunities/Deals</li>
                    <li>Activities and Notes</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">3. Post-Migration Verification</h4>
                  <ul className="text-sm text-muted-foreground space-y-1.5 ml-5 list-disc">
                    <li>Data integrity verification procedures</li>
                    <li>User acceptance testing checklist</li>
                    <li>Performance monitoring plan</li>
                  </ul>
                </div>
                
                <Button className="w-full gap-2">
                  Get Complete Migration Plan <FileText className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </ContentSection>
  );
};

export default PersonalizedPlansSection;
