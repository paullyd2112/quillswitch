
import { CalculatorInputs, SavingsResults } from "./types";

export const calculateSavings = (inputs: CalculatorInputs): SavingsResults => {
  const HOURS_PER_WEEK_PER_PERSON = 10;
  const QUILLSWITCH_PLAN_COST = 1999;
  const QUILLSWITCH_INTERNAL_HOURS = 16; // More realistic: 2 days of setup, review, and testing
  const WEEKS_PER_MONTH = 4.33; // More accurate monthly conversion
  const QUILLSWITCH_TIMELINE_WEEKS = 0.5; // More realistic: 2-3 days for complete migration

  // Manual migration costs
  const manualConsultantCost = inputs.useConsultant 
    ? inputs.consultantRate * inputs.consultantHours 
    : 0;

  const manualInternalStaffTotalHours = inputs.internalStaff * (inputs.migrationWeeks * HOURS_PER_WEEK_PER_PERSON);
  const manualInternalStaffCost = manualInternalStaffTotalHours * inputs.internalStaffRate;

  // CRM costs during manual migration period
  // During migration, you're paying for BOTH old and new CRM
  const manualOldCrmCost = (inputs.oldCrmCost / WEEKS_PER_MONTH) * inputs.migrationWeeks;
  const manualNewCrmCost = (inputs.newCrmCost / WEEKS_PER_MONTH) * inputs.migrationWeeks;

  const totalManualCost = manualConsultantCost + manualInternalStaffCost + manualOldCrmCost + manualNewCrmCost;

  // QuillSwitch costs
  const quillSwitchInternalCost = QUILLSWITCH_INTERNAL_HOURS * inputs.internalStaffRate;
  
  // CRM costs during QuillSwitch migration (much shorter period)
  const quillSwitchOldCrmCost = (inputs.oldCrmCost / WEEKS_PER_MONTH) * QUILLSWITCH_TIMELINE_WEEKS;
  const quillSwitchNewCrmCost = (inputs.newCrmCost / WEEKS_PER_MONTH) * QUILLSWITCH_TIMELINE_WEEKS;
  
  const quillSwitchCost = QUILLSWITCH_PLAN_COST + quillSwitchInternalCost + quillSwitchOldCrmCost + quillSwitchNewCrmCost;

  // Calculate savings and benefits
  const totalSavings = totalManualCost - quillSwitchCost;
  const weeksSaved = Math.max(0, inputs.migrationWeeks - QUILLSWITCH_TIMELINE_WEEKS);
  const hoursSaved = Math.max(0, manualInternalStaffTotalHours - QUILLSWITCH_INTERNAL_HOURS);
  const monthlyCrmSavings = Math.max(0, inputs.oldCrmCost - inputs.newCrmCost);

  return {
    manualConsultantCost,
    manualInternalStaffCost,
    wastedOldCrmCost: manualOldCrmCost,
    newCrmCostDuringMigration: manualNewCrmCost,
    totalManualCost,
    quillSwitchCost,
    totalSavings,
    weeksSaved,
    hoursSaved,
    monthlyCrmSavings,
  };
};
