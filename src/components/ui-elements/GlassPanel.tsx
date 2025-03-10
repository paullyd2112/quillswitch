
import React from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  intensity?: "light" | "medium" | "heavy";
  border?: boolean;
  hover?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className,
  intensity = "medium",
  border = true,
  hover = false,
  ...props
}) => {
  const getIntensityClass = () => {
    switch (intensity) {
      case "light":
        return "bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm";
      case "heavy":
        return "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl";
      default:
        return "bg-white/60 dark:bg-slate-900/60 backdrop-blur-md";
    }
  };

  return (
    <div
      className={cn(
        getIntensityClass(),
        border && "border border-white/20 dark:border-slate-700/20",
        hover && "transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
        "rounded-xl shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassPanel;
