
import React from "react";
import { Key } from "lucide-react";
import CodeBlock from "../CodeBlock";

const AuthenticationTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
        <p className="text-muted-foreground mb-4">
          All API requests require authentication using an API key. You'll receive your API key when you create an account.
        </p>
      </div>
      
      <div className="flex items-start gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded-md">
        <Key className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">Keep Your API Key Secret</p>
          <p className="text-sm">Your API key provides access to your account and should be kept confidential.</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-medium mb-3">API Key Authentication</h3>
        <p className="text-muted-foreground mb-4">
          Include your API key in the <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">Authorization</code> header of your requests.
        </p>
        <CodeBlock code="Authorization: Bearer YOUR_API_KEY" />
      </div>
      
      <div>
        <h3 className="text-xl font-medium mb-3">Example Request</h3>
        <CodeBlock code={`curl --request GET \\
  --url https://api.crmmigration.example.com/v1/sources \\
  --header 'Authorization: Bearer YOUR_API_KEY'`} />
      </div>
    </div>
  );
};

export default AuthenticationTab;
