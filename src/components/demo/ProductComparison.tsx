
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Info, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface ComparisonFeature {
  id: string;
  name: string;
  description: string;
  category: string;
  quillswitch: boolean | string;
  manual: boolean | string;
  consultants: boolean | string;
}

const features: ComparisonFeature[] = [
  // Migration Experience
  {
    id: "user-friendly",
    name: "User-Friendly Interface",
    description: "Can be operated by non-technical users without specialized training",
    category: "experience",
    quillswitch: true,
    manual: false,
    consultants: "Limited"
  },
  {
    id: "guided-flow",
    name: "Guided Migration Flow",
    description: "Step-by-step process with clear instructions at each stage",
    category: "experience",
    quillswitch: true,
    manual: false,
    consultants: true
  },
  {
    id: "time-to-completion",
    name: "Time to Completion",
    description: "Total time required from start to finish",
    category: "experience",
    quillswitch: "Hours to Days",
    manual: "Weeks to Months",
    consultants: "Weeks"
  },
  
  // Technical Features
  {
    id: "ai-mapping",
    name: "AI-Powered Field Mapping",
    description: "Automatic prediction of field mapping between CRMs",
    category: "technical",
    quillswitch: true,
    manual: false,
    consultants: false
  },
  {
    id: "data-cleaning",
    name: "Data Cleansing & Enrichment",
    description: "Identify and fix data quality issues during migration",
    category: "technical",
    quillswitch: true,
    manual: "Limited",
    consultants: "Limited"
  },
  {
    id: "test-migration",
    name: "Test Migration & Validation",
    description: "Run test migrations to validate configuration",
    category: "technical",
    quillswitch: true,
    manual: "Limited",
    consultants: true
  },
  {
    id: "incremental",
    name: "Incremental Migration",
    description: "Migrate data in phases with delta syncing",
    category: "technical",
    quillswitch: true,
    manual: false,
    consultants: "Limited"
  },
  {
    id: "custom-objects",
    name: "Custom Object Support",
    description: "Support for migrating custom CRM objects and fields",
    category: "technical",
    quillswitch: true,
    manual: "Limited",
    consultants: true
  },
  
  // Security & Reliability
  {
    id: "oauth",
    name: "OAuth Security",
    description: "Secure API access without storing credentials",
    category: "security",
    quillswitch: true,
    manual: false,
    consultants: "Varies"
  },
  {
    id: "encryption",
    name: "End-to-End Encryption",
    description: "Data encrypted during transfer and processing",
    category: "security",
    quillswitch: true,
    manual: false,
    consultants: "Varies"
  },
  {
    id: "error-recovery",
    name: "Automatic Error Recovery",
    description: "System handles errors and retries without manual intervention",
    category: "security",
    quillswitch: true,
    manual: false,
    consultants: "Limited"
  },
  {
    id: "audit-logs",
    name: "Comprehensive Audit Logs",
    description: "Detailed tracking of all migration actions",
    category: "security",
    quillswitch: true,
    manual: false,
    consultants: "Limited"
  },
  
  // Business Impact
  {
    id: "downtime",
    name: "Business Disruption",
    description: "Impact on normal business operations during migration",
    category: "impact",
    quillswitch: "Minimal",
    manual: "Significant",
    consultants: "Moderate"
  },
  {
    id: "reconnect",
    name: "Integration Reconnection",
    description: "Support for reconnecting integrations post-migration",
    category: "impact",
    quillswitch: true,
    manual: false,
    consultants: "Limited"
  },
  {
    id: "cost",
    name: "Total Cost",
    description: "Overall financial investment required",
    category: "impact",
    quillswitch: "Predictable",
    manual: "Low Direct / High Indirect",
    consultants: "High"
  },
  {
    id: "predictability",
    name: "Outcome Predictability",
    description: "Confidence in migration success and timeline",
    category: "impact",
    quillswitch: "High",
    manual: "Low",
    consultants: "Moderate"
  }
];

const renderValue = (value: boolean | string) => {
  if (typeof value === "boolean") {
    if (value) {
      return <Check className="h-5 w-5 text-green-500 mx-auto" />;
    } else {
      return <X className="h-5 w-5 text-red-500 mx-auto" />;
    }
  } else if (value === "Limited") {
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 hover:bg-amber-50 border-amber-200 dark:border-amber-700 text-xs px-2 py-1">
        Limited
      </Badge>
    );
  } else if (value === "Varies") {
    return (
      <Badge variant="outline" className="bg-slate-50 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400 hover:bg-slate-50 border-slate-200 dark:border-slate-700 text-xs px-2 py-1">
        Varies
      </Badge>
    );
  } else {
    return <span className="text-sm text-center font-medium">{value}</span>;
  }
};

const ProductComparison: React.FC = () => {
  const renderCategory = (category: string) => {
    const categoryFeatures = features.filter(f => f.category === category);
    const categoryTitle = 
      category === "experience" ? "Migration Experience" :
      category === "technical" ? "Technical Features" :
      category === "security" ? "Security & Reliability" :
      "Business Impact";
    
    return (
      <div className="mb-8">
        <div className="bg-slate-100 dark:bg-slate-800/80 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-lg text-center">{categoryTitle}</h3>
        </div>
        
        <div className="space-y-1">
          {categoryFeatures.map((feature) => (
            <div 
              key={feature.id}
              className="grid grid-cols-4 gap-4 py-4 px-4 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-md transition-colors"
            >
              <div className="flex items-center gap-2 min-h-[2.5rem]">
                <span className="font-medium text-sm">{feature.name}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help flex-shrink-0" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      {feature.description}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center justify-center min-h-[2.5rem]">
                {renderValue(feature.quillswitch)}
              </div>
              <div className="flex items-center justify-center min-h-[2.5rem]">
                {renderValue(feature.manual)}
              </div>
              <div className="flex items-center justify-center min-h-[2.5rem]">
                {renderValue(feature.consultants)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="border border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <div className="h-6 w-1 bg-gradient-to-b from-cyan-500 to-indigo-500 rounded-full"></div>
          Product Comparison
        </CardTitle>
        <CardDescription>
          See how QuillSwitch compares to traditional migration approaches
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-8">
          {/* Header Row */}
          <div className="bg-slate-100 dark:bg-slate-800/80 rounded-lg p-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="font-semibold text-left">Feature / Approach</div>
              <div className="text-center">
                <div className="font-semibold text-primary">QuillSwitch</div>
                <div className="text-xs text-muted-foreground mt-1">Automated Migration</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">DIY</div>
                <div className="text-xs text-muted-foreground mt-1">Manual Export/Import</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">Consultants</div>
                <div className="text-xs text-muted-foreground mt-1">Professional Services</div>
              </div>
            </div>
          </div>
          
          {/* Category Sections */}
          <div className="space-y-6">
            {renderCategory("experience")}
            {renderCategory("technical")}
            {renderCategory("security")}
            {renderCategory("impact")}
          </div>
          
          {/* Summary Section */}
          <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h4 className="font-semibold text-lg text-primary mb-3 text-center">QuillSwitch</h4>
                <p className="text-sm leading-relaxed">
                  Offers the best of both worlds - the speed and cost-effectiveness of automated solutions with the reliability and customization typically only found in consultant-led migrations. Ideal for businesses that want predictable results without expensive services.
                </p>
              </div>
              
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-3 text-center">DIY Manual Approach</h4>
                <p className="text-sm leading-relaxed">
                  While appearing cost-effective initially, manual migrations typically consume extensive internal resources, introduce significant business disruption, and carry high risks of data loss or corruption. Best only for the smallest, simplest migrations.
                </p>
              </div>
              
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-3 text-center">Migration Consultants</h4>
                <p className="text-sm leading-relaxed">
                  Traditional consulting offers expertise but at premium prices ($10,000-$50,000+) and typically requires weeks or months to complete. While reliable for complex enterprise migrations, they're often unnecessary and cost-prohibitive for most businesses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductComparison;
