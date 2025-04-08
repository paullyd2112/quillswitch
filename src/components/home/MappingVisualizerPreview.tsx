
import React from "react";
import ContentSection from "@/components/layout/ContentSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";
import SlideUp from "@/components/animations/SlideUp";
import { useNavigate } from "react-router-dom";

const MappingVisualizerPreview = () => {
  const navigate = useNavigate();
  
  const sourceFields = [
    { name: "FirstName", highlighted: true },
    { name: "LastName", highlighted: true },
    { name: "Email", highlighted: true },
    { name: "Company", highlighted: true },
    { name: "Title", highlighted: true },
    { name: "Phone", highlighted: false },
    { name: "MobilePhone", highlighted: false },
    { name: "Department", highlighted: false }
  ];
  
  const destinationFields = [
    { name: "firstname", highlighted: true },
    { name: "lastname", highlighted: true },
    { name: "email", highlighted: true },
    { name: "company", highlighted: true },
    { name: "jobtitle", highlighted: true },
    { name: "phone", highlighted: false },
    { name: "mobilephone", highlighted: false },
    { name: "department", highlighted: false }
  ];
  
  return (
    <ContentSection className="py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <SlideUp>
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Interactive Field Mapping
            </h2>
            <p className="text-muted-foreground mb-6">
              Visualize and customize how your data maps between CRMs with our intuitive field mapping tool.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-500 mr-2"></div>
                <p className="text-sm">Drag and drop fields to create custom mappings</p>
              </div>
              <div className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-500 mr-2"></div>
                <p className="text-sm">Apply transformation rules to format data during migration</p>
              </div>
              <div className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-500 mr-2"></div>
                <p className="text-sm">Save and reuse field mapping templates</p>
              </div>
              <div className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-500 mr-2"></div>
                <p className="text-sm">AI-powered field mapping suggestions</p>
              </div>
            </div>
            
            <Button onClick={() => navigate("/mapping-tool")} className="gap-2">
              Try Field Mapping Tool <ExternalLink className="h-4 w-4" />
            </Button>
          </SlideUp>
        </div>
        
        <div>
          <SlideUp delay={0.2}>
            <div className="rounded-lg border shadow-md overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-b">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">Salesforce Fields</h3>
                    <p className="text-xs text-muted-foreground">Contact object</p>
                  </div>
                  <div className="text-right">
                    <h3 className="font-semibold text-sm">HubSpot Fields</h3>
                    <p className="text-xs text-muted-foreground">Contact object</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-white dark:bg-background">
                <div className="flex flex-col space-y-3">
                  {sourceFields.map((source, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div
                        className={`px-3 py-2 border rounded-md text-sm ${
                          source.highlighted
                            ? "bg-brand-50 border-brand-200 dark:bg-brand-900/20 dark:border-brand-800/50"
                            : "bg-slate-50 border-slate-200 dark:bg-slate-900/20 dark:border-slate-800/50"
                        }`}
                      >
                        {source.name}
                      </div>
                      
                      {source.highlighted && (
                        <div className="flex-1 px-4">
                          <div className="h-0.5 w-full bg-brand-200 dark:bg-brand-800/50 relative">
                            <ArrowRight className="absolute right-0 top-1/2 transform -translate-y-1/2 h-3 w-3 text-brand-500" />
                          </div>
                        </div>
                      )}
                      
                      {!source.highlighted && <div className="flex-1"></div>}
                      
                      <div
                        className={`px-3 py-2 border rounded-md text-sm ${
                          destinationFields[index].highlighted
                            ? "bg-brand-50 border-brand-200 dark:bg-brand-900/20 dark:border-brand-800/50"
                            : "bg-slate-50 border-slate-200 dark:bg-slate-900/20 dark:border-slate-800/50"
                        }`}
                      >
                        {destinationFields[index].name}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <div className="bg-slate-50 dark:bg-slate-900/20 p-3 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Transform Rule for "Title" → "jobtitle"</h4>
                    <div className="bg-white dark:bg-background border rounded p-2 font-mono text-xs">
                      value.trim().toLowerCase().replace(/\s+/g, "-")
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SlideUp>
        </div>
      </div>
    </ContentSection>
  );
};

export default MappingVisualizerPreview;
