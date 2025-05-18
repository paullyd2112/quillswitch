
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ArrowLeft, Loader2 } from "lucide-react";

const OAuthCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Processing your authentication...");
  
  // Extract state from location or URL params
  useEffect(() => {
    const processCallback = async () => {
      try {
        // In a real implementation, you would process the OAuth callback here
        // For example, exchange the code for tokens, store them securely, etc.
        
        // For this simulation, we're just checking if the state contains success
        const state = location.state;
        const provider = state?.provider || "CRM";
        
        // Simulate a delay to show loading
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (state?.success) {
          setStatus("success");
          setMessage(`Successfully connected to ${provider}! You can now use this connection for data migration.`);
        } else {
          setStatus("error");
          setMessage(`Failed to connect to ${provider}. Please try again.`);
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
        setStatus("error");
        setMessage("An error occurred during authentication. Please try again.");
      }
    };
    
    processCallback();
  }, [location]);
  
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            {status === "loading" && "Connecting to CRM..."}
            {status === "success" && "Connection Successful"}
            {status === "error" && "Connection Failed"}
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
                <p className="text-muted-foreground">{message}</p>
              </div>
            )}
            
            {status === "success" && (
              <div className="flex flex-col items-center space-y-3">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <p className="text-center text-muted-foreground">{message}</p>
              </div>
            )}
            
            {status === "error" && (
              <div className="flex flex-col items-center space-y-3">
                <XCircle className="h-12 w-12 text-red-500" />
                <p className="text-center text-muted-foreground">{message}</p>
              </div>
            )}
            
            {status !== "loading" && (
              <Button
                onClick={() => navigate("/app/setup")}
                variant={status === "success" ? "default" : "outline"}
                className="mt-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {status === "success" ? "Continue to Setup" : "Return to Dashboard"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthCallback;
