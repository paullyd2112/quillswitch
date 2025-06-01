
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const SecurityInfoAlert: React.FC = () => {
  return (
    <Alert className="mb-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertDescription className="text-blue-700 dark:text-blue-300">
        We use WorkOS OAuth for secure, enterprise-grade authentication. Your credentials are encrypted and stored securely.
      </AlertDescription>
    </Alert>
  );
};

export default SecurityInfoAlert;
