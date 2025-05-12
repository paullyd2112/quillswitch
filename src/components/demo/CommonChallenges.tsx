
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Check, X, ArrowRight } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  traditional: {
    approach: string;
    drawbacks: string[];
  };
  quillswitch: {
    solution: string;
    benefits: string[];
  };
}

const challenges: Challenge[] = [
  {
    id: "data-mapping",
    title: "Complex Field Mapping",
    description: "Different CRMs use different field names, formats, and data structures, making manual mapping tedious and error-prone.",
    traditional: {
      approach: "Manual spreadsheet mapping, requiring technical expertise and significant time investment.",
      drawbacks: [
        "Extremely time-consuming, often taking days or weeks",
        "High potential for human error and oversight",
        "Requires deep knowledge of both CRM systems",
        "Difficult to track changes and manage versions",
        "No way to efficiently validate mappings before migration"
      ]
    },
    quillswitch: {
      solution: "AI-powered automatic field mapping with high accuracy predictions and intuitive review interface.",
      benefits: [
        "Reduces mapping time from days to minutes",
        "Intelligent suggestions based on field names, types, and usage patterns",
        "Visual interface for reviewing and adjusting mappings",
        "Handles complex custom fields and object relationships",
        "Pre-migration validation ensures data integrity"
      ]
    }
  },
  {
    id: "data-quality",
    title: "Data Quality & Consistency",
    description: "Source CRM data often contains duplicates, inconsistencies, and format issues that need cleaning before migration.",
    traditional: {
      approach: "Manual data cleansing and transformation using spreadsheets or custom scripts.",
      drawbacks: [
        "Labor-intensive manual review process",
        "Requires technical skills to write transformation logic",
        "Difficult to handle complex data dependencies",
        "No systematic way to track changes or improvements",
        "Cannot effectively handle large volumes of data"
      ]
    },
    quillswitch: {
      solution: "Built-in data quality tools with automated detection and resolution of common issues.",
      benefits: [
        "Automatic duplicate detection and resolution",
        "Smart data transformation and standardization",
        "Format validation and correction for phone numbers, emails, etc.",
        "Data enrichment capabilities where needed",
        "Clear reporting on data quality improvements"
      ]
    }
  },
  {
    id: "testing",
    title: "Testing & Validation",
    description: "Ensuring the migration will work correctly before committing to the full process is critical but challenging.",
    traditional: {
      approach: "Limited sample testing with manual verification, often missing edge cases.",
      drawbacks: [
        "Sample size too small to catch all potential issues",
        "Manual verification is time-consuming and error-prone",
        "Difficult to simulate full migration conditions",
        "No systematic way to track and fix identified issues",
        "Often skipped or rushed due to time constraints"
      ]
    },
    quillswitch: {
      solution: "Comprehensive pre-flight check with automated validation and detailed issue reporting.",
      benefits: [
        "Automated test migration using representative data sample",
        "Systematic validation of all mappings and transformations",
        "Detailed reports highlighting potential issues before full migration",
        "Easy-to-understand issue resolution recommendations",
        "Confidence that the full migration will succeed"
      ]
    }
  },
  {
    id: "downtime",
    title: "Business Disruption & Downtime",
    description: "Traditional migrations often require significant system downtime, disrupting business operations.",
    traditional: {
      approach: "Full system freezes during migration with extended periods of limited CRM functionality.",
      drawbacks: [
        "Sales and service teams unable to access critical data",
        "Loss of productivity during migration windows",
        "Migrations often scheduled during nights/weekends",
        "Extended cutover periods with dual-system operation",
        "Stress on staff and potential for human error increases"
      ]
    },
    quillswitch: {
      solution: "Minimal-disruption approach with intelligent incremental migration and synchronization.",
      benefits: [
        "Significantly reduced or eliminated downtime",
        "Incremental migration with delta synchronization",
        "Business operations continue during migration",
        "Smooth cutover process with fallback options",
        "Reduced stress on team members and IT staff"
      ]
    }
  },
  {
    id: "integration",
    title: "Reconnecting Integrations",
    description: "After migration, reconnecting all the integrated tools and apps can be more complex than the migration itself.",
    traditional: {
      approach: "Manual reconfiguration of each integration, often requiring technical assistance.",
      drawbacks: [
        "Each integration must be manually reconfigured",
        "Documentation of existing integrations often incomplete",
        "Technical knowledge required for each integration platform",
        "High risk of missed connections and broken workflows",
        "Extended period of reduced functionality post-migration"
      ]
    },
    quillswitch: {
      solution: "Integration mapping and automatic reconnection of common tools and applications.",
      benefits: [
        "Automatic detection of existing integrations",
        "Guided reconnection process for each integration",
        "Pre-built connectors for commonly used tools",
        "Validation of integration functionality post-migration",
        "Significantly faster return to full operational capability"
      ]
    }
  }
];

const CommonChallenges: React.FC = () => {
  const [activeChallenge, setActiveChallenge] = useState<Challenge>(challenges[0]);

  return (
    <Card className="border border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <div className="h-6 w-1 bg-gradient-to-b from-orange-500 to-rose-500 rounded-full"></div>
          Common CRM Migration Challenges
        </CardTitle>
        <CardDescription>
          See how QuillSwitch solves the most difficult migration problems
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left sidebar - Challenge selection */}
          <div>
            <h3 className="text-lg font-medium mb-4">Migration Challenges</h3>
            
            <div className="space-y-2">
              {challenges.map(challenge => (
                <div
                  key={challenge.id}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    activeChallenge.id === challenge.id 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  }`}
                  onClick={() => setActiveChallenge(challenge)}
                >
                  <div className="font-medium">{challenge.title}</div>
                  <div className={`text-xs mt-1 ${
                    activeChallenge.id === challenge.id 
                      ? "text-primary-foreground/80" 
                      : "text-muted-foreground"
                  }`}>
                    {challenge.description.length > 70 
                      ? challenge.description.substring(0, 70) + "..." 
                      : challenge.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Main content area - Challenge details */}
          <div className="md:col-span-2">
            <Tabs defaultValue="comparison">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="comparison" className="flex-1">Side-by-Side Comparison</TabsTrigger>
                <TabsTrigger value="solution" className="flex-1">QuillSwitch Solution</TabsTrigger>
              </TabsList>
              
              <TabsContent value="comparison" className="space-y-6">
                <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-6">
                  <h3 className="font-medium text-xl mb-2">{activeChallenge.title}</h3>
                  <p className="text-muted-foreground">{activeChallenge.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Traditional Approach */}
                  <div>
                    <div className="flex items-center mb-3">
                      <div className="p-1 bg-red-100 dark:bg-red-900/30 rounded-full">
                        <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <h4 className="font-medium ml-2">Traditional Approach</h4>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                      <p className="text-sm mb-4">{activeChallenge.traditional.approach}</p>
                      
                      <Separator className="my-3" />
                      
                      <div className="text-sm font-medium mb-2">Drawbacks:</div>
                      <ul className="space-y-2">
                        {activeChallenge.traditional.drawbacks.map((drawback, index) => (
                          <li key={index} className="flex items-start">
                            <X className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{drawback}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* QuillSwitch Solution */}
                  <div>
                    <div className="flex items-center mb-3">
                      <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <h4 className="font-medium ml-2">QuillSwitch Solution</h4>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 border-l-4 border-l-green-500">
                      <p className="text-sm mb-4">{activeChallenge.quillswitch.solution}</p>
                      
                      <Separator className="my-3" />
                      
                      <div className="text-sm font-medium mb-2">Benefits:</div>
                      <ul className="space-y-2">
                        {activeChallenge.quillswitch.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className="bg-amber-100 dark:bg-amber-900/50 p-1 rounded-full mr-3 mt-1">
                      <ArrowRight className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <div className="font-medium text-amber-800 dark:text-amber-400">Business Impact:</div>
                      <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                        {activeChallenge.id === "data-mapping" && 
                          "By removing the manual field mapping burden, QuillSwitch saves businesses an average of 20-40 hours of specialist time per migration while reducing mapping errors by 95%."}
                        {activeChallenge.id === "data-quality" && 
                          "QuillSwitch's automated data quality tools typically improve overall CRM data quality by 15-30%, leading to better reporting accuracy and increased sales team productivity."}
                        {activeChallenge.id === "testing" && 
                          "Comprehensive validation reduces migration failures by 85%, eliminating costly rework and dramatically increasing confidence in the migration process."}
                        {activeChallenge.id === "downtime" && 
                          "By reducing or eliminating downtime, businesses avoid an average of $2,000-$5,000 per hour in lost productivity and opportunity costs during the migration process."}
                        {activeChallenge.id === "integration" && 
                          "Automated integration reconnection saves 5-15 hours per integration and reduces the post-migration 'productivity dip' period from weeks to days."}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="solution" className="space-y-6">
                <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-6">
                  <h3 className="font-medium text-xl mb-2">{activeChallenge.title}</h3>
                  <p className="text-muted-foreground mb-4">{activeChallenge.description}</p>
                  
                  <div className="flex items-center bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-3 rounded-lg">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                    <div className="font-medium text-green-700 dark:text-green-400">
                      The QuillSwitch Solution
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                  <p className="mb-6">{activeChallenge.quillswitch.solution}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Key Benefits</h4>
                      <ul className="space-y-3">
                        {activeChallenge.quillswitch.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Problems Solved</h4>
                      <ul className="space-y-3">
                        {activeChallenge.traditional.drawbacks.map((drawback, index) => (
                          <li key={index} className="flex items-start">
                            <X className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm line-through text-muted-foreground">{drawback}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-2/3">
                      <h4 className="font-medium mb-3">How It Works</h4>
                      <div className="space-y-3">
                        {activeChallenge.id === "data-mapping" && (
                          <>
                            <p className="text-sm">QuillSwitch's AI-powered mapping engine analyzes your source and target CRM schemas, field names, data types, and usage patterns to automatically suggest the most accurate field mappings.</p>
                            <p className="text-sm">The system learns from thousands of previous migrations to recognize common patterns between CRMs, even when field names differ significantly. Our visual interface allows you to review, adjust, and approve these mappings before migration.</p>
                          </>
                        )}
                        
                        {activeChallenge.id === "data-quality" && (
                          <>
                            <p className="text-sm">Our data quality engine automatically scans your source data to identify issues like duplicates, incomplete records, formatting problems, and data inconsistencies.</p>
                            <p className="text-sm">The system provides recommendations for cleaning and standardizing your data during migration, ensuring that only high-quality information is transferred to your new CRM. You control which cleaning operations to apply.</p>
                          </>
                        )}
                        
                        {activeChallenge.id === "testing" && (
                          <>
                            <p className="text-sm">QuillSwitch runs a complete test migration using a representative sample of your actual data. This test validates all field mappings, transformations, and data quality rules.</p>
                            <p className="text-sm">Any issues are identified, categorized by severity, and presented with clear recommendations for resolution. You can adjust your configuration and re-test until you're confident in the migration plan.</p>
                          </>
                        )}
                        
                        {activeChallenge.id === "downtime" && (
                          <>
                            <p className="text-sm">Our incremental migration approach allows you to pre-migrate historical data while your business continues to operate. When ready for cutover, only the delta (changes since pre-migration) needs to be transferred.</p>
                            <p className="text-sm">This reduces downtime from days to hours or even minutes. Our synchronization capabilities can also keep both systems in sync during a transition period if needed.</p>
                          </>
                        )}
                        
                        {activeChallenge.id === "integration" && (
                          <>
                            <p className="text-sm">QuillSwitch automatically detects integrations connected to your source CRM and creates a comprehensive map of your CRM ecosystem.</p>
                            <p className="text-sm">After migration, our guided reconnection process walks you through reestablishing each integration with your new CRM, with pre-built connectors for popular tools and clear instructions for custom integrations.</p>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="md:w-1/3 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Customer Impact</h4>
                      <div className="italic text-sm border-l-2 border-primary pl-3">
                        {activeChallenge.id === "data-mapping" && (
                          "\"What would have taken our team weeks of manual mapping work was completed in less than an hour with QuillSwitch. The AI suggestions were surprisingly accurate, even for our custom fields.\""
                        )}
                        {activeChallenge.id === "data-quality" && (
                          "\"We discovered our data was much messier than we thought. QuillSwitch not only migrated our CRM data but actually improved its quality in the process.\""
                        )}
                        {activeChallenge.id === "testing" && (
                          "\"The test migration caught several critical issues we would have missed. Being able to fix them before the real migration saved us from a potential disaster.\""
                        )}
                        {activeChallenge.id === "downtime" && (
                          "\"Our sales team didn't even notice the migration happened. They finished work Friday on the old CRM and started Monday on the new one without any downtime.\""
                        )}
                        {activeChallenge.id === "integration" && (
                          "\"Reconnecting our marketing automation, email tools, and analytics platforms was surprisingly painless. The guided process saved us at least a week of technical work.\""
                        )}
                      </div>
                      <div className="text-right text-xs text-muted-foreground mt-2">
                        — {activeChallenge.id === "data-mapping" ? "Sarah, RevOps Manager" : 
                           activeChallenge.id === "data-quality" ? "Michael, Sales Director" : 
                           activeChallenge.id === "testing" ? "Jennifer, CRM Administrator" : 
                           activeChallenge.id === "downtime" ? "David, VP of Sales" : 
                           "Alex, Marketing Operations"}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommonChallenges;
