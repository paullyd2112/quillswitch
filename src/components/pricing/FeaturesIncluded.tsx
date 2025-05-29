
import React from "react";
import { Check } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";
import { Card } from "@/components/ui/card";

const FeaturesIncluded: React.FC = () => {
  return (
    <FadeIn delay="400">
      <Card className="p-8 border border-primary/10 bg-gradient-to-br from-background to-primary/5">
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-center">What's Included in Every Plan</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Complete Data Migration</p>
                <p className="text-sm text-muted-foreground">All your CRM data transferred securely</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">AI-Powered Mapping</p>
                <p className="text-sm text-muted-foreground">Smart field matching and data transformation</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Data Validation</p>
                <p className="text-sm text-muted-foreground">Comprehensive quality checks and cleansing</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Rollback Protection</p>
                <p className="text-sm text-muted-foreground">Safe migration with instant rollback option</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">24/7 Support</p>
                <p className="text-sm text-muted-foreground">Expert assistance throughout the process</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Success Guarantee</p>
                <p className="text-sm text-muted-foreground">We ensure your migration completes successfully</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </FadeIn>
  );
};

export default FeaturesIncluded;
