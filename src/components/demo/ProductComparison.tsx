import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, HelpCircle } from "lucide-react";
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
    description: "Intuitive, guided interface operable by non-technical users without specialized training.",
    category: "experience",
    quillswitch: "✅ Intuitive & Guided",
    manual: "❌ Complex & Error-Prone",
    consultants: "Limited (Tool-Dependent)"
  },
  {
    id: "guided-flow",
    name: "Guided Migration Flow",
    description: "Step-by-step process with clear instructions at each stage to ensure a smooth migration.",
    category: "experience",
    quillswitch: "✅ Step-by-Step Guidance",
    manual: "❌ No Guidance / Ad-Hoc",
    consultants: "✅ Expert-Led"
  },
  {
    id: "time-to-completion",
    name: "Time to Completion",
    description: "Total time required from start to finish for the migration project.",
    category: "experience",
    quillswitch: "Hours to Days",
    manual: "Weeks to Months (High Risk)",
    consultants: "Weeks (Can Vary)"
  },
  
  // Data Security & Integrity
  {
    id: "data-encryption",
    name: "Data Encryption",
    description: "End-to-end encryption for data both in-transit and at-rest, using industry standards like AES-256.",
    category: "security",
    quillswitch: "✅ End-to-End Encryption",
    manual: "❌ User-Dependent",
    consultants: "Varies by Provider"
  },
  {
    id: "compliance-ready",
    name: "Compliance Ready",
    description: "Built to be compliant with regulations like GDPR & CCPA, with available SOC 2 certification.",
    category: "security",
    quillswitch: "✅ SOC 2, GDPR/CCPA Ready",
    manual: "❌ User's Responsibility",
    consultants: "Varies by Consultant"
  },
  {
    id: "access-control",
    name: "Secure Access & Audit Trails",
    description: "Granular control over who can access data, with detailed and immutable logs of all actions.",
    category: "security",
    quillswitch: "✅ Granular Control & Logs",
    manual: "❌ Manual & Limited",
    consultants: "Limited to Tools Used"
  },
  
  // Technical Features
  {
    id: "ai-mapping",
    name: "AI-Powered Field Mapping",
    description: "Intelligent, AI-driven mapping dramatically reduces manual configuration and human error.",
    category: "technical",
    quillswitch: "✅ Intelligent AI-Driven",
    manual: "❌ Fully Manual",
    consultants: "Manual/Expert-Driven"
  },
  {
    id: "data-cleaning",
    name: "Data Cleansing & Enrichment",
    description: "Automated data quality checks to identify and fix issues, ensuring data integrity.",
    category: "technical",
    quillswitch: "✅ Automated Quality Checks",
    manual: "Manual & Tedious",
    consultants: "Add-on Service"
  },
  {
    id: "test-migration",
    name: "Test Migration & Validation",
    description: "Conduct unlimited pre-migration tests to validate configuration and ensure a predictable outcome.",
    category: "technical",
    quillswitch: "✅ Pre-Migration Testing",
    manual: "Limited & Risky",
    consultants: "✅ Thorough Testing"
  },

  // Cost-Effectiveness & Value
  {
    id: "predictable-pricing",
    name: "Predictable Pricing",
    description: "Transparent, upfront pricing with no hidden fees or escalating costs.",
    category: "cost",
    quillswitch: "✅ Transparent & Upfront",
    manual: "❌ Hidden Costs (Time, Errors)",
    consultants: "Project-Based (Can Escalate)"
  },
  {
    id: "reduced-manual-effort",
    name: "Reduced Manual Effort",
    description: "Automation drastically reduces the time and internal resources required from your team.",
    category: "cost",
    quillswitch: "✅ Significant Time Savings",
    manual: "❌ High Manual Labor",
    consultants: "Requires Client Oversight"
  },
  {
    id: "ongoing-support",
    name: "Ongoing Support",
    description: "Access to dedicated technical support throughout the entire migration process.",
    category: "cost",
    quillswitch: "✅ Dedicated Support Included",
    manual: "❌ Self-Service Only",
    consultants: "Post-Project Retainer"
  }
];

const renderValue = (value: boolean | string) => {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="h-5 w-5 text-green-500 mx-auto" />
    ) : (
      <X className="h-5 w-5 text-red-500 mx-auto" />
    );
  }

  const strValue = String(value);

  if (strValue.startsWith('Limited')) {
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 hover:bg-amber-50 border-amber-200 dark:border-amber-700 py-0 px-2 h-5 whitespace-nowrap mx-auto">
        {strValue}
      </Badge>
    );
  } else if (strValue.startsWith('Varies')) {
    return (
      <Badge variant="outline" className="bg-slate-50 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400 hover:bg-slate-50 border-slate-200 dark:border-slate-700 py-0 px-2 h-5 whitespace-nowrap mx-auto">
        {strValue}
      </Badge>
    );
  }

  return <span className="text-sm">{strValue}</span>;
};

const ProductComparison: React.FC = () => {
  const renderCategory = (category: string) => {
    const categoryFeatures = features.filter(f => f.category === category);
    
    return (
      <div>
        <h3 className="font-medium mb-4 text-center py-2 bg-slate-100 dark:bg-slate-800/80 rounded-md">
          {category === "experience" ? "Migration Experience" :
           category === "security" ? "Data Security & Integrity" :
           category === "technical" ? "Technical Features" :
           "Cost-Effectiveness & Value"}
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody>
              {categoryFeatures.map((feature) => (
                <tr 
                  key={feature.id}
                  className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="py-3 px-4 align-middle">
                    <div className="flex items-center gap-1">
                      {feature.name}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            {feature.description}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center align-middle h-16">
                    {renderValue(feature.quillswitch)}
                  </td>
                  <td className="py-3 px-4 text-center align-middle h-16">
                    {renderValue(feature.manual)}
                  </td>
                  <td className="py-3 px-4 text-center align-middle h-16">
                    {renderValue(feature.consultants)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/80 border-b-2 border-slate-200 dark:border-slate-700">
                  <th className="py-3 px-4 text-left align-middle">Key Differentiator</th>
                  <th className="py-3 px-4 text-center align-middle">
                    <div className="font-medium text-primary">QuillSwitch: Automated & Secure</div>
                    <div className="text-xs font-normal text-muted-foreground">Automated Migration</div>
                  </th>
                  <th className="py-3 px-4 text-center align-middle">
                    <div className="font-medium">Manual Export/Import (DIY)</div>
                    <div className="text-xs font-normal text-muted-foreground">Manual Export/Import</div>
                  </th>
                  <th className="py-3 px-4 text-center align-middle">
                    <div className="font-medium">Consulting Services</div>
                    <div className="text-xs font-normal text-muted-foreground">Professional Services</div>
                  </th>
                </tr>
              </thead>
            </table>
          </div>
          
          <div className="space-y-8">
            {renderCategory("experience")}
            {renderCategory("security")}
            {renderCategory("technical")}
            {renderCategory("cost")}
          </div>
          
          <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h4 className="font-medium text-lg text-primary mb-2 text-center">QuillSwitch</h4>
                <p className="text-sm">
                  Offers the best of both worlds - the speed and cost-effectiveness of automated solutions with the reliability and customization typically only found in consultant-led migrations. Ideal for businesses that want predictable results without expensive services.
                </p>
              </div>
              
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <h4 className="font-medium text-lg mb-2 text-center">DIY Manual Approach</h4>
                <p className="text-sm">
                  While appearing cost-effective initially, manual migrations typically consume extensive internal resources, introduce significant business disruption, and carry high risks of data loss or corruption. Best only for the smallest, simplest migrations.
                </p>
              </div>
              
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <h4 className="font-medium text-lg mb-2 text-center">Migration Consultants</h4>
                <p className="text-sm">
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
