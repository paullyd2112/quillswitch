
import { WizardStep } from "./types";
import { CheckCircle, ArrowRight, ArrowLeft, Database, FileCode, FileCheck, Settings } from "lucide-react";
import React from "react";

// Define wizard steps with icons
export const wizardSteps: WizardStep[] = [
  {
    id: "company",
    title: "Company Info",
    description: "Basic company information",
    icon: <Settings size={24} />
  },
  {
    id: "source",
    title: "Source CRM",
    description: "Configure your current CRM",
    icon: <Database size={24} />
  },
  {
    id: "destination",
    title: "Destination CRM",
    description: "Setup your new CRM",
    icon: <FileCode size={24} />
  },
  {
    id: "data",
    title: "Data Selection",
    description: "Choose what to migrate",
    icon: <FileCheck size={24} />
  },
  {
    id: "confirmation",
    title: "Confirmation",
    description: "Review and confirm",
    icon: <CheckCircle size={24} />
  }
];
