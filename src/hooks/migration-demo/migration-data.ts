
import { MigrationStep } from './types';

export const initialMigrationSteps: MigrationStep[] = [
  { id: 'step-1', name: "Contacts", status: 'idle', progress: 0, recordSize: 5 }, // 5KB per record
  { id: 'step-2', name: "Opportunities & Deals", status: 'idle', progress: 0, recordSize: 8 }, // 8KB per record
  { id: 'step-3', name: "Activities & Tasks", status: 'idle', progress: 0, recordSize: 3 }, // 3KB per record
  { id: 'step-4', name: "Cases & Tickets", status: 'idle', progress: 0, recordSize: 10 }, // 10KB per record
  { id: 'step-5', name: "Accounts & Companies", status: 'idle', progress: 0, recordSize: 15 }, // 15KB per record
  { id: 'step-6', name: "Custom Objects", status: 'idle', progress: 0, recordSize: 20 }, // 20KB per record
];

// Get total records count for a specific step
export const getStepRecordCount = (stepName: string): number => {
  if (stepName === "Contacts") return 1250;
  if (stepName === "Accounts & Companies") return 87;
  return 150; // Default for other steps
};

// Get total records count across all steps
export const getTotalRecords = (steps: MigrationStep[]): number => {
  return steps.reduce((acc, step) => acc + getStepRecordCount(step.name), 0);
};
