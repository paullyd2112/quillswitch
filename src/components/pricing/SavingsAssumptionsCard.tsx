
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, ArrowRight } from "lucide-react";
import { formatCurrency } from "./pricingUtils";

const SavingsAssumptionsCard: React.FC = () => {
  const [showAssumptions, setShowAssumptions] = useState(false);

  return (
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
                <p><strong>CRM Costs:</strong> Both old and new CRM subscription costs during migration timeline</p>
                <p><strong>QuillSwitch Plan:</strong> Essentials plan at {formatCurrency(1999)}</p>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      )}
    </Card>
  );
};

export default SavingsAssumptionsCard;
