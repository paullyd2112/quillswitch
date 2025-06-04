
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Clock, Users, ArrowRight } from "lucide-react";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { formatCurrency } from "./pricingUtils";
import { SavingsResults } from "./types";

interface SavingsResultsCardProps {
  results: SavingsResults;
}

const SavingsResultsCard: React.FC<SavingsResultsCardProps> = ({ results }) => {
  const navigate = useNavigate();

  const handleStartEssentials = () => {
    navigate("/auth?mode=register");
  };

  const handleLearnPro = () => {
    navigate("/auth?mode=register");
  };

  const handleTalkToExpert = () => {
    navigate("/auth?mode=register");
  };

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
            {results.monthlyCrmSavings > 0 && (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <DollarSign className="h-4 w-4" />
                <span>Save {formatCurrency(results.monthlyCrmSavings)}/month ongoing</span>
              </div>
            )}
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
          <Button onClick={handleStartEssentials} className="w-full" size="lg">
            Start with QuillSwitch Essentials ({formatCurrency(1999)})
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={handleLearnPro} variant="outline" size="sm">
              Learn About Pro ({formatCurrency(4999)})
            </Button>
            <Button onClick={handleTalkToExpert} variant="outline" size="sm">
              Talk to Expert
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavingsResultsCard;
