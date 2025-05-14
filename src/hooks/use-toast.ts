
import { useState, useEffect } from "react";
import { toast as sonnerToast } from "sonner";

// Define types for toast items and props
type ToastProps = {
  id?: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
};

type Toast = ToastProps & {
  id: string;
};

// Create a store for toasts outside of the hook for persistence
let toasts: Toast[] = [];
let listeners: Array<() => void> = [];

const addToast = (toast: ToastProps) => {
  const id = toast.id || String(Math.random());
  const newToast = { ...toast, id };
  
  toasts = [...toasts, newToast];
  listeners.forEach(listener => listener());
  
  return id;
};

const dismissToast = (id: string) => {
  toasts = toasts.filter(t => t.id !== id);
  listeners.forEach(listener => listener());
};

// Hook to use toasts
const useToast = () => {
  const [localToasts, setLocalToasts] = useState<Toast[]>(toasts);
  
  useEffect(() => {
    const listener = () => {
      setLocalToasts([...toasts]);
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);
  
  const toast = ({
    title,
    description,
    variant = "default",
    duration = 5000,
    action,
  }: ToastProps) => {
    const toastOptions = {
      duration,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
    };

    let id;
    
    if (variant === "destructive") {
      id = sonnerToast.error(title, {
        description,
        ...toastOptions,
      });
    } else if (variant === "success") {
      id = sonnerToast.success(title, {
        description,
        ...toastOptions,
      });
    } else {
      id = sonnerToast(title, {
        description,
        ...toastOptions,
      });
    }
    
    // Add to our internal toast state for components that need to access all toasts
    addToast({
      id: String(id),
      title,
      description,
      variant,
      duration,
      action,
    });
    
    return id;
  };

  return {
    toast,
    toasts: localToasts,
    dismissToast: (id: string) => dismissToast(id),
  };
};

// Also export a simpler function for direct usage
const toast = ({
  title,
  description,
  variant = "default",
  duration = 5000,
  action,
}: ToastProps) => {
  return useToast().toast({
    title,
    description,
    variant,
    duration,
    action,
  });
};

export { useToast, toast };
export type { Toast, ToastProps };
