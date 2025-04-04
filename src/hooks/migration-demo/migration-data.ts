
import { MigrationStep } from "./types";

export const initialMigrationSteps: MigrationStep[] = [
  { id: "step-1", name: "Contacts", status: "idle", progress: 0, recordSize: 15000 },
  { id: "step-2", name: "Opportunities & Deals", status: "idle", progress: 0, recordSize: 7500 },
  { id: "step-3", name: "Activities & Tasks", status: "idle", progress: 0, recordSize: 25000 },
  { id: "step-4", name: "Cases & Tickets", status: "idle", progress: 0, recordSize: 5000 },
  { id: "step-5", name: "Accounts & Companies", status: "idle", progress: 0, recordSize: 3000 },
  { id: "step-6", name: "Custom Objects", status: "idle", progress: 0, recordSize: 10000 }
];
