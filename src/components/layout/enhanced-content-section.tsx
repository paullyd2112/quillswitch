
import React from "react";
import { cn } from "@/lib/utils";

interface EnhancedContentSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
  centered?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

const EnhancedContentSection: React.FC<EnhancedContentSectionProps> = ({
  title,
  description,
  children,
  className,
  headerAction,
  centered = false,
  maxWidth = "2xl"
}) => {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full"
  };

  return (
    <div className={cn("container mx-auto px-4 py-8", className)}>
      <div className={cn(
        "mx-auto",
        maxWidthClasses[maxWidth],
        centered && "text-center"
      )}>
        {(title || description || headerAction) && (
          <div className={cn(
            "mb-8",
            !centered && headerAction && "flex items-start justify-between"
          )}>
            <div className={cn(centered && "mx-auto")}>
              {title && (
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-lg text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            {headerAction && !centered && (
              <div className="ml-4">
                {headerAction}
              </div>
            )}
            {headerAction && centered && (
              <div className="mt-4">
                {headerAction}
              </div>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default EnhancedContentSection;
