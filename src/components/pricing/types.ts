
export interface CalculatorInputs {
  migrationWeeks: number;
  useConsultant: boolean;
  consultantRate: number;
  consultantHours: number;
  internalStaff: number;
  oldCrmCost: number;
  newCrmCost: number;
}

export interface SavingsResults {
  manualConsultantCost: number;
  manualInternalStaffCost: number;
  wastedOldCrmCost: number;
  newCrmCostDuringMigration: number;
  totalManualCost: number;
  quillSwitchCost: number;
  totalSavings: number;
  weeksSaved: number;
  hoursSaved: number;
  monthlyCrmSavings: number;
}
