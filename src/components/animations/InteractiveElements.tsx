
import React from "react";
import { cn } from "@/lib/utils";

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  intensity?: "subtle" | "moderate" | "strong";
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  className,
  delay = 0,
  intensity = "moderate"
}) => {
  const getIntensityClass = () => {
    switch (intensity) {
      case "subtle":
        return "animate-float-subtle";
      case "strong":
        return "animate-float-strong";
      default:
        return "animate-float";
    }
  };

  return (
    <div 
      className={cn(getIntensityClass(), className)}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

interface PulseGlowProps {
  children: React.ReactNode;
  color?: "blue" | "purple" | "green" | "red";
  intensity?: "subtle" | "moderate" | "strong";
  className?: string;
}

export const PulseGlow: React.FC<PulseGlowProps> = ({
  children,
  color = "blue",
  intensity = "moderate",
  className
}) => {
  const getGlowClass = () => {
    const baseClasses = "relative";
    const colorMap = {
      blue: "before:bg-blue-500/20",
      purple: "before:bg-purple-500/20",
      green: "before:bg-green-500/20",
      red: "before:bg-red-500/20"
    };
    
    const intensityMap = {
      subtle: "before:animate-pulse-subtle",
      moderate: "before:animate-pulse",
      strong: "before:animate-pulse-strong"
    };

    return cn(
      baseClasses,
      "before:absolute before:-inset-1 before:rounded-xl before:blur",
      colorMap[color],
      intensityMap[intensity]
    );
  };

  return (
    <div className={cn(getGlowClass(), className)}>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

interface ShimmerTextProps {
  children: React.ReactNode;
  className?: string;
  speed?: "slow" | "normal" | "fast";
}

export const ShimmerText: React.FC<ShimmerTextProps> = ({
  children,
  className,
  speed = "normal"
}) => {
  const getSpeedClass = () => {
    switch (speed) {
      case "slow":
        return "animate-shimmer-slow";
      case "fast":
        return "animate-shimmer-fast";
      default:
        return "animate-shimmer";
    }
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <span className="relative z-10">{children}</span>
      <div className={cn(
        "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12",
        getSpeedClass()
      )} />
    </div>
  );
};
