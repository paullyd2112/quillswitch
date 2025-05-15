
import { toast } from "sonner";

export const handleServiceError = (error: any, defaultMessage: string) => {
  console.error(`${defaultMessage}:`, error);
  
  const errorMessage = error.message || defaultMessage;
  
  toast.error(errorMessage);
  return null;
};

export const isUUID = (id: string): boolean => {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(id);
};
