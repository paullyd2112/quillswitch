
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
};

const useToast = () => {
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

    if (variant === "destructive") {
      return sonnerToast.error(title, {
        description,
        ...toastOptions,
      });
    }

    if (variant === "success") {
      return sonnerToast.success(title, {
        description,
        ...toastOptions,
      });
    }

    return sonnerToast(title, {
      description,
      ...toastOptions,
    });
  };

  return { toast };
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
