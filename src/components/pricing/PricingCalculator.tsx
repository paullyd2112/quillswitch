
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calculator } from "lucide-react";
import PricingEstimate from "./PricingEstimate";
import { PricingTier, calculatePricing } from "./pricingUtils";

const PricingCalculator: React.FC = () => {
  const [recordCount, setRecordCount] = useState<number>(5000);
  const [integrationCount, setIntegrationCount] = useState<number>(1);
  const [transformationCount, setTransformationCount] = useState<number>(10);
  const [includeValidation, setIncludeValidation] = useState<boolean>(false);
  const [includeRollback, setIncludeRollback] = useState<boolean>(false);
  const [tier, setTier] = useState<PricingTier>("quickStart");
  const [showEstimate, setShowEstimate] = useState<boolean>(false);

  const handleCalculate = () => {
    setShowEstimate(true);
  };

  const tierOptions = [
    { value: "quickStart", label: "Quick Start (SMB: 1,000-10,000 records)" },
    { value: "scaleUp", label: "Scale Up (Mid-Market: 10,000-50,000 records)" },
    { value: "fullPower", label: "Full Power (Enterprise: 50,000+ records)" },
  ];

  const pricing = calculatePricing({
    recordCount,
    integrationCount,
    transformationCount,
    includeValidation,
    includeRollback,
    tier,
  });

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Migration Cost Calculator</h2>
          <Calculator className="h-6 w-6 text-primary" />
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="tier">Select Your Business Scale</Label>
            <Select 
              value={tier} 
              onValueChange={(value: PricingTier) => {
                setTier(value);
                // Adjust record count based on tier selection
                if (value === "quickStart" && recordCount > 10000) setRecordCount(5000);
                if (value === "scaleUp" && (recordCount < 10000 || recordCount > 50000)) setRecordCount(30000);
                if (value === "fullPower" && recordCount < 50000) setRecordCount(100000);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your business scale" />
              </SelectTrigger>
              <SelectContent>
                {tierOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="records">Number of Records</Label>
            <Input
              id="records"
              type="number"
              min={1}
              value={recordCount}
              onChange={(e) => setRecordCount(parseInt(e.target.value) || 0)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="integrations">Number of Integrations</Label>
            <Input
              id="integrations"
              type="number"
              min={1}
              value={integrationCount}
              onChange={(e) => setIntegrationCount(parseInt(e.target.value) || 0)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="transformations">Complex Transformations</Label>
            <Input
              id="transformations"
              type="number"
              min={0}
              value={transformationCount}
              onChange={(e) => setTransformationCount(parseInt(e.target.value) || 0)}
              className="mt-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="validation" 
              checked={includeValidation}
              onCheckedChange={(checked) => setIncludeValidation(checked === true)}
            />
            <Label htmlFor="validation">Include Detailed Validation</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="rollback" 
              checked={includeRollback}
              onCheckedChange={(checked) => setIncludeRollback(checked === true)}
            />
            <Label htmlFor="rollback">Include Rollback Option</Label>
          </div>

          <Button onClick={handleCalculate} className="w-full">
            Calculate Estimate
          </Button>
        </div>

        {showEstimate && (
          <PricingEstimate 
            pricing={pricing} 
            inputs={{
              recordCount,
              integrationCount,
              transformationCount,
              includeValidation,
              includeRollback,
              tier
            }}
          />
        )}
      </div>
    </Card>
  );
};

export default PricingCalculator;
