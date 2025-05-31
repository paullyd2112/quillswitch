
import { MigrationStep } from "./types";

export const initialMigrationSteps: MigrationStep[] = [
  { id: "step-1", name: "Contacts", description: "Migrating contact records", status: "idle", progress: 0, recordSize: 8500 },
  { id: "step-2", name: "Opportunities & Deals", description: "Migrating opportunities and deals", status: "idle", progress: 0, recordSize: 3200 },
  { id: "step-3", name: "Activities & Tasks", description: "Migrating activities and tasks", status: "idle", progress: 0, recordSize: 4800 },
  { id: "step-4", name: "Accounts & Companies", description: "Migrating accounts and companies", status: "idle", progress: 0, recordSize: 2000 },
  { id: "step-5", name: "Custom Objects", description: "Migrating custom objects and fields", status: "idle", progress: 0, recordSize: 1500 }
];

// Get total records count for a specific step
export const getStepRecordCount = (stepName: string): number => {
  const stepMap: Record<string, number> = {
    "Contacts": 8500,
    "Opportunities & Deals": 3200,
    "Activities & Tasks": 4800,
    "Accounts & Companies": 2000,
    "Custom Objects": 1500
  };
  
  return stepMap[stepName] || 500; // Default to 500 records if step not found
};

// Get total records count across all steps
export const getTotalRecords = (steps: MigrationStep[]): number => {
  return steps.reduce((acc, step) => acc + getStepRecordCount(step.name), 0);
};
