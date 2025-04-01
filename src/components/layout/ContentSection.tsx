
import React from "react";
import { cn } from "@/lib/utils";

interface ContentSectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  centered?: boolean;
  id?: string;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  children,
  className,
  title,
  description,
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
        "container px-4 md:px-6",
        centered && "text-center"
      )}>
        {(title || description) && (
          <div className={cn("mx-auto mb-10", centered && "max-w-3xl")}>
            {title && (
              <h2 className="section-title font-semibold tracking-tight">{title}</h2>
            )}
            {description && (
              <p className="text-muted-foreground mt-3">{description}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default ContentSection;
