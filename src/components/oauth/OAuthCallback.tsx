
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useOAuthCallback } from "./hooks/useOAuthCallback";
import OAuthCardHeader from "./components/OAuthCardHeader";
import OAuthStatusDisplay from "./components/OAuthStatusDisplay";
import OAuthNavigationButton from "./components/OAuthNavigationButton";

const OAuthCallback: React.FC = () => {
  const { status, message, provider } = useOAuthCallback();
  
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <OAuthCardHeader status={status} provider={provider} />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-6 space-y-4">
            <OAuthStatusDisplay status={status} provider={provider} message={message} />
            <OAuthNavigationButton status={status} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthCallback;
