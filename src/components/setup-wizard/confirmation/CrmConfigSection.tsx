
import React from "react";
import { Check, X } from "lucide-react";
import { ConfirmationSectionProps } from "./types";

const CrmConfigSection: React.FC<ConfirmationSectionProps> = ({
  formData,
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

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="p-4 bg-muted font-medium">CRM Configuration</div>
      <div className="p-4 space-y-4">
        <div>
          <span className="text-sm text-muted-foreground">Source CRM{multiCrmEnabled ? 's' : ''}:</span>
          <p>
            {multiCrmEnabled ? (
              <span>
                Multiple CRMs ({selectedSourceCrms?.length}): {selectedSourceCrms?.map(crmId => getCrmName(crmId)).join(", ")}
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
                Multiple CRMs ({selectedDestinationCrms?.length}): {selectedDestinationCrms?.map(crmId => getCrmName(crmId, false)).join(", ")}
              </span>
            ) : (
              <span>{getCrmName(formData.destinationCrm, false)}</span>
            )}
          </p>
        </div>
        
        <div>
          <span className="text-sm text-muted-foreground">API Key Status:</span>
          <div className="flex flex-col gap-2 mt-1">
            {multiCrmEnabled && selectedSourceCrms ? (
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
            
            {multiDestinationEnabled && selectedDestinationCrms ? (
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
  );
};

export default CrmConfigSection;
