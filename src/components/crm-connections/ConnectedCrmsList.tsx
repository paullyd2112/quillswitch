
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ConnectedCredential } from "./types";

interface ConnectedCrmsListProps {
  connectedCredentials: ConnectedCredential[];
  isLoading: boolean;
  onDisconnect: (credentialId: string, serviceName: string) => void;
}

const ConnectedCrmsList: React.FC<ConnectedCrmsListProps> = ({
  connectedCredentials,
  isLoading,
  onDisconnect
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Connected CRMs</CardTitle>
        <CardDescription>
          Manage your connected CRM accounts
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-6">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Loading connections...</p>
          </div>
        ) : connectedCredentials.length > 0 ? (
          <div className="space-y-4">
            {connectedCredentials.map((credential) => (
              <div key={credential.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium capitalize">{credential.service_name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Connected on {new Date(credential.created_at).toLocaleDateString()}
                  </p>
                  {credential.expires_at && (
                    <p className="text-xs text-amber-600">
                      Expires: {new Date(credential.expires_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDisconnect(credential.id, credential.service_name)}
                >
                  Disconnect
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No CRMs connected yet. Connect a CRM platform above to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConnectedCrmsList;
