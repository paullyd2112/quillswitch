
import React from "react";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: "none" | "100" | "200" | "300" | "400" | "500";
  duration?: "fast" | "normal" | "slow";
  direction?: "up" | "none";
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  className,
  delay = "none",
  duration = "normal",
  direction = "none",
}) => {
  const getAnimationClass = () => {
    if (direction === "up") return "animate-fade-up";
    return "animate-fade-in";
  };

  const getDurationClass = () => {
    switch (duration) {
      case "fast":
        return "duration-300";
      case "slow":
        return "duration-700";
      default:
        return "duration-500";
    }
  };

  const getDelayClass = () => {
    if (delay === "none") return "";
    return `delay-${delay}`;
  };

  return (
    <div
      className={cn(
        "opacity-0",
        getAnimationClass(),
        getDurationClass(),
        getDelayClass(),
        className
      )}
    >
      {children}
    </div>
  );
};

export default FadeIn;
