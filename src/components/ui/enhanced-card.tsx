
import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "glass" | "gradient";
  hover?: boolean;
  glow?: boolean;
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, variant = "default", hover = true, glow = false, ...props }, ref) => {
    const variants = {
      default: "bg-card border-border",
      elevated: "bg-card border-border shadow-lg",
      glass: "bg-card/80 backdrop-blur-sm border-border/50",
      gradient: "bg-gradient-to-br from-card via-card to-card/90 border-border"
    };

    return (
      <Card
        ref={ref}
        className={cn(
          "transition-all duration-300",
          variants[variant],
          hover && "hover:shadow-xl hover:-translate-y-1 hover:border-primary/20",
          glow && "hover:shadow-glow-primary",
          className
        )}
        {...props}
      />
    );
  }
);
EnhancedCard.displayName = "EnhancedCard";

export { EnhancedCard, CardContent, CardDescription, CardHeader, CardTitle };
