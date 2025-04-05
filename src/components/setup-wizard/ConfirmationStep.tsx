
import React from "react";
import { 
  CompanyInfoSection, 
  CrmConfigSection, 
  MigrationConfigSection, 
  SubmitButton,
  ConfirmationStepProps
} from "./confirmation";

const ConfirmationStep: React.FC<ConfirmationStepProps> = (props) => {
  const {
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
  } = props;

  return (
    <div>
      <h3 className="text-xl font-medium mb-4">Confirm Migration Setup</h3>
      <p className="text-muted-foreground mb-6">
        Please review your migration configuration before proceeding. Once confirmed, your migration project will be created.
      </p>
      
      <div className="space-y-6">
        <CompanyInfoSection 
          formData={formData} 
          customCrmNames={customCrmNames}
          sourceCrmOptions={sourceCrmOptions}
          destinationCrmOptions={destinationCrmOptions}
        />
        
        <CrmConfigSection 
          formData={formData}
          multiCrmEnabled={multiCrmEnabled}
          selectedSourceCrms={selectedSourceCrms}
          customCrmNames={customCrmNames}
          sourceCrmOptions={sourceCrmOptions}
          destinationCrmOptions={destinationCrmOptions}
          multiDestinationEnabled={multiDestinationEnabled}
          selectedDestinationCrms={selectedDestinationCrms}
        />
        
        <MigrationConfigSection 
          formData={formData}
          multiCrmEnabled={multiCrmEnabled}
          customCrmNames={customCrmNames}
          sourceCrmOptions={sourceCrmOptions}
          destinationCrmOptions={destinationCrmOptions}
        />
        
        <SubmitButton 
          isSubmitting={isSubmitting} 
          handleSubmit={handleSubmit} 
        />
      </div>
    </div>
  );
};

export default ConfirmationStep;
