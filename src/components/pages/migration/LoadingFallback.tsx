
import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, Home, ArrowLeft, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ErrorDetails {
  title: string;
  message: string;
  suggestion: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface LoadingFallbackProps {
  error?: Error | null;
  onRetry?: () => void;
  showBackButton?: boolean;
  loadingMessage?: string;
  autoRetryCount?: number;
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  error, 
  onRetry, 
  showBackButton = true,
  loadingMessage = "Loading migration data...",
  autoRetryCount = 0
}) => {
  const navigate = useNavigate();
  const [retryCount, setRetryCount] = useState(0);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [authIssue, setAuthIssue] = useState(false);

  // Effect to check if the error is auth-related
  useEffect(() => {
    if (error && error.message.includes("unauthorized")) {
      checkAuthStatus();
    }
  }, [error]);

  // Effect to handle auto retry logic
  useEffect(() => {
    let retryTimeout: NodeJS.Timeout;
    
    if (error && autoRetryCount > 0 && retryCount < autoRetryCount) {
      console.log(`Auto retry attempt ${retryCount + 1} of ${autoRetryCount}...`);
      
      // Exponential backoff: 2^retryCount * 1000 ms (1s, 2s, 4s, 8s, etc.)
      const delay = Math.min(Math.pow(2, retryCount) * 1000, 10000);
      
      toast.info(`Retrying in ${delay/1000} seconds...`, {
        duration: delay - 100,
      });
      
      retryTimeout = setTimeout(() => {
        if (onRetry) {
          setRetryCount(prev => prev + 1);
          onRetry();
        }
      }, delay);
    }
    
    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [error, autoRetryCount, retryCount, onRetry]);

  // Check if there's an authentication issue
  const checkAuthStatus = async () => {
    try {
      setIsCheckingAuth(true);
      const { data } = await supabase.auth.getSession();
      const hasSession = !!data.session;
      setAuthIssue(!hasSession);
    } catch (e) {
      console.error("Error checking auth status:", e);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  // Custom error messages for specific error types
  const getErrorDetails = (): ErrorDetails | null => {
    if (!error) return null;
    
    if (authIssue || error.message.includes("unauthorized") || error.message.includes("permission")) {
      return {
        title: "Authentication Required",
        message: "You need to be signed in to access this resource.",
        suggestion: "Please sign in to continue.",
        action: {
          label: "Sign In",
          onClick: () => navigate("/auth")
        }
      };
    }
    
    if (error.message.includes("not found") || error.message.includes("does not exist")) {
      return {
        title: "Migration Project Not Found",
        message: "The migration project you're trying to access doesn't exist or has been deleted.",
        suggestion: "Check the URL or go back to the migrations list."
      };
    }
    
    if (error.message.includes("network") || error.message.includes("connection")) {
      return {
        title: "Network Error",
        message: "There was a problem connecting to the server.",
        suggestion: "Check your internet connection and try again."
      };
    }
    
    if (error.message.includes("timeout")) {
      return {
        title: "Request Timeout",
        message: "The server took too long to respond.",
        suggestion: "This might be due to high traffic or a temporary server issue. Please try again."
      };
    }
    
    return {
      title: "Error Loading Data",
      message: error.message || "We encountered a problem while loading your data.",
      suggestion: "This could be due to a temporary issue. Try refreshing the page."
    };
  };
  
  const errorDetails = error ? getErrorDetails() : null;
  
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
      <div className="container px-4 pt-20 pb-16 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          {error ? (
            <>
              <div className="bg-red-500/10 dark:bg-red-900/20 p-4 rounded-full inline-flex mb-6">
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
              
              <h2 className="text-xl font-medium mb-3">{errorDetails?.title}</h2>
              
              <Alert variant="destructive" className="mb-6 text-left">
                <AlertTitle>Error Details</AlertTitle>
                <AlertDescription className="mt-2">
                  {errorDetails?.message}
                  {errorDetails?.suggestion && (
                    <p className="mt-2 text-sm">{errorDetails.suggestion}</p>
                  )}
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {errorDetails?.action ? (
                  <Button 
                    onClick={errorDetails.action.onClick}
                    className="gap-2"
                  >
                    {errorDetails.action.label}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleRetry}
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Try Again{retryCount > 0 ? ` (${retryCount})` : ""}</span>
                  </Button>
                )}
                
                {showBackButton && (
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/migrations')}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Return to Migrations List</span>
                  </Button>
                )}
                
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/')}
                  className="gap-2"
                >
                  <Home className="h-4 w-4" />
                  <span>Go Home</span>
                </Button>
              </div>
              
              {retryCount > 2 && (
                <div className="mt-6 text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                  <Info className="h-3 w-3" />
                  <span>Still having issues? Try clearing your browser cache or contacting support.</span>
                </div>
              )}
            </>
          ) : (
            <>
              <RefreshCw className="h-12 w-12 mx-auto mb-4 animate-spin text-brand-500" />
              <h2 className="text-xl font-medium">{loadingMessage}</h2>
              <p className="text-muted-foreground mt-2">
                This may take a few moments...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingFallback;
