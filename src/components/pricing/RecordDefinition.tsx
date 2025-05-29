
import React from "react";
import { Check } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";
import { Card } from "@/components/ui/card";

const RecordDefinition: React.FC = () => {
  return (
    <FadeIn delay="300">
      <Card className="p-8 border border-primary/10 bg-gradient-to-br from-background to-primary/5">
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">How We Count Records</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Comprehensive Counting</span> — Every individual item being migrated counts as one record: contacts, companies, deals, activities, notes, attachments, custom objects, and more.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Real Example</span> — A contact with 5 activities and 3 notes = 9 total records (1 contact + 5 activities + 3 notes).
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Transparent Estimates</span> — Our setup wizard shows you the estimated total record count before you commit to a plan.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </FadeIn>
  );
};

export default RecordDefinition;
