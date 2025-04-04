
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface ResourceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  linkHref?: string;
  linkText?: string;
  children?: React.ReactNode;
}

const ResourceCard = ({
  icon: Icon,
  title,
  description,
  linkHref,
  linkText,
  children,
}: ResourceCardProps) => {
  // Check if this is an internal link (doesn't start with http)
  const isInternalLink = linkHref && !linkHref.startsWith('http');
  
  return (
    <Card className="border border-border shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Icon className="h-5 w-5 text-brand-500" />
          {title}
        </h3>
        <p className="text-muted-foreground mb-4">
          {description}
        </p>
        {linkHref && linkText && (
          <>
            {isInternalLink ? (
              <Button variant="outline" asChild>
                <Link to={linkHref}>{linkText}</Link>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <a href={linkHref}>{linkText}</a>
              </Button>
            )}
          </>
        )}
        {children}
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
