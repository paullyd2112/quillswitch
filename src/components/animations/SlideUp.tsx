
import React from "react";
import { cn } from "@/lib/utils";

interface SlideUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: "none" | "100" | "200" | "300" | "400" | "500";
  staggerChildren?: boolean;
  staggerDelay?: number;
}

export const SlideUp: React.FC<SlideUpProps> = ({
  children,
  className,
  delay = "none",
  staggerChildren = false,
  staggerDelay = 100,
}) => {
  const getDelayClass = () => {
    if (delay === "none") return "";
    return `delay-${delay}`;
  };

  // If we're staggering children, wrap each child in its own animation
  if (staggerChildren && React.Children.count(children) > 0) {
    return (
      <div className={className}>
        {React.Children.map(children, (child, index) => (
          <div
            className={cn(
              "opacity-0 animate-fade-up",
              index > 0 ? "style-delay" : getDelayClass()
            )}
            style={
              index > 0
                ? { 
                    animationDelay: `${
                      parseInt(delay === "none" ? "0" : delay) + index * staggerDelay
                    }ms` 
                  }
                : {}
            }
          >
            {child}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "opacity-0 animate-fade-up",
        getDelayClass(),
        className
      )}
    >
      {children}
    </div>
  );
};

export default SlideUp;
