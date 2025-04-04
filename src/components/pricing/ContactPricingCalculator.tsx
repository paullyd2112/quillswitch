
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Calculator, ArrowRight, Users, Briefcase, ShieldCheck, RotateCcw, Code, FileText } from "lucide-react";
import PricingEstimate from "./PricingEstimate";
import { PricingTier, calculatePricing } from "./pricingUtils";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import FadeIn from "@/components/animations/FadeIn";

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

  // Auto-calculate estimated contacts when inputs change
  useEffect(() => {
    calculateEstimatedContacts();
  }, [userCount, averageContactsPerUser]);

  const handleCalculate = () => {
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

  const handleUserSliderChange = (value: number[]) => {
    setUserCount(value[0]);
  };

  const handleContactsPerUserSliderChange = (value: number[]) => {
    setAverageContactsPerUser(value[0]);
  };

  return (
    <FadeIn>
      <GlassPanel className="p-8 border border-primary/10">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">User-Based Calculator</h2>
              <p className="text-sm text-muted-foreground mt-1">Estimate based on your platform's users</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="userCount" className="text-base flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" /> Number of Users
                </Label>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-sm rounded-md font-medium">
                  {userCount.toLocaleString()} users
                </span>
              </div>
              <div className="pt-2 px-1">
                <Slider
                  defaultValue={[userCount]}
                  max={1000}
                  min={10}
                  step={10}
                  onValueChange={handleUserSliderChange}
                  className="my-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>10</span>
                  <span>1,000</span>
                </div>
              </div>
              
              <Input
                id="userCount"
                type="number"
                min={1}
                value={userCount}
                onChange={(e) => setUserCount(parseInt(e.target.value) || 0)}
                className="mt-2 bg-background/80 backdrop-blur border-primary/20"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Total number of customers using your platform
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="contactsPerUser" className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" /> Contacts per User
                </Label>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-sm rounded-md font-medium">
                  {averageContactsPerUser} contacts/user
                </span>
              </div>
              <div className="pt-2 px-1">
                <Slider
                  defaultValue={[averageContactsPerUser]}
                  max={500}
                  min={5}
                  step={5}
                  onValueChange={handleContactsPerUserSliderChange}
                  className="my-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5</span>
                  <span>500</span>
                </div>
              </div>
              
              <Input
                id="contactsPerUser"
                type="number"
                min={1}
                value={averageContactsPerUser}
                onChange={(e) => setAverageContactsPerUser(parseInt(e.target.value) || 0)}
                className="mt-2 bg-background/80 backdrop-blur border-primary/20"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Average number of contacts each user maintains
              </p>
            </div>

            <div className="bg-primary/5 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between">
              <div>
                <p className="text-sm font-medium">Estimated Total Records:</p>
                <p className="text-2xl font-bold">{recordCount.toLocaleString()}</p>
              </div>
              <div className="mt-2 sm:mt-0 bg-white/10 backdrop-blur-sm px-3 py-1 rounded text-sm">
                Tier: {tier === "quickStart" ? "Quick Start" : tier === "scaleUp" ? "Scale Up" : "Full Power"}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <Label htmlFor="integrations" className="text-base">Integrations</Label>
                </div>
                <Input
                  id="integrations"
                  type="number"
                  min={1}
                  value={integrationCount}
                  onChange={(e) => setIntegrationCount(parseInt(e.target.value) || 0)}
                  className="bg-background/80 backdrop-blur border-primary/20"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Code className="h-4 w-4 text-primary" />
                  </div>
                  <Label htmlFor="transformations" className="text-base">Complex Transformations</Label>
                </div>
                <Input
                  id="transformations"
                  type="number"
                  min={0}
                  value={transformationCount}
                  onChange={(e) => setTransformationCount(parseInt(e.target.value) || 0)}
                  className="bg-background/80 backdrop-blur border-primary/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="flex items-start gap-3 bg-background/40 p-3 rounded-lg hover:bg-background/60 transition-colors cursor-pointer" onClick={() => setIncludeValidation(!includeValidation)}>
                <Checkbox 
                  id="validation" 
                  checked={includeValidation}
                  onCheckedChange={(checked) => setIncludeValidation(checked === true)}
                  className="mt-1"
                />
                <div>
                  <Label htmlFor="validation" className="text-base flex items-center gap-2 cursor-pointer">
                    <ShieldCheck className="h-4 w-4 text-primary" /> Detailed Validation
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add comprehensive validation checks during migration
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-background/40 p-3 rounded-lg hover:bg-background/60 transition-colors cursor-pointer" onClick={() => setIncludeRollback(!includeRollback)}>
                <Checkbox 
                  id="rollback" 
                  checked={includeRollback}
                  onCheckedChange={(checked) => setIncludeRollback(checked === true)}
                  className="mt-1"
                />
                <div>
                  <Label htmlFor="rollback" className="text-base flex items-center gap-2 cursor-pointer">
                    <RotateCcw className="h-4 w-4 text-primary" /> Rollback Option
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enable instant rollback to previous state if needed
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={handleCalculate} className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 py-6">
              <Calculator className="mr-2 h-5 w-5" /> Calculate Estimate <ArrowRight className="ml-2 h-4 w-4" />
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
      </GlassPanel>
    </FadeIn>
  );
};

export default ContactPricingCalculator;
