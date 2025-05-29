
import { CalculatorInputs, SavingsResults } from "./types";

export const calculateSavings = (inputs: CalculatorInputs): SavingsResults => {
  const INTERNAL_HOURLY_RATE = 75;
  const HOURS_PER_WEEK_PER_PERSON = 10;
  const QUILLSWITCH_PLAN_COST = 1999;
  const QUILLSWITCH_INTERNAL_HOURS = 8;
  const WEEKS_PER_MONTH = 4.33;
  const QUILLSWITCH_TIMELINE_WEEKS = 0.2; // 1 day = 0.2 weeks

  const manualConsultantCost = inputs.useConsultant 
    ? inputs.consultantRate * inputs.consultantHours 
    : 0;

  const manualInternalStaffTotalHours = inputs.internalStaff * (inputs.migrationWeeks * HOURS_PER_WEEK_PER_PERSON);
  const manualInternalStaffCost = manualInternalStaffTotalHours * INTERNAL_HOURLY_RATE;

  // Old CRM costs during the entire migration period
  const wastedOldCrmCost = (inputs.oldCrmCost / WEEKS_PER_MONTH) * inputs.migrationWeeks;
  
  // New CRM costs during migration (they still need to pay for the new CRM during setup)
  const newCrmCostDuringMigration = (inputs.newCrmCost / WEEKS_PER_MONTH) * inputs.migrationWeeks;

  const totalManualCost = manualConsultantCost + manualInternalStaffCost + wastedOldCrmCost + newCrmCostDuringMigration;

  const quillSwitchInternalCost = QUILLSWITCH_INTERNAL_HOURS * INTERNAL_HOURLY_RATE;
  const quillSwitchOldCrmCost = (inputs.oldCrmCost / WEEKS_PER_MONTH) * QUILLSWITCH_TIMELINE_WEEKS;
  const quillSwitchNewCrmCost = (inputs.newCrmCost / WEEKS_PER_MONTH) * QUILLSWITCH_TIMELINE_WEEKS;
  const quillSwitchCost = QUILLSWITCH_PLAN_COST + quillSwitchInternalCost + quillSwitchOldCrmCost + quillSwitchNewCrmCost;

  const totalSavings = totalManualCost - quillSwitchCost;
  const weeksSaved = inputs.migrationWeeks - QUILLSWITCH_TIMELINE_WEEKS;
  const hoursSaved = manualInternalStaffTotalHours - QUILLSWITCH_INTERNAL_HOURS;
  const monthlyCrmSavings = inputs.oldCrmCost - inputs.newCrmCost;

  return {
    manualConsultantCost,
    manualInternalStaffCost,
    wastedOldCrmCost,
    newCrmCostDuringMigration,
    totalManualCost,
    quillSwitchCost,
    totalSavings,
    weeksSaved,
    hoursSaved,
    monthlyCrmSavings,
  };
};
