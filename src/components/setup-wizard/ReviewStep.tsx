
import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SetupFormData, CrmSystem } from "@/types/setupWizard";
import { CheckCircle, Building, Database, FileText, Settings } from "lucide-react";

interface ReviewStepProps {
  formData: SetupFormData;
  selectedSourceCrms: string[];
  selectedDestinationCrms: string[];
  multiCrmEnabled: boolean;
  multiDestinationEnabled: boolean;
  customCrmNames: Record<string, string>;
  sourceCrmOptions: CrmSystem[];
  destinationCrmOptions: CrmSystem[];
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  selectedSourceCrms,
  selectedDestinationCrms,
  multiCrmEnabled,
  multiDestinationEnabled,
  customCrmNames,
  sourceCrmOptions,
  destinationCrmOptions
}) => {
  const getSourceCrmNames = () => {
    if (multiCrmEnabled) {
      return selectedSourceCrms.map(crmId => {
        const crm = sourceCrmOptions.find(c => c.id === crmId);
        return customCrmNames[crmId] || crm?.name || crmId;
      });
    } else {
      const crm = sourceCrmOptions.find(c => c.id === formData.sourceCrm);
      return [customCrmNames[formData.sourceCrm] || crm?.name || formData.sourceCrm];
    }
  };

  const getDestinationCrmNames = () => {
    if (multiDestinationEnabled) {
      return selectedDestinationCrms.map(crmId => {
        const crm = destinationCrmOptions.find(c => c.id === crmId);
        return customCrmNames[crmId] || crm?.name || crmId;
      });
    } else {
      const crm = destinationCrmOptions.find(c => c.id === formData.destinationCrm);
      return [customCrmNames[formData.destinationCrm] || crm?.name || formData.destinationCrm];
    }
  };

  return (
    <div>
      <h3 className="text-xl font-medium mb-4">Review Migration Configuration</h3>
      <p className="text-muted-foreground mb-6">
        Please review your migration configuration before proceeding. You can go back to make changes if needed.
      </p>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Company Name</Label>
                <p className="text-sm text-muted-foreground">{formData.companyName}</p>
              </div>
              {formData.industry && (
                <div>
                  <Label className="text-sm font-medium">Industry</Label>
                  <p className="text-sm text-muted-foreground">{formData.industry}</p>
                </div>
              )}
              {formData.companySize && (
                <div>
                  <Label className="text-sm font-medium">Company Size</Label>
                  <p className="text-sm text-muted-foreground">{formData.companySize}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              CRM Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Source CRM{multiCrmEnabled ? 's' : ''}</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {getSourceCrmNames().map((name, index) => (
                    <Badge key={index} variant="outline">{name}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Destination CRM{multiDestinationEnabled ? 's' : ''}</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {getDestinationCrmNames().map((name, index) => (
                    <Badge key={index} variant="outline">{name}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Data Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label className="text-sm font-medium">Data Types to Migrate</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.dataTypes.map((dataType) => (
                  <Badge key={dataType} variant="outline">
                    {dataType.charAt(0).toUpperCase() + dataType.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Migration Strategy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label className="text-sm font-medium">Strategy</Label>
              <p className="text-sm text-muted-foreground">
                {formData.migrationStrategy === 'full' && 'Full Migration - Migrate all selected data at once'}
                {formData.migrationStrategy === 'incremental' && 'Incremental Migration - Migrate in phases with testing between each phase'}
                {formData.migrationStrategy === 'parallel' && 'Parallel Operation - Run both CRMs in parallel with continuous syncing'}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          <p className="text-sm text-green-700 dark:text-green-300">
            Configuration review complete. Click "Complete Setup" to proceed with your migration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
