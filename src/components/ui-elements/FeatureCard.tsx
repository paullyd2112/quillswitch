
import React from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  iconClassName?: string;
  onClick?: () => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  className,
  iconClassName,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "glass-panel p-6 rounded-xl transition-all duration-300",
        onClick && "cursor-pointer hover:shadow-lg hover:scale-[1.02]",
        "hover:shadow-[0_0_25px_rgba(12,140,227,0.15)] dark:hover:shadow-[0_0_25px_rgba(12,140,227,0.25)] border border-white/10 dark:border-slate-700/30",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start">
        <div
          className={cn(
            "rounded-full p-3 bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 transition-all duration-300",
            "hover:shadow-[0_0_15px_rgba(12,140,227,0.4)] dark:hover:shadow-[0_0_15px_rgba(12,140,227,0.4)]",
            iconClassName
          )}
        >
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="font-medium text-lg mb-1">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
