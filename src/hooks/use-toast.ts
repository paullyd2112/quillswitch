
import { 
  toast as sonnerToast, 
  type ToastT as SonnerToast
} from "sonner";
import { 
  type ToastActionElement, 
  type ToastProps 
} from "@/components/ui/toast";

type ToastProps4 = ToastProps & {
  action?: ToastActionElement;
  description?: React.ReactNode;
};

type Toast = {
  id: string;
  title: string;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
};

// In-memory store for toasts as we're using sonner which doesn't provide a way to get all toasts
const TOAST_LIMIT = 20;
const TOAST_REMOVE_DELAY = 1000;

const toasts: Toast[] = [];

const useToast = () => {
  const toast = ({ title, description, variant = "default", action }: ToastProps4) => {
    const id = crypto.randomUUID();
    const newToast = {
      id,
      title,
      description,
      variant,
      action
    };
    
    // Add toast to our local array
    toasts.push(newToast);
    
    // Limit the number of toasts
    if (toasts.length > TOAST_LIMIT) {
      toasts.shift();
    }
    
    const options: SonnerToast = {
      id,
      className: variant === "destructive" ? "destructive" : undefined,
      description,
      action,
    };
    
    sonnerToast(title, options);
    
    setTimeout(() => {
      const index = toasts.findIndex((t) => t.id === id);
      if (index !== -1) {
        toasts.splice(index, 1);
      }
    }, TOAST_REMOVE_DELAY);
  };

  return { toast, toasts: [...toasts] };
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
