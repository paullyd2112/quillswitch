
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SalesforceConnectionTestProps {
  credentialId: string;
}

const SalesforceConnectionTest: React.FC<SalesforceConnectionTestProps> = ({ credentialId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const { toast } = useToast();

  const testConnection = async () => {
    console.log('Test Connection button clicked');
    setIsLoading(true);
    setTestResult(null);

    try {
      console.log('Calling Supabase function with credentialId:', credentialId);
      // Test the connection by making a simple API call
      const { data, error } = await supabase.functions.invoke('test-salesforce-connection', {
        body: { credentialId }
      });

      console.log('Supabase function response:', { data, error });

      if (error) {
        throw new Error(error.message);
      }

      const result = {
        success: data.success,
        message: data.success 
          ? `Connected successfully! Organization: ${data.organizationName || 'Unknown'}`
          : data.error || 'Connection test failed'
      };

      setTestResult(result);
      
      toast({
        title: result.success ? "Connection Test Successful" : "Connection Test Failed",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setTestResult({
        success: false,
        message: errorMessage
      });

      toast({
        title: "Connection Test Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm">Connection Test</CardTitle>
        <CardDescription>
          Test your Salesforce connection to ensure it's working properly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testConnection} 
          disabled={isLoading}
          size="sm"
          variant="outline"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            'Test Connection'
          )}
        </Button>

        {testResult && (
          <div className="flex items-center gap-2">
            {testResult.success ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <Badge variant={testResult.success ? "default" : "destructive"}>
              {testResult.success ? "Connected" : "Failed"}
            </Badge>
            <span className="text-sm text-muted-foreground">{testResult.message}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesforceConnectionTest;
