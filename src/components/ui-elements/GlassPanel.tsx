
import React from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  intensity?: "light" | "medium" | "heavy";
  hover?: boolean;
}

const GlassPanel: React.FC<GlassPanelProps> = ({ 
  children, 
  className, 
  intensity = "medium",
  hover = true
}) => {
  const intensityClasses = {
    light: "bg-white/5 backdrop-blur-sm border-white/10",
    medium: "bg-white/10 backdrop-blur-md border-white/20",
    heavy: "bg-white/20 backdrop-blur-lg border-white/30"
  };

  return (
    <div 
      className={cn(
        "rounded-lg border transition-all duration-300",
        intensityClasses[intensity],
        hover && "hover:bg-white/15 hover:border-white/30",
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassPanel;
