
import React from "react";
import { AlertCircle } from "lucide-react";

type ErrorStatusProps = {
  errorMessage?: string;
};

const ErrorStatus = ({ errorMessage }: ErrorStatusProps) => {
  return (
    <div className="flex items-center space-x-2 text-red-500">
      <AlertCircle size={18} className="animate-pulse" />
      <div>
        <h4 className="font-medium">Migration Error</h4>
        <p className="text-sm text-red-400">
          {errorMessage || "An error occurred during migration. Please try again."}
        </p>
      </div>
    </div>
  );
};

export default ErrorStatus;
