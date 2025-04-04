
import { MigrationStep } from './types';

export const initialMigrationSteps: MigrationStep[] = [
  { name: "Contacts", status: 'pending', progress: 0, recordSize: 5 }, // 5KB per record
  { name: "Opportunities & Deals", status: 'pending', progress: 0, recordSize: 8 }, // 8KB per record
  { name: "Activities & Tasks", status: 'pending', progress: 0, recordSize: 3 }, // 3KB per record
  { name: "Cases & Tickets", status: 'pending', progress: 0, recordSize: 10 }, // 10KB per record
  { name: "Accounts & Companies", status: 'pending', progress: 0, recordSize: 15 }, // 15KB per record
  { name: "Custom Objects", status: 'pending', progress: 0, recordSize: 20 }, // 20KB per record
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
