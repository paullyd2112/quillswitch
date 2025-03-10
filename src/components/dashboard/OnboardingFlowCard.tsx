
import React from "react";
import { cn } from "@/lib/utils";
import GlassPanel from "../ui-elements/GlassPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Copy, Trash, Users, MoreHorizontal, ExternalLink } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import FadeIn from "../animations/FadeIn";

interface OnboardingFlowCardProps {
  flow: {
    id: string;
    title: string;
    description: string;
    status: "active" | "draft" | "archived";
    usagePercent: number;
    users: number;
    lastUpdated: string;
    thumbnail?: string;
  };
  className?: string;
  delay?: "none" | "100" | "200" | "300" | "400" | "500";
}

export const OnboardingFlowCard: React.FC<OnboardingFlowCardProps> = ({
  flow,
  className,
  delay = "none",
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    }
  };

  return (
    <FadeIn delay={delay}>
      <GlassPanel
        className={cn("overflow-hidden hover:shadow-md transition-all duration-300", className)}
        hover
      >
        <div className="relative">
          {flow.thumbnail ? (
            <div 
              className="h-32 bg-cover bg-center" 
              style={{ backgroundImage: `url(${flow.thumbnail})` }}
            />
          ) : (
            <div className="h-32 bg-gradient-to-r from-brand-400/20 to-brand-600/20 flex items-center justify-center">
              <span className="text-brand-600 dark:text-brand-400 font-medium">No Preview Available</span>
            </div>
          )}
          <Badge
            className={cn(
              "absolute top-3 right-3 font-normal capitalize",
              getStatusColor(flow.status)
            )}
          >
            {flow.status}
          </Badge>
        </div>
        
        <div className="p-5">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium line-clamp-1">{flow.title}</h3>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal size={16} />
            </Button>
          </div>
          
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
            {flow.description}
          </p>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm">
              <div className="flex items-center">
                <Users size={16} className="mr-1.5 text-muted-foreground" />
                <span>{flow.users.toLocaleString()} users</span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">
              Updated {flow.lastUpdated}
            </span>
          </div>
          
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium">Usage</span>
              <span className="text-xs">{flow.usagePercent}%</span>
            </div>
            <Progress value={flow.usagePercent} className="h-1.5" />
          </div>
          
          <div className="flex items-center gap-2 mt-4">
            <Button variant="outline" size="sm" className="flex-1">
              <Edit size={14} className="mr-1" /> Edit
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Copy size={14} className="mr-1" /> Duplicate
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
              <Trash size={14} />
            </Button>
          </div>
        </div>
      </GlassPanel>
    </FadeIn>
  );
};

export default OnboardingFlowCard;
