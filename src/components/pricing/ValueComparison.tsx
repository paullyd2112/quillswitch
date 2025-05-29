
import React from "react";
import { DollarSign, Check, Sparkles } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "./pricingUtils";

const ValueComparison: React.FC = () => {
  return (
    <FadeIn delay="200">
      <Card className="p-8 border border-primary/10 bg-gradient-to-br from-background to-primary/5">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-2">Why Choose Fixed Pricing?</h3>
            <p className="text-muted-foreground">Save thousands compared to traditional consultants</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
                <DollarSign className="h-6 w-6 text-red-500" />
              </div>
              <h4 className="font-medium">Traditional Consultants</h4>
              <p className="text-sm text-muted-foreground">$8,000 - $60,000+</p>
              <p className="text-xs text-red-600">Hourly rates, scope creep, hidden fees</p>
            </div>
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                <Check className="h-6 w-6 text-green-500" />
              </div>
              <h4 className="font-medium">QuillSwitch</h4>
              <p className="text-sm text-muted-foreground">{formatCurrency(1999)} - {formatCurrency(3999)}</p>
              <p className="text-xs text-green-600">Fixed price, complete solution</p>
            </div>
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-medium">Your Savings</h4>
              <p className="text-sm text-muted-foreground">Up to 80% less</p>
              <p className="text-xs text-primary">Predictable budgeting</p>
            </div>
          </div>
        </div>
      </Card>
    </FadeIn>
  );
};

export default ValueComparison;
