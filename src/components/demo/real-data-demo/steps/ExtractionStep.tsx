import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Shield } from "lucide-react";
import { AccessInfo } from "../types";

interface ExtractionStepProps {
  extractionProgress: number;
  selectedDataTypes: string[];
  accessInfo: AccessInfo | null;
}

const ExtractionStep: React.FC<ExtractionStepProps> = ({
  extractionProgress,
  selectedDataTypes,
  accessInfo
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Extracting Your Data</h2>
        <p className="text-muted-foreground mb-6">
          Securely extracting your real CRM data for the migration demo...
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Extraction Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(extractionProgress)}%</span>
            </div>
            <Progress value={extractionProgress} className="w-full" />
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {selectedDataTypes.length}
                </div>
                <div className="text-sm text-muted-foreground">Data Types</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {accessInfo?.recordLimit || 100}
                </div>
                <div className="text-sm text-muted-foreground">Max Records</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Your data is encrypted in transit and will be automatically deleted after the demo session expires.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ExtractionStep;