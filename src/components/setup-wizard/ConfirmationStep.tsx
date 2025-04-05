
import React from "react";
import { Check, X, Loader2 } from "lucide-react";
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
  multiDestinationEnabled: boolean;
  selectedDestinationCrms: string[];
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  formData,
  isSubmitting,
  handleSubmit,
  multiCrmEnabled,
  selectedSourceCrms,
  customCrmNames,
  sourceCrmOptions,
  destinationCrmOptions,
  multiDestinationEnabled,
  selectedDestinationCrms
}) => {
  const getCrmName = (crmId: string, isSource: boolean = true): string => {
    const options = isSource ? sourceCrmOptions : destinationCrmOptions;
    const crmOption = options.find(c => c.id === crmId);
    
    if (crmId === 'custom') {
      return customCrmNames[isSource ? crmId : 'destination'] || 'Custom CRM';
    }
    
    return crmOption?.name || crmId;
  };
  
  const getDataTypesList = (): string => {
    if (multiCrmEnabled && formData.crmDataSelections.length > 0) {
      // Just show a summary count for multi-CRM mode
      const totalDataTypes = formData.crmDataSelections.reduce(
        (total, selection) => total + selection.dataTypes.length, 0
      );
      return `${totalDataTypes} data types selected across ${formData.crmDataSelections.length} CRMs`;
    }
    
    // For single CRM mode, show the list of data types
    if (formData.dataTypes.length === 0) {
      return "None selected";
    }
    
    return formData.dataTypes
      .map(type => {
        switch (type) {
          case "contacts": return "Contacts & Leads";
          case "accounts": return "Accounts & Companies";
          case "opportunities": return "Opportunities & Deals";
          case "cases": return "Cases & Tickets";
          case "activities": return "Activities & Tasks";
          case "custom": return "Custom Objects";
          default: return type;
        }
      })
      .join(", ");
  };
  
  const getMigrationStrategyText = (): string => {
    switch (formData.migrationStrategy) {
      case "full": return "Full Migration (all at once)";
      case "incremental": return "Incremental Migration (in phases)";
      case "parallel": return "Parallel Operation (continuous syncing)";
      default: return formData.migrationStrategy;
    }
  };

  return (
    <div>
      <h3 className="text-xl font-medium mb-4">Confirm Migration Setup</h3>
      <p className="text-muted-foreground mb-6">
        Please review your migration configuration before proceeding. Once confirmed, your migration project will be created.
      </p>
      
      <div className="space-y-6">
        <div className="border rounded-md overflow-hidden">
          <div className="p-4 bg-muted font-medium">Company Information</div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-sm text-muted-foreground">Company Name:</span>
                <p>{formData.companyName}</p>
              </div>
              {formData.industry && (
                <div>
                  <span className="text-sm text-muted-foreground">Industry:</span>
                  <p>{formData.industry}</p>
                </div>
              )}
              {formData.companySize && (
                <div>
                  <span className="text-sm text-muted-foreground">Company Size:</span>
                  <p>{formData.companySize}</p>
                </div>
              )}
            </div>
            {formData.migrationGoals && (
              <div>
                <span className="text-sm text-muted-foreground">Migration Goals:</span>
                <p className="whitespace-pre-line">{formData.migrationGoals}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <div className="p-4 bg-muted font-medium">CRM Configuration</div>
          <div className="p-4 space-y-4">
            <div>
              <span className="text-sm text-muted-foreground">Source CRM{multiCrmEnabled ? 's' : ''}:</span>
              <p>
                {multiCrmEnabled ? (
                  <span>
                    Multiple CRMs ({selectedSourceCrms.length}): {selectedSourceCrms.map(crmId => getCrmName(crmId)).join(", ")}
                  </span>
                ) : (
                  <span>{getCrmName(formData.sourceCrm)}</span>
                )}
              </p>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">Destination CRM{multiDestinationEnabled ? 's' : ''}:</span>
              <p>
                {multiDestinationEnabled ? (
                  <span>
                    Multiple CRMs ({selectedDestinationCrms.length}): {selectedDestinationCrms.map(crmId => getCrmName(crmId, false)).join(", ")}
                  </span>
                ) : (
                  <span>{getCrmName(formData.destinationCrm, false)}</span>
                )}
              </p>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">API Key Status:</span>
              <div className="flex flex-col gap-2 mt-1">
                {multiCrmEnabled ? (
                  selectedSourceCrms.map(crmId => (
                    <div key={`source-${crmId}`} className="flex items-center gap-2">
                      {formData.apiKeys[crmId] ? (
                        <Check size={16} className="text-green-500" />
                      ) : (
                        <X size={16} className="text-amber-500" />
                      )}
                      <span>{getCrmName(crmId)} API Key</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-2">
                    {formData.apiKeys[formData.sourceCrm] ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <X size={16} className="text-amber-500" />
                    )}
                    <span>{getCrmName(formData.sourceCrm)} API Key</span>
                  </div>
                )}
                
                {multiDestinationEnabled ? (
                  selectedDestinationCrms.map(crmId => (
                    <div key={`dest-${crmId}`} className="flex items-center gap-2">
                      {formData.apiKeys[crmId] ? (
                        <Check size={16} className="text-green-500" />
                      ) : (
                        <X size={16} className="text-amber-500" />
                      )}
                      <span>{getCrmName(crmId, false)} API Key</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-2">
                    {formData.apiKeys[formData.destinationCrm] ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <X size={16} className="text-amber-500" />
                    )}
                    <span>{getCrmName(formData.destinationCrm, false)} API Key</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <div className="p-4 bg-muted font-medium">Migration Configuration</div>
          <div className="p-4 space-y-4">
            <div>
              <span className="text-sm text-muted-foreground">Data Types to Migrate:</span>
              <p>{getDataTypesList()}</p>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">Migration Strategy:</span>
              <p>{getMigrationStrategyText()}</p>
            </div>
            
            {formData.customMapping && (
              <div>
                <span className="text-sm text-muted-foreground">Custom Object Mapping:</span>
                <p className="whitespace-pre-line text-sm mt-1">{formData.customMapping}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 rounded-md bg-brand-600 text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors disabled:opacity-70 flex items-center gap-2 mx-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating Migration Project...
              </>
            ) : (
              <>
                <Check size={16} />
                Create Migration Project
              </>
            )}
          </button>
          
          <p className="text-sm text-muted-foreground mt-4">
            By proceeding, you'll create a migration project that will guide you through the CRM migration process.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;
