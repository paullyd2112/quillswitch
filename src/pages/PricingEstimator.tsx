
import React from "react";
import PricingCalculator from "@/components/pricing/PricingCalculator";
import { Card } from "@/components/ui/card";
import { Calculator, DollarSign } from "lucide-react";

const PricingEstimator: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Pricing Estimator</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Calculate your migration costs based on your specific needs and requirements
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card className="p-6 flex flex-col items-center text-center space-y-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium">Pay-As-You-Go</h3>
            <p className="text-sm text-muted-foreground">Only pay for what you use with no hidden fees</p>
          </Card>
          
          <Card className="p-6 flex flex-col items-center text-center space-y-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Calculator className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium">Transparent Pricing</h3>
            <p className="text-sm text-muted-foreground">See exactly what you're paying for with no surprises</p>
          </Card>
          
          <Card className="p-6 flex flex-col items-center text-center space-y-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                <path d="m2 14 6 6 14-20"></path>
              </svg>
            </div>
            <h3 className="font-medium">80%+ Cost Savings</h3>
            <p className="text-sm text-muted-foreground">Save significantly compared to traditional consultants</p>
          </Card>
        </div>

        <PricingCalculator />

        <div className="bg-muted/30 p-6 rounded-lg">
          <h3 className="font-medium mb-2">Why Choose Our Pricing Model?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our pricing is designed to provide maximum value while keeping costs transparent and predictable. 
            Unlike traditional consultants who often charge premium rates regardless of project size, 
            our model scales with your needs.
          </p>
          <p className="text-sm text-muted-foreground">
            With options for detailed validation and rollback capabilities, you can customize your migration 
            package to fit your exact requirements and budget constraints.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingEstimator;
