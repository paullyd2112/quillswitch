
export type PricingTier = "essentials" | "pro";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(amount));
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const getTierForRecordCount = (recordCount: number): PricingTier => {
  if (recordCount <= 250000) return "essentials";
  return "pro";
};

export const getRecordCountEstimate = (selectedDataTypes: string[]): number => {
  // Base estimates for different data types and their typical sub-records
  const dataTypeEstimates: Record<string, { main: number; subRecords: number }> = {
    contacts: { main: 5000, subRecords: 4.5 }, // Each contact has ~4.5 activities, notes, etc.
    accounts: { main: 1000, subRecords: 6.2 }, // Companies tend to have more associated records
    opportunities: { main: 800, subRecords: 8.1 }, // Deals have many activities, line items, notes
    cases: { main: 600, subRecords: 5.3 }, // Support cases with updates, notes
    activities: { main: 0, subRecords: 0 }, // Already counted as sub-records above
    custom: { main: 2000, subRecords: 2.8 } // Custom objects with moderate associations
  };

  let totalEstimate = 0;

  selectedDataTypes.forEach(dataType => {
    const estimate = dataTypeEstimates[dataType];
    if (estimate) {
      const mainRecords = estimate.main;
      const totalSubRecords = mainRecords * estimate.subRecords;
      totalEstimate += mainRecords + totalSubRecords;
    }
  });

  return Math.round(totalEstimate);
};
