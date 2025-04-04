
import React from "react";
import { AlertCircle } from "lucide-react";

type ErrorStatusProps = {
  errorMessage?: string;
};

const ErrorStatus = ({ errorMessage }: ErrorStatusProps) => {
  // Provide a more friendly error message for common errors
  const displayMessage = () => {
    if (!errorMessage) {
      return "An error occurred during migration. Please try again.";
    }
    
    if (errorMessage.includes("Edge Function returned a non-2xx status code") || 
        errorMessage.includes("401") || 
        errorMessage.includes("Unauthorized")) {
      return "Authentication error with migration service. Don't worry, this is expected in the demo environment.";
    }
    
    if (errorMessage.includes("network") || 
        errorMessage.includes("failed to fetch") || 
        errorMessage.includes("connection")) {
      return "Network connection issue. Please check your internet connection and try again.";
    }
    
    return errorMessage;
  };
  
  return (
    <div className="flex items-center space-x-2 text-red-500">
      <AlertCircle size={18} className="animate-pulse" />
      <div>
        <h4 className="font-medium">Migration Error</h4>
        <p className="text-sm text-red-400">
          {displayMessage()}
        </p>
      </div>
    </div>
  );
};

export default ErrorStatus;
