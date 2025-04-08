
import React, { useState } from "react";
import ContentSection from "@/components/layout/ContentSection";
import { Button } from "@/components/ui/button";
import { Check, X, ChevronRight, ChevronDown } from "lucide-react";
import SlideUp from "@/components/animations/SlideUp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FeatureComparisonSection = () => {
  const [sourceCrm, setSourceCrm] = useState("salesforce");
  const [destinationCrm, setDestinationCrm] = useState("hubspot");
  const [expandedCategory, setExpandedCategory] = useState("contacts");
  
  const crms = [
    { id: "salesforce", name: "Salesforce" },
    { id: "hubspot", name: "HubSpot" },
    { id: "zoho", name: "Zoho CRM" },
    { id: "pipedrive", name: "Pipedrive" },
    { id: "dynamics", name: "Microsoft Dynamics" }
  ];
  
  const featureCategories = [
    {
      id: "contacts",
      name: "Contacts & Leads",
      features: [
        { name: "Contact Records", sourceCrm: true, destinationCrm: true },
        { name: "Lead Scoring", sourceCrm: true, destinationCrm: true },
        { name: "Custom Fields", sourceCrm: true, destinationCrm: true },
        { name: "Lead Assignment Rules", sourceCrm: true, destinationCrm: true },
        { name: "Contact Merging", sourceCrm: true, destinationCrm: true }
      ]
    },
    {
      id: "sales",
      name: "Sales Pipeline",
      features: [
        { name: "Opportunity Tracking", sourceCrm: true, destinationCrm: true },
        { name: "Sales Forecasting", sourceCrm: true, destinationCrm: false },
        { name: "Quote Generation", sourceCrm: true, destinationCrm: true },
        { name: "Product Catalog", sourceCrm: true, destinationCrm: true },
        { name: "Deal Rotting Rules", sourceCrm: false, destinationCrm: true }
      ]
    },
    {
      id: "automation",
      name: "Automation & Workflows",
      features: [
        { name: "Email Sequences", sourceCrm: true, destinationCrm: true },
        { name: "Task Automation", sourceCrm: true, destinationCrm: true },
        { name: "Deal Stage Automation", sourceCrm: false, destinationCrm: true },
        { name: "Approval Processes", sourceCrm: true, destinationCrm: false },
        { name: "Webhook Triggers", sourceCrm: true, destinationCrm: true }
      ]
    }
  ];
  
  const handleExpandCategory = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory("");
    } else {
      setExpandedCategory(categoryId);
    }
  };
  
  return (
    <ContentSection className="py-24">
      <div className="text-center max-w-xl mx-auto mb-12">
        <SlideUp>
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            CRM Feature Comparison
          </h2>
          <p className="text-muted-foreground">
            Compare features between CRM platforms to understand what will change after your migration.
          </p>
        </SlideUp>
      </div>
      
      <div className="space-y-8">
        <SlideUp delay={0.1}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Source CRM</label>
              <Select value={sourceCrm} onValueChange={setSourceCrm}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source CRM" />
                </SelectTrigger>
                <SelectContent>
                  {crms.map((crm) => (
                    <SelectItem key={crm.id} value={crm.id}>{crm.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Destination CRM</label>
              <Select value={destinationCrm} onValueChange={setDestinationCrm}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination CRM" />
                </SelectTrigger>
                <SelectContent>
                  {crms.map((crm) => (
                    <SelectItem key={crm.id} value={crm.id}>{crm.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </SlideUp>
        
        <SlideUp delay={0.2}>
          <div className="rounded-lg border shadow-sm overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-b grid grid-cols-7">
              <div className="col-span-3 font-medium">Feature</div>
              <div className="col-span-2 font-medium text-center">
                {crms.find(c => c.id === sourceCrm)?.name || "Source"}
              </div>
              <div className="col-span-2 font-medium text-center">
                {crms.find(c => c.id === destinationCrm)?.name || "Destination"}
              </div>
            </div>
            
            <div>
              {featureCategories.map((category) => (
                <div key={category.id} className="border-b last:border-b-0">
                  <button
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                    onClick={() => handleExpandCategory(category.id)}
                  >
                    <div className="font-medium">{category.name}</div>
                    {expandedCategory === category.id ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  
                  {expandedCategory === category.id && (
                    <div className="bg-white dark:bg-background">
                      {category.features.map((feature, index) => (
                        <div 
                          key={index} 
                          className={`grid grid-cols-7 py-3 px-4 ${
                            index !== category.features.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""
                          }`}
                        >
                          <div className="col-span-3 text-sm pl-4">{feature.name}</div>
                          <div className="col-span-2 flex items-center justify-center">
                            {feature.sourceCrm ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : (
                              <X className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                          <div className="col-span-2 flex items-center justify-center">
                            {feature.destinationCrm ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : (
                              <X className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </SlideUp>
        
        <div className="text-center mt-8">
          <Button variant="outline">View Detailed Comparison</Button>
        </div>
      </div>
    </ContentSection>
  );
};

export default FeatureComparisonSection;
