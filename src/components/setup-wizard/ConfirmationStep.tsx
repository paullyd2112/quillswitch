
import React from "react";
import { CheckCircle, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import SlideUp from "@/components/animations/SlideUp";
import { CrmSystem, SetupFormData } from "@/types/setupWizard";

interface ConfirmationStepProps {
  formData: SetupFormData;
  isSubmitting: boolean;
  handleSubmit: () => void;
  multiCrmEnabled: boolean;
  selectedSourceCrms: string[];
  customCrmNames: Record<string, string>;
  sourceCrmOptions: CrmSystem[];
  destinationCrmOptions: CrmSystem[];
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  formData,
  isSubmitting,
  handleSubmit,
  multiCrmEnabled,
  selectedSourceCrms,
  customCrmNames,
  sourceCrmOptions,
  destinationCrmOptions
}) => {
  return (
    <div className="text-center py-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
        <CheckCircle size={32} />
      </div>
      <h3 className="text-2xl font-medium mb-2">Migration Setup Complete!</h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Your CRM migration is now configured. Review the details below and start your migration when ready.
      </p>
      
      <SlideUp>
        <GlassPanel className="p-6 max-w-md mx-auto">
          <h4 className="font-medium mb-4">Migration Summary</h4>
          <ul className="space-y-2 text-left">
            <li className="flex justify-between">
              <span className="text-muted-foreground">Company:</span>
              <span className="font-medium">{formData.companyName}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Source CRM:</span>
              <span className="font-medium">
                {multiCrmEnabled 
                  ? `${selectedSourceCrms.length} CRMs selected` 
                  : sourceCrmOptions.find(c => c.id === formData.sourceCrm)?.name || formData.sourceCrm}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Destination CRM:</span>
              <span className="font-medium">
                {formData.destinationCrm === "custom" 
                  ? customCrmNames["destination"] || "Custom CRM"
                  : destinationCrmOptions.find(c => c.id === formData.destinationCrm)?.name || formData.destinationCrm}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Data Types:</span>
              <span className="font-medium">{formData.dataTypes.length} selected</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Strategy:</span>
              <span className="font-medium">{formData.migrationStrategy === "full" ? "Full Migration" : formData.migrationStrategy === "incremental" ? "Incremental Migration" : "Parallel Operation"}</span>
            </li>
          </ul>
        </GlassPanel>
      </SlideUp>
      
      <div className="mt-8">
        <Button 
          className="gap-2" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Setting up migration...</span>
            </>
          ) : (
            <>
              Start Migration <ArrowRight size={16} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
