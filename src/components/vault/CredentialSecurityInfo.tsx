
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, KeyRound } from "lucide-react";

const CredentialSecurityInfo: React.FC = () => {
  return (
    <Card className="border-green-100">
      <CardHeader className="bg-green-50 border-b border-green-100">
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-green-700 mr-2" />
          <CardTitle className="text-green-800">Security Information</CardTitle>
        </div>
        <CardDescription className="text-green-700">
          How your credentials are protected
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-green-100 p-2 rounded-full mr-3 mt-1">
              <Lock className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <h3 className="font-medium text-green-800">End-to-End Encryption</h3>
              <p className="text-green-700 text-sm">
                All credentials are encrypted using AES-256 encryption before being stored.
                The encryption key is derived from your user ID and is never stored on our servers.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-green-100 p-2 rounded-full mr-3 mt-1">
              <KeyRound className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <h3 className="font-medium text-green-800">Zero Knowledge Architecture</h3>
              <p className="text-green-700 text-sm">
                Your credentials can only be decrypted with your unique key. Our system is designed so that
                even if our database is compromised, your credentials remain secure.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-green-100 p-2 rounded-full mr-3 mt-1">
              <Shield className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <h3 className="font-medium text-green-800">Row-Level Security</h3>
              <p className="text-green-700 text-sm">
                Database security policies ensure that you can only access your own credentials.
                Each credential is tied to your user account with strict access controls.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CredentialSecurityInfo;
