
import { WizardStep } from "./types";
import { CheckCircle, ArrowRight, ArrowLeft, Database, FileCode, FileCheck, Settings } from "lucide-react";
import React from "react";

// Create icon elements with a helper function instead of JSX
const createIcon = (Icon: any) => {
  return {
    component: Icon,
    props: { size: 24 }
  };
};

// Define wizard steps with icons
export const wizardSteps: WizardStep[] = [
  {
    id: "company",
    title: "Company Info",
    description: "Basic company information",
    icon: createIcon(Settings)
  },
  {
    id: "source",
    title: "Source CRM",
    description: "Configure your current CRM",
    icon: createIcon(Database)
  },
  {
    id: "destination",
    title: "Destination CRM",
    description: "Setup your new CRM",
    icon: createIcon(FileCode)
  },
  {
    id: "data",
    title: "Data Selection",
    description: "Choose what to migrate",
    icon: createIcon(FileCheck)
  },
  {
    id: "confirmation",
    title: "Confirmation",
    description: "Review and confirm",
    icon: createIcon(CheckCircle)
  }
];
