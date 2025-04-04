
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Calculator, ArrowRight, FileText, Database, Code, ShieldCheck, RotateCcw, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import PricingEstimate from "./PricingEstimate";
import { PricingTier, calculatePricing } from "./pricingUtils";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import FadeIn from "@/components/animations/FadeIn";

const PricingCalculator: React.FC = () => {
  const [recordCount, setRecordCount] = useState<number>(5000);
  const [integrationCount, setIntegrationCount] = useState<number>(1);
  const [transformationCount, setTransformationCount] = useState<number>(10);
  const [includeValidation, setIncludeValidation] = useState<boolean>(false);
  const [includeRollback, setIncludeRollback] = useState<boolean>(false);
  const [tier, setTier] = useState<PricingTier>("quickStart");
  const [showEstimate, setShowEstimate] = useState<boolean>(false);

  const tierOptions = [
    { value: "quickStart", label: "Quick Start (SMB: 1,000-10,000 records)" },
    { value: "scaleUp", label: "Scale Up (Mid-Market: 10,000-50,000 records)" },
    { value: "fullPower", label: "Full Power (Enterprise: 50,000+ records)" },
  ];

  const handleCalculate = () => {
    setShowEstimate(true);
  };

  // Auto-adjust tier based on record count
  useEffect(() => {
    if (recordCount <= 10000) {
      setTier("quickStart");
    } else if (recordCount <= 50000) {
      setTier("scaleUp");
    } else {
      setTier("fullPower");
    }
  }, [recordCount]);

  const pricing = calculatePricing({
    recordCount,
    integrationCount,
    transformationCount,
    includeValidation,
    includeRollback,
    tier,
  });

  const handleSliderChange = (value: number[]) => {
    setRecordCount(value[0]);
  };

  const getRecordCountLabel = () => {
    if (recordCount >= 1000000) {
      return `${(recordCount / 1000000).toFixed(1)}M records`;
    } else if (recordCount >= 1000) {
      return `${(recordCount / 1000).toFixed(1)}K records`;
    }
    return `${recordCount} records`;
  };

  return (
    <TooltipProvider>
      <FadeIn>
        <GlassPanel className="p-8 border border-primary/10">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Record-Based Calculator</h2>
                <p className="text-sm text-muted-foreground mt-1">Calculate costs based on your data volume</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Database className="h-6 w-6 text-primary" />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="tier" className="text-base">Business Scale</Label>
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
                  <SelectTrigger className="w-full bg-background/80 backdrop-blur border-primary/20">
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

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="records" className="text-base">Number of Records</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-help">
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>The total number of data entries (contacts, accounts, opportunities, etc.) that will be migrated from your current system.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-sm rounded-md font-medium">
                    {getRecordCountLabel()}
                  </span>
                </div>
                
                <div className="pt-2 px-1">
                  <Slider
                    defaultValue={[recordCount]}
                    max={tier === "quickStart" ? 10000 : tier === "scaleUp" ? 50000 : 1000000}
                    min={tier === "quickStart" ? 1000 : tier === "scaleUp" ? 10001 : 50001}
                    step={tier === "fullPower" ? 10000 : 1000}
                    onValueChange={handleSliderChange}
                    className="my-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{tier === "quickStart" ? "1K" : tier === "scaleUp" ? "10K" : "50K"}</span>
                    <span>{tier === "quickStart" ? "10K" : tier === "scaleUp" ? "50K" : "1M+"}</span>
                  </div>
                </div>

                <Input
                  id="records"
                  type="number"
                  min={tier === "quickStart" ? 1000 : tier === "scaleUp" ? 10001 : 50001}
                  max={tier === "quickStart" ? 10000 : tier === "scaleUp" ? 50000 : 10000000}
                  value={recordCount}
                  onChange={(e) => setRecordCount(parseInt(e.target.value) || 0)}
                  className="mt-2 bg-background/80 backdrop-blur border-primary/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Label htmlFor="integrations" className="text-base">Integrations</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help">
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>The number of different systems or platforms that need to be connected for the migration (e.g., CRM, marketing automation, ERP).</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
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
                    <div className="flex items-center gap-1.5">
                      <Label htmlFor="transformations" className="text-base">Complex Transformations</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help">
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Advanced data modifications that need to be performed during migration, such as field merging, data normalization, or conditional logic transformations.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
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
    </TooltipProvider>
  );
};

export default PricingCalculator;
