
import { toast } from "@/components/ui/use-toast";

/**
 * Error handler for service functions
 * @param error The error that occurred
 * @param message A custom error message to display
 * @returns null
 */
export const handleServiceError = (error: any, message: string, silent: boolean = false): null => {
  if (!silent) {
    toast({
      title: message,
      description: error.message,
      variant: "destructive",
    });
  }
  console.error(`${message}:`, error);
  return null;
};
