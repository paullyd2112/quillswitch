
import React from "react";
import { cn } from "@/lib/utils";
import GlassPanel from "../ui-elements/GlassPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import FadeIn from "../animations/FadeIn";

interface OnboardingTemplateProps {
  template: {
    id: string;
    title: string;
    description: string;
    category: string;
    thumbnail?: string;
    isNew?: boolean;
  };
  className?: string;
  delay?: "none" | "100" | "200" | "300" | "400" | "500";
}

export const OnboardingTemplate: React.FC<OnboardingTemplateProps> = ({
  template,
  className,
  delay = "none",
}) => {
  return (
    <FadeIn delay={delay}>
      <GlassPanel
        className={cn("overflow-hidden group", className)}
        hover
      >
        <div className="relative">
          {template.thumbnail ? (
            <div 
              className="h-44 bg-cover bg-center transition-transform duration-300 group-hover:scale-105" 
              style={{ backgroundImage: `url(${template.thumbnail})` }}
            />
          ) : (
            <div className="h-44 bg-gradient-to-r from-brand-400/10 to-brand-600/10 flex items-center justify-center transition-colors duration-300 group-hover:from-brand-400/20 group-hover:to-brand-600/20">
              <span className="text-brand-600 dark:text-brand-400 font-medium">Preview Image</span>
            </div>
          )}
          
          {template.isNew && (
            <Badge
              className="absolute top-3 right-3 bg-brand-500 hover:bg-brand-500"
            >
              New
            </Badge>
          )}
          
          <Badge
            className="absolute bottom-3 left-3 bg-white/80 text-foreground hover:bg-white/90 dark:bg-slate-800/80 dark:hover:bg-slate-800/90"
          >
            {template.category}
          </Badge>
        </div>
        
        <div className="p-5">
          <h3 className="text-lg font-medium">{template.title}</h3>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
            {template.description}
          </p>
          
          <Button className="w-full mt-4 gap-1">
            <Plus size={16} /> Use Template
          </Button>
        </div>
      </GlassPanel>
    </FadeIn>
  );
};

export default OnboardingTemplate;
