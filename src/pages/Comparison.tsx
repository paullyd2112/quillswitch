
import React from "react";
import { Helmet } from "react-helmet";
import ContentSection from "@/components/layout/ContentSection";
import ProductComparison from "@/components/demo/ProductComparison";
import { ComparisonSummary } from "@/components/demo/product-comparison/ComparisonSummary";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

const Comparison = () => {
  return (
    <>
      <Helmet>
        <title>How QuillSwitch Compares | QuillSwitch - CRM Migration Simplified</title>
        <meta name="description" content="See how QuillSwitch compares to traditional CRM migration approaches. Discover the advantages of automated, secure migration." />
      </Helmet>
      
      <div className="min-h-screen bg-slate-950">
        <main>
          {/* Hero Section */}
          <ContentSection className="pt-24 pb-16" centered>
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                How QuillSwitch Compares
              </h1>
              <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                See how QuillSwitch compares to traditional migration approaches and discover why 
                businesses choose our automated, secure solution over manual methods and expensive consultants.
              </p>
            </div>
          </ContentSection>

          <Separator className="bg-slate-800" />

          {/* Product Comparison Table */}
          <ContentSection className="py-16">
            <ProductComparison />
          </ContentSection>

          <Separator className="bg-slate-800" />

          {/* Migration Challenges Section */}
          <ContentSection className="py-16" centered>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
              Common Migration Challenges
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Left Column - Challenges */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-white mb-6">Migration Challenges</h3>
                
                <Card className="bg-blue-500/10 border-blue-500/20">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-blue-400 mb-3">Complex Field Mapping</h4>
                    <p className="text-slate-300">
                      Different CRMs use different field names, formats, and data structures, 
                      making manual mapping tedious and error-prone.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-slate-300 mb-3">Data Quality & Consistency</h4>
                    <p className="text-slate-400">
                      Source CRM data often contains duplicates, inconsistencies, and format 
                      issues that need to be resolved before migration.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-slate-300 mb-3">Testing & Validation</h4>
                    <p className="text-slate-400">
                      Ensuring the migration will work correctly before committing to the full 
                      migration is crucial but often overlooked.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-slate-300 mb-3">Business Disruption & Downtime</h4>
                    <p className="text-slate-400">
                      Traditional migrations often require significant system downtime, disrupting 
                      business operations and productivity.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-slate-300 mb-3">Reconnecting Integrations</h4>
                    <p className="text-slate-400">
                      After migration, reconnecting all the integrated tools and apps can be 
                      time-consuming and complex.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Side-by-Side Comparison */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-white mb-6">Side-by-Side Comparison</h3>
                
                <Card className="bg-slate-800/30 border-slate-700">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-white mb-4 text-center">Complex Field Mapping</h4>
                    <p className="text-slate-300 text-center mb-6">
                      Different CRMs use different field names, formats, and data structures, 
                      making manual mapping tedious and error-prone.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <XCircle className="h-5 w-5 text-red-500" />
                          <span className="font-medium text-red-400">Traditional Approach</span>
                        </div>
                        <p className="text-sm text-slate-300">
                          Manual spreadsheet mapping, requiring technical expertise and 
                          significant time investment.
                        </p>
                        <div className="mt-4 space-y-2 text-xs text-red-300">
                          <div className="flex items-center gap-2">
                            <XCircle className="h-3 w-3" />
                            <span>Extremely time-consuming, often taking days or weeks</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <XCircle className="h-3 w-3" />
                            <span>High potential for human error and oversight</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <XCircle className="h-3 w-3" />
                            <span>Requires deep knowledge of both CRM systems</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <XCircle className="h-3 w-3" />
                            <span>Difficult to track changes and manage versions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <XCircle className="h-3 w-3" />
                            <span>No way to efficiently validate mappings before migration</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="font-medium text-green-400">QuillSwitch Solution</span>
                        </div>
                        <p className="text-sm text-slate-300">
                          AI-powered automatic field mapping with high accuracy predictions and 
                          intuitive review interface.
                        </p>
                        <div className="mt-4 space-y-2 text-xs text-green-300">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3" />
                            <span>Reduces mapping time from days to minutes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3" />
                            <span>Intelligent suggestions based on field names, types, and usage patterns</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3" />
                            <span>Visual interface for reviewing and adjusting mappings</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3" />
                            <span>Handles complex custom fields and object relationships</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3" />
                            <span>Pre-migration validation ensures data integrity</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Business Impact Highlight */}
                <Card className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-orange-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertCircle className="h-6 w-6 text-orange-400" />
                      <h4 className="text-lg font-semibold text-orange-400">Business Impact:</h4>
                    </div>
                    <p className="text-slate-200 text-center">
                      By removing the manual field mapping burden, QuillSwitch saves businesses an 
                      average of <span className="font-semibold text-orange-400">20-40 hours</span> of specialist time per migration while reducing mapping 
                      errors by <span className="font-semibold text-orange-400">95%</span>.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </ContentSection>

          <Separator className="bg-slate-800" />

          {/* How It Works Section */}
          <ContentSection className="py-16">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">How It Works</h2>
                <p className="text-slate-300 text-lg mb-6">
                  QuillSwitch's AI-powered mapping engine analyzes your source and target CRM schemas, 
                  field names, data types, and usage patterns to automatically suggest the most 
                  accurate field mappings.
                </p>
                <p className="text-slate-300 mb-6">
                  The system learns from thousands of previous migrations to recognize common patterns 
                  between CRMs, even when field names differ significantly. Our visual interface 
                  allows you to review, adjust, and approve these mappings before migration.
                </p>
              </div>

              <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Customer Impact</h3>
                  <blockquote className="text-slate-300 italic text-lg">
                    "What would have taken our team weeks of manual mapping work was completed in less 
                    than an hour with QuillSwitch. The AI suggestions were surprisingly accurate, even for 
                    our custom fields."
                  </blockquote>
                  <footer className="mt-4 text-slate-400">
                    — Sarah, RevOps Manager
                  </footer>
                </div>
              </div>
            </div>
          </ContentSection>

          <Separator className="bg-slate-800" />

          {/* Summary Section */}
          <ContentSection className="py-16">
            <ComparisonSummary />
          </ContentSection>

          {/* CTA Section */}
          <ContentSection className="py-16 pb-24" centered>
            <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-2xl p-8 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience the Difference?</h2>
              <p className="text-slate-300 text-lg mb-6">
                See why businesses choose QuillSwitch over traditional migration methods.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/demo" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Try Interactive Demo
                </a>
                <a 
                  href="/auth" 
                  className="bg-transparent border border-blue-500 text-blue-400 hover:bg-blue-500/10 px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Start Free Migration
                </a>
              </div>
            </div>
          </ContentSection>
        </main>
      </div>
    </>
  );
};

export default Comparison;
