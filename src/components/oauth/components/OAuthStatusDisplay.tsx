
import React from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { OAuthStatus } from "../types";

interface OAuthStatusDisplayProps {
  status: OAuthStatus;
  provider: string;
  message: string;
}

const OAuthStatusDisplay: React.FC<OAuthStatusDisplayProps> = ({ status, provider, message }) => {
  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />;
      case "success":
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case "error":
        return <XCircle className="h-12 w-12 text-red-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "loading":
        return "Please wait while we establish your connection";
      case "success":
        return "You've successfully connected your CRM";
      case "error":
        return "We encountered an issue connecting your CRM";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "loading":
        return "text-blue-500";
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      {getStatusIcon()}
      <p className="text-center text-muted-foreground">{message}</p>
      
      {status === "success" && (
        <div className="text-sm text-center text-muted-foreground bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
          Your credentials are encrypted and stored securely. You can now use this connection for data migration.
        </div>
      )}
      
      {status === "error" && (
        <div className="text-sm text-center text-muted-foreground bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
          You can try connecting again from the CRM connections page.
        </div>
      )}
    </div>
  );
};

export default OAuthStatusDisplay;
