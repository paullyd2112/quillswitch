
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Key, Lock, CheckCircle, Loader2 } from "lucide-react";
import { CrmProvider } from "./types";

interface CrmConnectionCardProps {
  provider: CrmProvider;
  isConnected: boolean;
  isConnecting: boolean;
  onConnect: (providerId: string) => void;
  onDisconnect: (providerId: string, providerName: string) => void;
}

const CrmConnectionCard: React.FC<CrmConnectionCardProps> = ({
  provider,
  isConnected,
  isConnecting,
  onConnect,
  onDisconnect
}) => {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <img 
            src={provider.icon} 
            alt={`${provider.name} logo`}
            className="w-8 h-8 object-contain"
          />
          {provider.name}
          {isConnected && <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />}
        </CardTitle>
        <CardDescription>{provider.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-muted-foreground">
            <Lock className="mr-1 h-3 w-3" />
            <span>OAuth 2.0</span>
          </div>
          
          {isConnected ? (
            <Button 
              variant="outline"
              onClick={() => onDisconnect(provider.id, provider.name)}
              className="gap-2"
            >
              Disconnect
            </Button>
          ) : (
            <Button 
              onClick={() => onConnect(provider.id)}
              disabled={isConnecting}
              className="gap-2"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Key className="h-4 w-4" />
                  Connect
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CrmConnectionCard;
