import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertCircle } from "lucide-react";
import { AccessInfo } from "../types";

interface AccessStepProps {
  email: string;
  accessInfo: AccessInfo | null;
  onNext: () => void;
}

const AccessStep: React.FC<AccessStepProps> = ({ email, accessInfo, onNext }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Real Data Migration Demo</h2>
        <p className="text-muted-foreground mb-6">
          Experience QuillSwitch with your actual CRM data. We'll extract up to 100 records 
          for a complete migration simulation.
        </p>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Security First:</strong> Your data is encrypted, never stored permanently, 
          and automatically deleted after 24 hours. We only extract a small sample for the demo.
        </AlertDescription>
      </Alert>

      {accessInfo && (
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Demo Access Status</h3>
                <p className="text-sm text-muted-foreground">
                  Domain: {email.split('@')[1]}
                </p>
                <p className="text-sm text-muted-foreground">
                  Record Limit: {accessInfo.recordLimit} records
                </p>
                {accessInfo.remainingDemos !== undefined && (
                  <p className="text-sm text-muted-foreground">
                    Remaining Demos: {accessInfo.remainingDemos}
                  </p>
                )}
              </div>
              <Badge variant={accessInfo.canAccess ? "default" : "destructive"}>
                {accessInfo.canAccess ? "Approved" : "Blocked"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {accessInfo?.canAccess && (
        <div className="flex justify-center">
          <Button onClick={onNext} size="lg">
            Start Real Data Demo
          </Button>
        </div>
      )}

      {!accessInfo?.canAccess && accessInfo?.reason && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {accessInfo.reason}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AccessStep;