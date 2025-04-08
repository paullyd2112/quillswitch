
import React, { useState } from "react";
import ContentSection from "@/components/layout/ContentSection";
import SlideUp from "@/components/animations/SlideUp";
import { Button } from "@/components/ui/button";
import { Calculator, DollarSign, Clock, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

const RoiCalculatorSection = () => {
  const [employees, setEmployees] = useState<number>(25);
  const [currentCost, setCurrentCost] = useState<number>(99);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(5);
  
  // Calculate ROI metrics
  const annualSavings = employees * (currentCost * 12 - 79 * 12);
  const productivityGain = employees * hoursPerWeek * 52 * 50; // $50/hour productivity value
  const implementationCost = 2000 + employees * 50;
  const totalSavings = annualSavings + productivityGain - implementationCost;
  const roi = Math.round((totalSavings / implementationCost) * 100);
  
  return (
    <ContentSection className="py-24 bg-slate-50/50 dark:bg-slate-900/20">
      <div className="text-center max-w-xl mx-auto mb-12">
        <SlideUp>
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Calculate Your Migration ROI
          </h2>
          <p className="text-muted-foreground">
            See the financial impact of switching CRMs with our interactive calculator. Estimate cost savings, productivity gains, and ROI.
          </p>
        </SlideUp>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <SlideUp delay={0.1}>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="employees">Number of CRM Users</Label>
                    <span className="text-sm text-muted-foreground">{employees}</span>
                  </div>
                  <Slider
                    id="employees"
                    min={5}
                    max={100}
                    step={1}
                    value={[employees]}
                    onValueChange={(value) => setEmployees(value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="current-cost">Current Monthly CRM Cost per User ($)</Label>
                    <span className="text-sm text-muted-foreground">${currentCost}</span>
                  </div>
                  <Slider
                    id="current-cost"
                    min={0}
                    max={200}
                    step={1}
                    value={[currentCost]}
                    onValueChange={(value) => setCurrentCost(value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="hours">Hours Spent Weekly on CRM Tasks per User</Label>
                    <span className="text-sm text-muted-foreground">{hoursPerWeek} hours</span>
                  </div>
                  <Slider
                    id="hours"
                    min={1}
                    max={20}
                    step={1}
                    value={[hoursPerWeek]}
                    onValueChange={(value) => setHoursPerWeek(value[0])}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </SlideUp>
        
        <SlideUp delay={0.2}>
          <Card className="bg-brand-50 dark:bg-brand-950/20 border-brand-100 dark:border-brand-800/30">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Your 3-Year ROI</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-brand-100 dark:border-brand-800/30">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                    <span className="font-medium">License Cost Savings</span>
                  </div>
                  <span className="font-semibold">${annualSavings.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between pb-2 border-b border-brand-100 dark:border-brand-800/30">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="font-medium">Productivity Gains</span>
                  </div>
                  <span className="font-semibold">${productivityGain.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between pb-2 border-b border-brand-100 dark:border-brand-800/30">
                  <div className="flex items-center">
                    <Calculator className="h-5 w-5 text-red-500 mr-2" />
                    <span className="font-medium">Implementation Cost</span>
                  </div>
                  <span className="font-semibold">-${implementationCost.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="font-medium">Total 3-Year Savings</span>
                  </div>
                  <span className="text-xl font-bold">${totalSavings.toLocaleString()}</span>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Return on Investment</p>
                  <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">{roi}%</p>
                </div>
                
                <Button className="w-full gap-2">
                  <Calculator className="h-4 w-4" />
                  Get Detailed ROI Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </SlideUp>
      </div>
    </ContentSection>
  );
};

export default RoiCalculatorSection;
