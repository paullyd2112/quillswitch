
import React from "react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { OAuthStatus } from "../types";

interface OAuthCardHeaderProps {
  status: OAuthStatus;
  provider: string;
}

const OAuthCardHeader: React.FC<OAuthCardHeaderProps> = ({ status, provider }) => {
  const getHeaderContent = () => {
    switch (status) {
      case "loading":
        return {
          icon: <Loader2 className="h-5 w-5 animate-spin" />,
          title: `Connecting to ${provider}...`,
          description: "Please wait while we establish your connection"
        };
      case "success":
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          title: "Connection Successful",
          description: "You've successfully connected your CRM"
        };
      case "error":
        return {
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          title: "Connection Failed",
          description: "We encountered an issue connecting your CRM"
        };
    }
  };

  const { icon, title, description } = getHeaderContent();

  return (
    <>
      <CardTitle className="flex items-center gap-2">
        {icon}
        {title}
      </CardTitle>
      <CardDescription>
        {description}
      </CardDescription>
    </>
  );
};

export default OAuthCardHeader;
