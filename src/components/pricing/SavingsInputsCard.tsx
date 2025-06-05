
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Users, DollarSign } from "lucide-react";
import { CalculatorInputs } from "./types";

interface SavingsInputsCardProps {
  inputs: CalculatorInputs;
  onInputsChange: (inputs: CalculatorInputs) => void;
  monthlyCrmSavings: number;
}

const SavingsInputsCard: React.FC<SavingsInputsCardProps> = ({
  inputs,
  onInputsChange,
  monthlyCrmSavings,
}) => {
  const updateInputs = (updates: Partial<CalculatorInputs>) => {
    onInputsChange({ ...inputs, ...updates });
  };

  return (
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
            onValueChange={(value) => updateInputs({ migrationWeeks: value[0] })}
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
              onCheckedChange={(checked) => updateInputs({ useConsultant: checked })}
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
                    onChange={(e) => updateInputs({ consultantRate: Number(e.target.value) })}
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
                  onChange={(e) => updateInputs({ consultantHours: Number(e.target.value) })}
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
            onChange={(e) => updateInputs({ internalStaff: Number(e.target.value) })}
            min={1}
          />
          <p className="text-xs text-muted-foreground">
            Assumes 10 hours/week per person during migration
          </p>
        </div>

        <Separator />

        {/* CRM Costs */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="oldCrmCost" className="text-sm font-medium">
              Current CRM monthly cost
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="oldCrmCost"
                type="number"
                value={inputs.oldCrmCost}
                onChange={(e) => updateInputs({ oldCrmCost: Number(e.target.value) })}
                className="pl-9"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              What you're currently paying (e.g., Salesforce)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newCrmCost" className="text-sm font-medium">
              New CRM monthly cost
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="newCrmCost"
                type="number"
                value={inputs.newCrmCost}
                onChange={(e) => updateInputs({ newCrmCost: Number(e.target.value) })}
                className="pl-9"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              What you'll pay after migration (e.g., HubSpot)
            </p>
          </div>
          
          {monthlyCrmSavings > 0 && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-sm text-green-600 font-medium">
                Monthly CRM savings: ${monthlyCrmSavings.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavingsInputsCard;
