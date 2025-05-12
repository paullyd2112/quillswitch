
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, AlertTriangle } from "lucide-react";
import { isConnectionSecure } from "@/utils/encryptionUtils";

const CredentialSecurityInfo = () => {
  const isSecure = isConnectionSecure();

  return (
    <Card className="border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="space-y-3">
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-300">Credential Security Information</h3>
              <p className="text-sm text-blue-800/70 dark:text-blue-400/80">
                Your credentials are protected with multiple layers of security.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <Lock className="h-4 w-4 text-blue-700 dark:text-blue-300 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-300">Encrypted Storage</p>
                  <p className="text-blue-800/70 dark:text-blue-400/80">
                    All credentials are encrypted at rest using pgsodium with server-side encryption keys
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Lock className="h-4 w-4 text-blue-700 dark:text-blue-300 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-300">Row-Level Security</p>
                  <p className="text-blue-800/70 dark:text-blue-400/80">
                    Data isolation ensures you can only access your own credentials
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Lock className="h-4 w-4 text-blue-700 dark:text-blue-300 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-300">Access Logging</p>
                  <p className="text-blue-800/70 dark:text-blue-400/80">
                    All credential access is logged for security and auditing
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Lock className="h-4 w-4 text-blue-700 dark:text-blue-300 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-300">Secure Transmission</p>
                  <p className="text-blue-800/70 dark:text-blue-400/80">
                    {isSecure ? 
                      "Credentials are only transmitted over secure HTTPS connection" : 
                      "WARNING: You are not using a secure HTTPS connection"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-300">Security Best Practices</p>
                  <ul className="list-disc ml-4 text-blue-800/70 dark:text-blue-400/80">
                    <li>Rotate your API keys and credentials regularly (every 30-90 days)</li>
                    <li>Set short expiration dates for sensitive credentials</li>
                    <li>Delete unused credentials to reduce security exposure</li>
                    <li>Always use the most restrictive API permissions possible</li>
                    <li>Enable 2FA on all your service accounts</li>
                    <li>Never share your API keys in code repositories, emails or messages</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CredentialSecurityInfo;
