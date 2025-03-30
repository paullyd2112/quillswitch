
import { 
  toast as sonnerToast, 
  type Toast as SonnerToast
} from "sonner";
import { 
  type ToastActionElement, 
  type ToastProps 
} from "@/components/ui/toast";

type ToastProps4 = ToastProps & {
  action?: ToastActionElement;
  description?: React.ReactNode;
};

const useToast = () => {
  const toast = ({ title, description, variant = "default", action }: ToastProps4) => {
    const options: SonnerToast = {
      className: variant === "destructive" ? "destructive" : undefined,
      description,
      action,
    };
    
    sonnerToast(title, options);
  };

  return { toast };
};

// This is the toast function from the shadcn/ui toast component
// It's provided for backward compatibility, but we are using sonner for toasts
const toast = ({ title, description, variant = "default", action }: ToastProps4) => {
  const options: SonnerToast = {
    className: variant === "destructive" ? "destructive" : undefined,
    description,
    action,
  };
  
  sonnerToast(title, options);
};

export { useToast, toast };
