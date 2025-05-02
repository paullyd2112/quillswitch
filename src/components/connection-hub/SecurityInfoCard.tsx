
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, KeyRound } from "lucide-react";

const SecurityInfoCard: React.FC = () => {
  return (
    <Card className="border-green-100">
      <CardHeader className="bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-800">
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-green-700 dark:text-green-400 mr-2" />
          <CardTitle className="text-green-800 dark:text-green-400">Security Information</CardTitle>
        </div>
        <CardDescription className="text-green-700 dark:text-green-400">
          How your API keys and credentials are protected
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-full mr-3 mt-1">
              <Lock className="h-5 w-5 text-green-700 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium text-green-800 dark:text-green-400">End-to-End Encryption</h3>
              <p className="text-green-700 dark:text-green-500 text-sm">
                All API keys and credentials are encrypted using AES-256 encryption before being stored.
                Your encryption key is derived from your device information and is never transmitted to our servers.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-full mr-3 mt-1">
              <KeyRound className="h-5 w-5 text-green-700 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium text-green-800 dark:text-green-400">Zero Knowledge Architecture</h3>
              <p className="text-green-700 dark:text-green-500 text-sm">
                Your credentials can only be decrypted on your device. Our system is designed so that
                we never have access to your raw API keys, even during the migration process.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-full mr-3 mt-1">
              <Shield className="h-5 w-5 text-green-700 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium text-green-800 dark:text-green-400">Secure Access Controls</h3>
              <p className="text-green-700 dark:text-green-500 text-sm">
                Access to your encrypted credentials is strictly controlled with role-based permissions.
                Our application validates the integrity of every credential access request.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityInfoCard;
