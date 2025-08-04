
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const MigrationInfo = () => {
  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Affordable, Quality CRM Migrations
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Our platform simplifies CRM migrations with AI-powered data mapping, 
          field transformations, and validation - all at a fraction of the cost of custom solutions.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 bg-brand-100 dark:bg-brand-900/30 p-1.5 rounded-full">
            <ArrowRight className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h3 className="font-medium">Seamless Data Transfer</h3>
            <p className="text-muted-foreground">Transfer contacts, opportunities, accounts, and custom objects without data loss</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="mt-1 bg-brand-100 dark:bg-brand-900/30 p-1.5 rounded-full">
            <ArrowRight className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h3 className="font-medium">AI-Powered Field Mapping</h3>
            <p className="text-muted-foreground">Our advanced AI technology automatically matches fields between systems with 95%+ accuracy</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="mt-1 bg-brand-100 dark:bg-brand-900/30 p-1.5 rounded-full">
            <ArrowRight className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h3 className="font-medium">Cost-Effective Solution</h3>
            <p className="text-muted-foreground">Save up to 80% compared to manual migration or custom development costs</p>
          </div>
        </div>
      </div>
      
      <div className="pt-2">
        <Link to="/app/setup">
          <Button size="lg" className="font-medium">
            Start Your Migration <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MigrationInfo;
