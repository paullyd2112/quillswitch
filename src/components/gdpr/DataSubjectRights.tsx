
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  User, 
  RefreshCw,
  ShieldAlert,
  AlertTriangle,
  Lock,
  FileText
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import CookiePreferencesManager from "./CookiePreferencesManager";
import { toast } from "sonner";

const DataSubjectRights: React.FC = () => {
  const handleDataAccessRequest = () => {
    toast.success("Data access request submitted. You will receive your data within 30 days.");
  };
  
  const handleDataCorrectionRequest = () => {
    toast.success("Data correction request submitted. Our team will contact you shortly.");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShieldAlert className="h-5 w-5 mr-2 text-brand-500" />
          Your GDPR Rights
        </CardTitle>
        <CardDescription>
          Under the General Data Protection Regulation (GDPR), you have several rights regarding your personal data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-medium flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                Right to Access
              </h3>
              <p className="text-sm text-muted-foreground">
                You have the right to request a copy of your personal data that we hold
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="shrink-0"
              onClick={handleDataAccessRequest}
            >
              <Download className="h-4 w-4 mr-1" />
              Request Data Access
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-medium flex items-center">
                <RefreshCw className="h-4 w-4 mr-2 text-muted-foreground" />
                Right to Rectification
              </h3>
              <p className="text-sm text-muted-foreground">
                You have the right to correct inaccurate personal data we hold about you
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="shrink-0"
              onClick={handleDataCorrectionRequest}
            >
              Request Correction
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-medium flex items-center">
                <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                Cookie Preferences
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage your cookie consent settings and preferences
              </p>
            </div>
            <CookiePreferencesManager />
          </div>
          
          <Separator />
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-medium flex items-center">
                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                Right to be Informed
              </h3>
              <p className="text-sm text-muted-foreground">
                Read our comprehensive Privacy Policy and Terms of Service
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('#', '_blank')}
              >
                Privacy Policy
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('#', '_blank')}
              >
                Terms of Service
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mr-2 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-400">
              To exercise your right to data portability, right to be forgotten, or to object to processing, 
              please use the corresponding options in your account settings or contact our 
              Data Protection Officer at <a href="mailto:dpo@quillswitch.com" className="underline hover:text-amber-600">dpo@quillswitch.com</a>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSubjectRights;
