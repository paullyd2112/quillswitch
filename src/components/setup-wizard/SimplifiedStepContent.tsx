
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SimplifiedStepContentProps {
  title: string;
  description: string;
  helpText?: string;
  onNext: () => void;
  onPrevious?: () => void;
  nextLabel?: string;
  previousLabel?: string;
  disableNext?: boolean;
  children: React.ReactNode;
}

const SimplifiedStepContent: React.FC<SimplifiedStepContentProps> = ({
  title,
  description,
  helpText,
  onNext,
  onPrevious,
  nextLabel = "Continue",
  previousLabel = "Back",
  disableNext = false,
  children,
}) => {
  return (
    <Card className="border border-border/40 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {helpText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">{helpText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-muted/20 py-4">
        {onPrevious ? (
          <Button 
            variant="outline" 
            onClick={onPrevious}
          >
            {previousLabel}
          </Button>
        ) : (
          <div></div> // Empty div to maintain the space
        )}
        <Button 
          onClick={onNext} 
          disabled={disableNext}
        >
          {nextLabel}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SimplifiedStepContent;
