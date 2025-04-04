
import React from "react";
import { Card } from "@/components/ui/card";
import { PricingDetails, PricingInput, formatCurrency } from "./pricingUtils";
import { Check, ArrowUpRight, TrendingUp, ShieldCheck, RotateCcw, Database, FileText, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import SlideUp from "@/components/animations/SlideUp";

interface PricingEstimateProps {
  pricing: PricingDetails;
  inputs: PricingInput;
}

const PricingEstimate: React.FC<PricingEstimateProps> = ({ pricing, inputs }) => {
  const getTierName = () => {
    switch (inputs.tier) {
      case "quickStart": return "Quick Start (SMB)";
      case "scaleUp": return "Scale Up (Mid-Market)";
      case "fullPower": return "Full Power (Enterprise)";
      default: return "Custom";
    }
  };
  
  // Get the minimum consultant cost for comparison based on tier
  const getConsultantRange = () => {
    switch (inputs.tier) {
      case "quickStart": return "$8,000 - $15,000+";
      case "scaleUp": return "$25,000 - $60,000+";
      case "fullPower": return "$80,000 - $250,000+";
      default: return "Significantly higher";
    }
  };

  // Get minimum and maximum consultant costs for savings calculation
  const getConsultantCosts = () => {
    switch (inputs.tier) {
      case "quickStart": return { min: 8000, max: 15000 };
      case "scaleUp": return { min: 25000, max: 60000 };
      case "fullPower": return { min: 80000, max: 250000 };
      default: return { min: 10000, max: 20000 };
    }
  };

  const consultantCosts = getConsultantCosts();
  const savingsLow = consultantCosts.min;
  const savingsHigh = consultantCosts.max;
  
  // Calculate percentage savings range
  const savingsPercentageLow = Math.round(((savingsLow - pricing.total) / savingsLow) * 100);
  const savingsPercentageHigh = Math.round(((savingsHigh - pricing.total) / savingsHigh) * 100);
  
  // Format the savings range as a string
  const savingsRange = savingsPercentageLow === savingsPercentageHigh 
    ? `${savingsPercentageLow}%` 
    : `${savingsPercentageLow}-${savingsPercentageHigh}%`;

  return (
    <SlideUp className="mt-10">
      <Card className="border-2 border-green-400/30 bg-gradient-to-br from-green-50/30 to-green-100/20 overflow-hidden">
        <div className="p-8 relative">
          {/* Top sparkle decoration */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-400/20 rounded-full blur-2xl"></div>
          
          <div className="relative">
            <div className="inline-block mb-6">
              <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Your Custom Estimate
              </span>
            </div>
            
            <h3 className="text-2xl font-bold mb-6">Migration Cost Breakdown</h3>
            
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between px-4 py-3 bg-white/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Database className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">Records</span>
                  </div>
                  <span className="font-semibold">{formatCurrency(pricing.recordsCost)}</span>
                </div>
                
                <div className="flex items-center justify-between px-4 py-3 bg-white/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Code className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">Transformations</span>
                  </div>
                  <span className="font-semibold">{formatCurrency(pricing.transformationsCost)}</span>
                </div>
                
                <div className="flex items-center justify-between px-4 py-3 bg-white/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">Integrations</span>
                  </div>
                  <span className="font-semibold">{formatCurrency(pricing.integrationsCost)}</span>
                </div>
                
                {inputs.includeValidation && (
                  <div className="flex items-center justify-between px-4 py-3 bg-white/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">Validation</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(pricing.validationCost)}</span>
                  </div>
                )}
                
                {inputs.includeRollback && (
                  <div className="flex items-center justify-between px-4 py-3 bg-white/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <RotateCcw className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">Rollback</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(pricing.rollbackCost)}</span>
                  </div>
                )}
              </div>
              
              <div>
                <div className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg border border-green-500/20 mb-4">
                  <div className="mb-4">
                    <p className="text-green-800 text-sm font-medium">Total Migration Cost</p>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-green-800">{formatCurrency(pricing.total)}</span>
                      <span className="ml-2 text-sm text-green-700/70">with {getTierName()}</span>
                    </div>
                  </div>
                  
                  <div className="py-3 px-4 bg-white/50 rounded-lg flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Traditional Consultant</span>
                    </div>
                    <span className="text-sm">{getConsultantRange()}</span>
                  </div>
                  
                  <div className="mt-4 px-2">
                    <div className="flex items-center gap-2 text-green-700">
                      <div className="p-1 bg-green-100 rounded-full">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-sm font-medium">Save {savingsRange}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">
                    Contact Sales <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-200/30">
                  <h4 className="font-medium mb-2 text-blue-900">About This Estimate</h4>
                  <p className="text-sm text-blue-800/70">
                    This is an estimate based on your inputs. The final price may vary depending on specific 
                    requirements and complexity. Contact our sales team for a detailed quote tailored to your needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </SlideUp>
  );
};

export default PricingEstimate;
