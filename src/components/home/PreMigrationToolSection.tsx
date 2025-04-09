
import React from "react";
import ContentSection from "@/components/layout/ContentSection";
import SlideUp from "@/components/animations/SlideUp";
import { Button } from "@/components/ui/button";
import { CheckCircle, Database, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PreMigrationToolSection = () => {
  const navigate = useNavigate();

  return (
    <ContentSection className="py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <SlideUp>
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Pre-Migration Assessment
            </h2>
            <p className="text-muted-foreground mb-6">
              Before diving into a full migration, analyze your CRM data to identify potential challenges and ensure a smooth transition.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Identify data quality issues before migration</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Get a detailed compatibility report between CRMs</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Receive recommended migration strategies based on your data</p>
              </div>
            </div>
            <Button onClick={() => navigate("/assessment-tool")} className="gap-2">
              Start Free Assessment <Database className="h-4 w-4" />
            </Button>
          </SlideUp>
        </div>
        <div>
          <SlideUp delay="200">
            <div className="rounded-lg bg-card p-6 border shadow-md overflow-hidden">
              <h3 className="text-lg font-semibold mb-4">Sample Assessment Report</h3>
              <div className="space-y-4">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start dark:bg-yellow-900/20 dark:border-yellow-800">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Duplicate Contacts</p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-400">145 potential duplicate contacts detected</p>
                  </div>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start dark:bg-red-900/20 dark:border-red-800">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-300">Missing Fields</p>
                    <p className="text-xs text-red-700 dark:text-red-400">32% of contacts missing email addresses</p>
                  </div>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-md flex items-start dark:bg-green-900/20 dark:border-green-800">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-300">Compatible Object Types</p>
                    <p className="text-xs text-green-700 dark:text-green-400">8/10 custom objects have direct mapping</p>
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

export default PreMigrationToolSection;
