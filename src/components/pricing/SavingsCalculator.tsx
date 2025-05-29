
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, DollarSign, Clock, Users, ArrowRight, Calculator } from "lucide-react";
import { formatCurrency } from "./pricingUtils";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface CalculatorInputs {
  migrationWeeks: number;
  useConsultant: boolean;
  consultantRate: number;
  consultantHours: number;
  internalStaff: number;
  monthlyCrmCost: number;
}

interface SavingsResults {
  manualConsultantCost: number;
  manualInternalStaffCost: number;
  wastedCrmSubscriptionCost: number;
  totalManualCost: number;
  quillSwitchCost: number;
  totalSavings: number;
  weeksSaved: number;
  hoursSaved: number;
}

const SavingsCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    migrationWeeks: 12,
    useConsultant: true,
    consultantRate: 125,
    consultantHours: 100,
    internalStaff: 2,
    monthlyCrmCost: 1000,
  });

  const [showAssumptions, setShowAssumptions] = useState(false);

  const results = useMemo((): SavingsResults => {
    const INTERNAL_HOURLY_RATE = 75;
    const HOURS_PER_WEEK_PER_PERSON = 10;
    const QUILLSWITCH_PLAN_COST = 1999;
    const QUILLSWITCH_INTERNAL_HOURS = 8;
    const WEEKS_PER_MONTH = 4.33;
    const QUILLSWITCH_TIMELINE_WEEKS = 0.2; // 1 day = 0.2 weeks

    const manualConsultantCost = inputs.useConsultant 
      ? inputs.consultantRate * inputs.consultantHours 
      : 0;

    const manualInternalStaffTotalHours = inputs.internalStaff * (inputs.migrationWeeks * HOURS_PER_WEEK_PER_PERSON);
    const manualInternalStaffCost = manualInternalStaffTotalHours * INTERNAL_HOURLY_RATE;

    const wastedCrmSubscriptionCost = (inputs.monthlyCrmCost / WEEKS_PER_MONTH) * 
      (inputs.migrationWeeks - QUILLSWITCH_TIMELINE_WEEKS);

    const totalManualCost = manualConsultantCost + manualInternalStaffCost + wastedCrmSubscriptionCost;

    const quillSwitchInternalCost = QUILLSWITCH_INTERNAL_HOURS * INTERNAL_HOURLY_RATE;
    const quillSwitchCost = QUILLSWITCH_PLAN_COST + quillSwitchInternalCost;

    const totalSavings = totalManualCost - quillSwitchCost;
    const weeksSaved = inputs.migrationWeeks - QUILLSWITCH_TIMELINE_WEEKS;
    const hoursSaved = manualInternalStaffTotalHours - QUILLSWITCH_INTERNAL_HOURS;

    return {
      manualConsultantCost,
      manualInternalStaffCost,
      wastedCrmSubscriptionCost,
      totalManualCost,
      quillSwitchCost,
      totalSavings,
      weeksSaved,
      hoursSaved,
    };
  }, [inputs]);

  const chartData = [
    {
      name: "Manual Migration",
      cost: results.totalManualCost,
      fill: "hsl(var(--destructive))",
    },
    {
      name: "QuillSwitch",
      cost: results.quillSwitchCost,
      fill: "hsl(var(--primary))",
    },
  ];

  const chartConfig = {
    cost: {
      label: "Cost",
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
          <Calculator className="h-4 w-4" />
          Savings Calculator
        </div>
        <h2 className="text-3xl font-bold">Calculate Your Migration Savings</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          See how much time and money you can save by choosing QuillSwitch over traditional manual migration methods.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Inputs Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Your Migration Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Migration Duration */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Manual migration project duration: {inputs.migrationWeeks} weeks
              </Label>
              <Slider
                value={[inputs.migrationWeeks]}
                onValueChange={(value) =>
                  setInputs({ ...inputs, migrationWeeks: value[0] })
                }
                min={4}
                max={24}
                step={2}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>4 weeks</span>
                <span>24+ weeks</span>
              </div>
            </div>

            <Separator />

            {/* External Consultant */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Use external consultant?</Label>
                <Switch
                  checked={inputs.useConsultant}
                  onCheckedChange={(checked) =>
                    setInputs({ ...inputs, useConsultant: checked })
                  }
                />
              </div>

              {inputs.useConsultant && (
                <div className="grid gap-4 pl-4 border-l-2 border-primary/20">
                  <div className="space-y-2">
                    <Label htmlFor="consultantRate" className="text-sm">
                      Consultant hourly rate
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="consultantRate"
                        type="number"
                        value={inputs.consultantRate}
                        onChange={(e) =>
                          setInputs({
                            ...inputs,
                            consultantRate: Number(e.target.value),
                          })
                        }
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="consultantHours" className="text-sm">
                      Estimated billable hours
                    </Label>
                    <Input
                      id="consultantHours"
                      type="number"
                      value={inputs.consultantHours}
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          consultantHours: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Internal Staff */}
            <div className="space-y-2">
              <Label htmlFor="internalStaff" className="text-sm font-medium">
                Internal team members involved
              </Label>
              <Input
                id="internalStaff"
                type="number"
                value={inputs.internalStaff}
                onChange={(e) =>
                  setInputs({ ...inputs, internalStaff: Number(e.target.value) })
                }
                min={1}
              />
              <p className="text-xs text-muted-foreground">
                Assumes 10 hours/week per person during migration
              </p>
            </div>

            <Separator />

            {/* CRM Monthly Cost */}
            <div className="space-y-2">
              <Label htmlFor="monthlyCrmCost" className="text-sm font-medium">
                New CRM monthly subscription cost
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="monthlyCrmCost"
                  type="number"
                  value={inputs.monthlyCrmCost}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      monthlyCrmCost: Number(e.target.value),
                    })
                  }
                  className="pl-9"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Your Savings Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Savings Display */}
            <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
              <div className="text-sm text-muted-foreground mb-2">YOUR ESTIMATED SAVINGS</div>
              <div className="text-4xl font-bold text-primary mb-4">
                {formatCurrency(results.totalSavings)}
              </div>
              
              {/* Key Benefits */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <Clock className="h-4 w-4" />
                  <span>Go live {Math.round(results.weeksSaved)} weeks sooner!</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <Users className="h-4 w-4" />
                  <span>Save {Math.round(results.hoursSaved)} internal team hours</span>
                </div>
              </div>
            </div>

            {/* Comparison Chart */}
            <div className="space-y-4">
              <h4 className="font-medium text-center">Cost Comparison</h4>
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0];
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-medium">{data.payload.name}</p>
                              <p className="text-primary font-bold">
                                {formatCurrency(data.value as number)}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="cost" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            {/* CTAs */}
            <div className="space-y-3">
              <Button className="w-full" size="lg">
                Start with QuillSwitch Essentials ({formatCurrency(1999)})
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  Learn About Pro
                </Button>
                <Button variant="outline" size="sm">
                  Talk to Expert
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assumptions Section */}
      <Card>
        <CardHeader>
          <CardTitle 
            className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
            onClick={() => setShowAssumptions(!showAssumptions)}
          >
            <Info className="h-5 w-5" />
            Calculation Assumptions
            <ArrowRight className={`h-4 w-4 transition-transform ${showAssumptions ? 'rotate-90' : ''}`} />
          </CardTitle>
        </CardHeader>
        {showAssumptions && (
          <CardContent>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2 text-sm">
                  <p><strong>QuillSwitch Timeline:</strong> 1 day to complete migration</p>
                  <p><strong>Internal Staff Cost:</strong> $75/hour (fully-loaded)</p>
                  <p><strong>QuillSwitch Staff Time:</strong> 8 total hours for setup and review</p>
                  <p><strong>Manual Migration:</strong> 10 hours/week per internal staff member</p>
                  <p><strong>Wasted Subscription:</strong> CRM costs during extended manual migration timeline</p>
                  <p><strong>QuillSwitch Plan:</strong> Essentials plan at {formatCurrency(1999)}</p>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default SavingsCalculator;
