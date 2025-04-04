
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { MigrationStatus } from '../types';

type UseMigrationErrorReturn = {
  errorMessage: string | undefined;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
  handleMigrationError: (error: unknown) => void;
  resetError: () => void;
};

/**
 * Hook to manage migration error states and error handling
 */
export const useMigrationError = (): UseMigrationErrorReturn => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  
  // Handle migration errors
  const handleMigrationError = (error: unknown) => {
    console.error("Migration error:", error);
    const message = error instanceof Error ? error.message : "Failed to start migration";
    setErrorMessage(message);
    
    toast({
      title: "Migration Error",
      description: "Failed to start migration. Please try again.",
      variant: "destructive"
    });
  };
  
  // Reset error state
  const resetError = () => {
    setErrorMessage(undefined);
  };
  
  return {
    errorMessage,
    setErrorMessage,
    handleMigrationError,
    resetError
  };
};
