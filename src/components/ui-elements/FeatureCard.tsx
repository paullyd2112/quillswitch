
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
        "feature-card",
        onClick && "cursor-pointer hover:shadow-lg",
        className
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "icon-container",
          iconClassName
        )}
      >
        {icon}
      </div>
      <h3 className="text-lg mb-1 font-medium">{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default FeatureCard;
