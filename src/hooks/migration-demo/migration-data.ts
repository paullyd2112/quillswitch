
import { MigrationStep } from "./types";

export const initialMigrationSteps: MigrationStep[] = [
  { id: "step-1", name: "Contacts", status: "idle", progress: 0, recordSize: 15000 },
  { id: "step-2", name: "Opportunities & Deals", status: "idle", progress: 0, recordSize: 7500 },
  { id: "step-3", name: "Activities & Tasks", status: "idle", progress: 0, recordSize: 25000 },
  { id: "step-4", name: "Cases & Tickets", status: "idle", progress: 0, recordSize: 5000 },
  { id: "step-5", name: "Accounts & Companies", status: "idle", progress: 0, recordSize: 3000 },
  { id: "step-6", name: "Custom Objects", status: "idle", progress: 0, recordSize: 10000 }
];

// Get total records count for a specific step
export const getStepRecordCount = (stepName: string): number => {
  const stepMap: Record<string, number> = {
    "Contacts": 1500,
    "Opportunities & Deals": 750,
    "Activities & Tasks": 2500,
    "Cases & Tickets": 500,
    "Accounts & Companies": 300,
    "Custom Objects": 1000
  };
  
  return stepMap[stepName] || 500; // Default to 500 records if step not found
};

// Get total records count across all steps
export const getTotalRecords = (steps: MigrationStep[]): number => {
  return steps.reduce((acc, step) => acc + getStepRecordCount(step.name), 0);
};
