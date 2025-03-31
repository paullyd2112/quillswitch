import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calculator, Users } from "lucide-react";
import PricingEstimate from "./PricingEstimate";
import { PricingTier, calculatePricing } from "./pricingUtils";

const ContactPricingCalculator: React.FC = () => {
  const [userCount, setUserCount] = useState<number>(100);
  const [averageContactsPerUser, setAverageContactsPerUser] = useState<number>(50);
  const [recordCount, setRecordCount] = useState<number>(5000);
  const [integrationCount, setIntegrationCount] = useState<number>(1);
  const [transformationCount, setTransformationCount] = useState<number>(10);
  const [includeValidation, setIncludeValidation] = useState<boolean>(false);
  const [includeRollback, setIncludeRollback] = useState<boolean>(false);
  const [tier, setTier] = useState<PricingTier>("quickStart");
  const [showEstimate, setShowEstimate] = useState<boolean>(false);

  const calculateEstimatedContacts = () => {
    const estimate = userCount * averageContactsPerUser;
    setRecordCount(estimate);
    
    // Adjust tier based on estimated contact count
    if (estimate <= 10000) {
      setTier("quickStart");
    } else if (estimate <= 50000) {
      setTier("scaleUp");
    } else {
      setTier("fullPower");
    }
  };

  const handleCalculate = () => {
    calculateEstimatedContacts();
    setShowEstimate(true);
  };

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
          <div>
            <h2 className="text-2xl font-bold">User-Based Calculator</h2>
            <p className="text-sm text-muted-foreground">Estimate migration costs based on your user count</p>
          </div>
          <Users className="h-6 w-6 text-primary" />
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="userCount">Number of users on your platform</Label>
            <Input
              id="userCount"
              type="number"
              min={1}
              value={userCount}
              onChange={(e) => setUserCount(parseInt(e.target.value) || 0)}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Total number of customers using your platform
            </p>
          </div>

          <div>
            <Label htmlFor="contactsPerUser">Average contacts per user</Label>
            <Input
              id="contactsPerUser"
              type="number"
              min={1}
              value={averageContactsPerUser}
              onChange={(e) => setAverageContactsPerUser(parseInt(e.target.value) || 0)}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Average number of contacts each user maintains
            </p>
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
            <Calculator className="mr-2 h-4 w-4" /> Calculate Estimate
          </Button>
        </div>

        {showEstimate && (
          <div className="mt-6">
            <div className="bg-muted/40 p-4 rounded-md text-center mb-6">
              <p className="text-sm">Estimated Records:</p>
              <p className="text-xl font-bold">{recordCount.toLocaleString()}</p>
            </div>
            
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
          </div>
        )}
      </div>
    </Card>
  );
};

export default ContactPricingCalculator;
