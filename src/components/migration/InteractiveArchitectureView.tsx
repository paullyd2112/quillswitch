
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Info } from "lucide-react";
import CrmArchitectureDiagram from "./CrmArchitectureDiagram";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ArchitectureExplanation = {
  title: string;
  description: string;
  aspect: "integration" | "dataModel" | "sources" | "destinations" | "tools";
};

const architectureExplanations: ArchitectureExplanation[] = [
  {
    title: "Integration Engine",
    description: "The core migration system that handles secure data movement between CRMs with validation at every step.",
    aspect: "integration"
  },
  {
    title: "Universal Data Model",
    description: "Maps fields between different CRM systems using standardized schemas that preserve data relationships.",
    aspect: "dataModel"
  },
  {
    title: "Source CRM",
    description: "Your current CRM system from which data will be extracted. All configurations and customizations are analyzed.",
    aspect: "sources"
  },
  {
    title: "Target CRM",
    description: "The destination CRM where your data will be migrated to with full fidelity and relationship preservation.",
    aspect: "destinations"
  },
  {
    title: "Connected Tools",
    description: "External systems that integrate with your CRM. These connections will be maintained during and after migration.",
    aspect: "tools"
  }
];

interface InteractiveArchitectureViewProps {
  sourceCrm?: string;
  destinationCrm?: string;
  connectedTools?: Array<{
    name: string;
    category: "marketing" | "support" | "sales" | "analytics" | "other";
  }>;
}

const InteractiveArchitectureView: React.FC<InteractiveArchitectureViewProps> = ({
  sourceCrm = "Salesforce",
  destinationCrm = "HubSpot",
  connectedTools = []
}) => {
  const [activeExplanation, setActiveExplanation] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const handleMarkComplete = (aspect: string) => {
    if (!completedSteps.includes(aspect)) {
      setCompletedSteps([...completedSteps, aspect]);
    } else {
      setCompletedSteps(completedSteps.filter(step => step !== aspect));
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">CRM Migration Architecture</h2>
          <p className="text-muted-foreground">
            Visual representation of how your data will flow between systems while maintaining external integrations.
          </p>
        </div>

        <div className="mb-6">
          <CrmArchitectureDiagram
            sourceCrm={sourceCrm}
            destinationCrm={destinationCrm}
            connectedTools={connectedTools}
            className="mb-4"
          />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Architecture Breakdown</h3>
          {architectureExplanations.map((explanation) => (
            <div 
              key={explanation.aspect}
              className={`p-3 rounded-lg border flex items-center justify-between ${
                activeExplanation === explanation.aspect 
                ? "bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800/50" 
                : completedSteps.includes(explanation.aspect)
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50"
                : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800/50"
              }`}
            >
              <div className="flex-grow">
                <div className="flex items-center">
                  <h4 className="text-sm font-medium">{explanation.title}</h4>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                          <Info size={14} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm max-w-xs">{explanation.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {activeExplanation === explanation.aspect && (
                  <p className="text-xs text-muted-foreground mt-1">{explanation.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7"
                  onClick={() => setActiveExplanation(
                    activeExplanation === explanation.aspect ? null : explanation.aspect
                  )}
                >
                  {activeExplanation === explanation.aspect ? "Hide" : "Details"} <ArrowRight size={14} className="ml-1" />
                </Button>
                <Button
                  variant={completedSteps.includes(explanation.aspect) ? "default" : "outline"}
                  size="sm"
                  className={`h-7 ${completedSteps.includes(explanation.aspect) ? "bg-green-500 hover:bg-green-600" : ""}`}
                  onClick={() => handleMarkComplete(explanation.aspect)}
                >
                  {completedSteps.includes(explanation.aspect) ? (
                    <><Check size={14} className="mr-1" /> Completed</>
                  ) : (
                    "Mark Complete"
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveArchitectureView;
