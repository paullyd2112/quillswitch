
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Key } from 'lucide-react';

interface ErrorDisplayProps {
  errorMessage: string | null;
  errorType: 'api_key' | 'general' | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errorMessage, errorType }) => {
  if (!errorMessage) return null;
  
  return (
    <Alert 
      variant="destructive" 
      className={`mb-6 ${errorType === 'api_key' ? 'border-amber-500 dark:border-amber-700' : ''}`}
    >
      {errorType === 'api_key' ? (
        <Key className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      <AlertTitle>
        {errorType === 'api_key' ? 'API Key Error' : 'Error'}
      </AlertTitle>
      <AlertDescription>{errorMessage}</AlertDescription>
      {errorType === 'api_key' && (
        <div className="mt-2 text-sm">
          Please verify your API credentials in the Settings page or contact support for assistance.
        </div>
      )}
    </Alert>
  );
};

export default ErrorDisplay;
