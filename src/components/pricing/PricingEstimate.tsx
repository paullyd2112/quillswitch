
import React from "react";
import { Card } from "@/components/ui/card";
import { PricingDetails, PricingInput, formatCurrency } from "./pricingUtils";
import { Check } from "lucide-react";

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
    <Card className="p-6 mt-8 border-2 border-green-100 bg-green-50/30">
      <h3 className="text-xl font-bold mb-6">Your Migration Cost Estimate</h3>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Pricing Tier:</span>
          <span className="font-medium">{getTierName()}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Records Cost:</span>
              <span>{formatCurrency(pricing.recordsCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transformations Cost:</span>
              <span>{formatCurrency(pricing.transformationsCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Integrations Cost:</span>
              <span>{formatCurrency(pricing.integrationsCost)}</span>
            </div>
            {inputs.includeValidation && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Validation Cost:</span>
                <span>{formatCurrency(pricing.validationCost)}</span>
              </div>
            )}
            {inputs.includeRollback && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rollback Cost:</span>
                <span>{formatCurrency(pricing.rollbackCost)}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="p-4 bg-green-100/50 rounded-lg">
              <div className="text-lg font-bold text-green-800 mb-2">Total Cost</div>
              <div className="text-2xl font-bold">{formatCurrency(pricing.total)}</div>
              <div className="text-sm text-muted-foreground mt-1">Compared to consultant cost: {getConsultantRange()}</div>
            </div>
            
            <div className="flex items-center gap-2 text-green-700">
              <Check className="h-5 w-5" />
              <span>Save approximately {savingsRange} compared to consultants</span>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Based on typical consultant rates for {getTierName()} tier projects
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium mb-2">About This Estimate</h4>
          <p className="text-sm text-muted-foreground">
            This is an estimate based on your inputs. The final price may vary depending on specific 
            requirements and complexity. Contact our sales team for a detailed quote tailored to your needs.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PricingEstimate;
