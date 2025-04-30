
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Lock, ShieldAlert, Info } from "lucide-react";

const ConsentManagementCard = () => {
  const [dataRetentionConsent, setDataRetentionConsent] = useState(true);
  const [dataProcessingConsent, setDataProcessingConsent] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(false);

  const handleConsentChange = (consent: string, value: boolean) => {
    switch (consent) {
      case "retention":
        setDataRetentionConsent(value);
        break;
      case "processing":
        setDataProcessingConsent(value);
        break;
      case "marketing":
        setMarketingConsent(value);
        break;
    }
    
    toast.success(`Consent preferences updated`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consent Management</CardTitle>
        <CardDescription>
          Manage your consent for how we handle your data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                  Data Retention
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  We store your data to provide our services and maintain your account.
                </p>
              </div>
              <div className="flex items-center">
                <span className="text-xs mr-2">Required</span>
                <Switch
                  checked={dataRetentionConsent}
                  onCheckedChange={(checked) => handleConsentChange("retention", checked)}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              This is required to provide core functionalities of our service. If disabled, you won't be able to use our product.
            </p>
          </div>
          
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium flex items-center">
                  <ShieldAlert className="h-4 w-4 mr-2 text-muted-foreground" />
                  Data Processing
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  We process your data to improve our services and provide personalized features.
                </p>
              </div>
              <Switch
                checked={dataProcessingConsent}
                onCheckedChange={(checked) => handleConsentChange("processing", checked)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              This allows us to analyze your usage patterns to provide better recommendations and improve our service.
            </p>
          </div>
          
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium flex items-center">
                  <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                  Marketing Communications
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  We send you updates about new features, promotions, and related products.
                </p>
              </div>
              <Switch
                checked={marketingConsent}
                onCheckedChange={(checked) => handleConsentChange("marketing", checked)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              You can opt out of marketing emails at any time through your account settings or by clicking "unsubscribe" in any marketing email.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsentManagementCard;
