
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";
import { apiClient } from "@/services/migration/apiClient";

const ApiTestSection = () => {
  const [testApiKey, setTestApiKey] = useState("demo_api_key_123456");
  const [apiTestResult, setApiTestResult] = useState<{
    success: boolean;
    message: string;
    data?: any;
  } | null>(null);
  const [isTestingApi, setIsTestingApi] = useState(false);

  const testApiConnection = async () => {
    setIsTestingApi(true);
    setApiTestResult(null);
    
    try {
      // Set the API key for testing
      apiClient.setApiKey(testApiKey);
      
      // Test the sources endpoint
      const result = await apiClient.getSources();
      
      setApiTestResult({
        success: true,
        message: "API connection successful!",
        data: result
      });
    } catch (error: any) {
      setApiTestResult({
        success: false,
        message: `API connection failed: ${error.message}`
      });
    } finally {
      setIsTestingApi(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">API Connection Test</h2>
        <p className="text-muted-foreground mb-4">
          Test your API connection using the form below. This will make a real API call to verify that everything is working.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="api-key" className="block text-sm font-medium mb-1">API Key</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              id="api-key" 
              value={testApiKey}
              onChange={(e) => setTestApiKey(e.target.value)}
              className="flex-1 px-3 py-2 border border-input bg-background rounded-md text-sm"
              placeholder="Enter your API key"
            />
            <Button onClick={testApiConnection} disabled={isTestingApi}>
              {isTestingApi ? "Testing..." : "Test Connection"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Default demo key: demo_api_key_123456
          </p>
        </div>
        
        {apiTestResult && (
          <Alert variant={apiTestResult.success ? "default" : "destructive"}>
            {apiTestResult.success ? (
              <CheckCircle className="h-4 w-4 mr-2" />
            ) : (
              <XCircle className="h-4 w-4 mr-2" />
            )}
            <AlertTitle>{apiTestResult.success ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>
              {apiTestResult.message}
              {apiTestResult.success && apiTestResult.data && (
                <div className="mt-2">
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md font-mono text-xs max-h-60 overflow-auto">
                    <pre>{JSON.stringify(apiTestResult.data, null, 2)}</pre>
                  </div>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default ApiTestSection;
