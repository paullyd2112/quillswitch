
import React from "react";
import { cn } from "@/lib/utils";
import FadeIn from "../animations/FadeIn";

interface ContentSectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  fullWidth?: boolean;
  centered?: boolean;
  id?: string;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  children,
  className,
  title,
  description,
  fullWidth = false,
  centered = false,
  id,
}) => {
  return (
    <section
      id={id}
      className={cn(
        "py-12 md:py-16",
        className
      )}
    >
      <div className={cn(
        !fullWidth && "container px-4 md:px-6",
        centered && "text-center"
      )}>
        {(title || description) && (
          <div className={cn("mx-auto mb-10", centered && "max-w-3xl")}>
            {title && (
              <FadeIn delay="100">
                <h2 className={cn("section-title font-semibold tracking-tight")}>{title}</h2>
              </FadeIn>
            )}
            {description && (
              <FadeIn delay="200">
                <p className="text-muted-foreground mt-3">{description}</p>
              </FadeIn>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default ContentSection;
