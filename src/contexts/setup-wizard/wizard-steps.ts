
import { WizardStep } from "./types";
import { Building2, Database, Target, CheckCircle } from "lucide-react";

// Create icon elements with a helper function instead of JSX
const createIcon = (Icon: any) => {
  return {
    component: Icon,
    props: { size: 24 }
  };
};

// Define wizard steps with minimal number - only 4 steps
export const wizardSteps: WizardStep[] = [
  {
    id: "company",
    title: "Company Info",
    description: "Basic company details",
    icon: createIcon(Building2)
  },
  {
    id: "source",
    title: "Source CRM",
    description: "Your current CRM system",
    icon: createIcon(Database)
  },
  {
    id: "destination",
    title: "Target CRM",
    description: "Your destination CRM",
    icon: createIcon(Target)
  },
  {
    id: "review",
    title: "Review",
    description: "Confirm your setup",
    icon: createIcon(CheckCircle)
  }
];
