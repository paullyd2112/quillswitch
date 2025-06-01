
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const OAuthCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Processing your authentication...");
  const [provider, setProvider] = useState<string>("");
  
  useEffect(() => {
    const processCallback = async () => {
      try {
        // Extract code and state from URL parameters
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        
        if (error) {
          console.error('OAuth error:', error, errorDescription);
          setStatus("error");
          setMessage(`Authentication failed: ${errorDescription || error}`);
          return;
        }
        
        if (!code || !state) {
          setStatus("error");
          setMessage("Missing required authentication parameters. Please try again.");
          return;
        }
        
        // Parse state to get provider info
        let stateData;
        try {
          stateData = JSON.parse(state);
          setProvider(stateData.provider || "CRM");
        } catch {
          setStatus("error");
          setMessage("Invalid authentication state. Please try again.");
          return;
        }
        
        setMessage(`Completing ${stateData.provider} authentication...`);
        
        // Call the OAuth callback edge function to complete the authentication
        const { data, error: callbackError } = await supabase.functions.invoke('oauth-callback', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          body: new URLSearchParams({ 
            code: code,
            state: state
          })
        });
        
        if (callbackError) {
          console.error('OAuth callback error:', callbackError);
          setStatus("error");
          setMessage(`Failed to complete authentication: ${callbackError.message}`);
          return;
        }
        
        if (data?.success) {
          setStatus("success");
          setMessage(data.message || `Successfully connected to ${stateData.provider}!`);
          
          // Show success toast
          toast({
            title: "Connection Successful",
            description: `Your ${stateData.provider} account has been connected securely.`
          });
        } else {
          setStatus("error");
          setMessage(data?.error || "Authentication failed. Please try again.");
        }
        
      } catch (error) {
        console.error("OAuth callback processing error:", error);
        setStatus("error");
        setMessage("An unexpected error occurred during authentication. Please try again.");
      }
    };
    
    // Add a small delay to show the loading state
    setTimeout(processCallback, 1000);
  }, [location, toast]);
  
  const handleNavigation = () => {
    if (status === "success") {
      navigate("/app/crm-connections");
    } else {
      navigate("/app/crm-connections");
    }
  };
  
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status === "loading" && (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Connecting to {provider}...
              </>
            )}
            {status === "success" && (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                Connection Successful
              </>
            )}
            {status === "error" && (
              <>
                <XCircle className="h-5 w-5 text-red-500" />
                Connection Failed
              </>
            )}
          </CardTitle>
          <CardDescription>
            {status === "loading" && "Please wait while we establish your connection"}
            {status === "success" && "You've successfully connected your CRM"}
            {status === "error" && "We encountered an issue connecting your CRM"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-6 space-y-4">
            {status === "loading" && (
              <div className="flex flex-col items-center space-y-3">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                <p className="text-muted-foreground text-center">{message}</p>
              </div>
            )}
            
            {status === "success" && (
              <div className="flex flex-col items-center space-y-3">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <p className="text-center text-muted-foreground">{message}</p>
                <div className="text-sm text-center text-muted-foreground bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                  Your credentials are encrypted and stored securely. You can now use this connection for data migration.
                </div>
              </div>
            )}
            
            {status === "error" && (
              <div className="flex flex-col items-center space-y-3">
                <XCircle className="h-12 w-12 text-red-500" />
                <p className="text-center text-muted-foreground">{message}</p>
                <div className="text-sm text-center text-muted-foreground bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                  You can try connecting again from the CRM connections page.
                </div>
              </div>
            )}
            
            {status !== "loading" && (
              <Button
                onClick={handleNavigation}
                variant={status === "success" ? "default" : "outline"}
                className="mt-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {status === "success" ? "View Connections" : "Back to Connections"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthCallback;
