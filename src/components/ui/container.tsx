
import { cn } from "@/lib/utils";

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export function Container({ 
  className, 
  children, 
  size = "2xl" 
}: ContainerProps) {
  const sizeClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    "full": "max-w-full",
  };
  
  return (
    <div className={cn(
      "container mx-auto px-4 md:px-6", 
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
}
