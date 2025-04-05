
import React from "react";
import { ConfirmationSectionProps } from "./types";

const MigrationConfigSection: React.FC<ConfirmationSectionProps> = ({
  formData,
  multiCrmEnabled
}) => {
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
  );
};

export default MigrationConfigSection;
