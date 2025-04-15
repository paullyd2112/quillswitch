
import React from 'react';
import { RefreshCw, AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface LoadingFallbackProps {
  error?: Error | null;
  onRetry?: () => void;
  showBackButton?: boolean;
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({ error, onRetry, showBackButton = true }) => {
  const navigate = useNavigate();

  // Custom error messages for specific error types
  const getErrorDetails = () => {
    if (!error) return null;
    
    if (error.message.includes("not found") || error.message.includes("does not exist")) {
      return {
        title: "Migration Project Not Found",
        message: "The migration project you're trying to access doesn't exist or has been deleted.",
        suggestion: "Check the URL or go back to the migrations list."
      };
    }
    
    if (error.message.includes("permission") || error.message.includes("unauthorized")) {
      return {
        title: "Access Denied",
        message: "You don't have permission to access this migration project.",
        suggestion: "If you believe this is an error, try signing out and back in."
      };
    }
    
    if (error.message.includes("network") || error.message.includes("connection")) {
      return {
        title: "Network Error",
        message: "There was a problem connecting to the server.",
        suggestion: "Check your internet connection and try again."
      };
    }
    
    return {
      title: "Error Loading Migration Data",
      message: error.message || "We encountered a problem while loading your migration data.",
      suggestion: "This could be due to a temporary issue. Try refreshing the page."
    };
  };
  
  const errorDetails = error ? getErrorDetails() : null;
  
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
      <div className="container px-4 pt-32 pb-20 flex items-center justify-center">
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
                <Button 
                  onClick={handleRetry}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Try Again</span>
                </Button>
                
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
            </>
          ) : (
            <>
              <RefreshCw className="h-12 w-12 mx-auto mb-4 animate-spin text-brand-500" />
              <h2 className="text-xl font-medium">Loading migration data...</h2>
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
