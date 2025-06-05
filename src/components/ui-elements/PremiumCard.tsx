
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PremiumCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  glowEffect?: boolean;
  hoverEffect?: boolean;
  gradient?: boolean;
}

const PremiumCard: React.FC<PremiumCardProps> = ({
  title,
  description,
  children,
  className,
  glowEffect = false,
  hoverEffect = true,
  gradient = false
}) => {
  return (
    <div className={cn("relative group", className)}>
      {/* Glow effect */}
      {glowEffect && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
      
      <Card className={cn(
        "relative backdrop-blur-xl border-slate-700/50 shadow-2xl transition-all duration-300",
        gradient ? "bg-gradient-to-br from-slate-900/90 to-slate-800/80" : "bg-slate-900/80",
        hoverEffect && "hover:border-slate-600/60 hover:shadow-blue-500/10 hover:transform hover:-translate-y-1"
      )}>
        {(title || description) && (
          <CardHeader className="pb-4">
            {title && (
              <CardTitle className="text-xl font-semibold text-white flex items-center gap-3">
                {title}
              </CardTitle>
            )}
            {description && (
              <CardDescription className="text-slate-400 leading-relaxed">
                {description}
              </CardDescription>
            )}
          </CardHeader>
        )}
        
        <CardContent className="space-y-4">
          {children}
        </CardContent>
        
        {/* Subtle inner border highlight */}
        <div className="absolute inset-0 rounded-xl border border-white/5 pointer-events-none" />
      </Card>
    </div>
  );
};

export default PremiumCard;
