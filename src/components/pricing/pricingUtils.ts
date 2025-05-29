
export type PricingTier = "essentials" | "pro";

export interface PricingInput {
  recordCount: number;
  integrationCount: number;
  transformationCount: number;
  includeValidation: boolean;
  includeRollback: boolean;
  tier: PricingTier;
}

export interface PricingDetails {
  recordsCost: number;
  transformationsCost: number;
  integrationsCost: number;
  validationCost: number;
  rollbackCost: number;
  total: number;
  perRecordRate: number;
  transformationRate: number;
  integrationRate: number;
  validationRate: number;
  rollbackRate: number;
  tierLimit: number;
  tierPrice: number;
}

interface TierPricing {
  basePrice: number;
  recordLimit: number;
  perRecordRate: number;
  transformationRate: number;
  integrationRate: number;
  validationRate: number;
  rollbackRate: number;
}

const tierPricingMap: Record<PricingTier, TierPricing> = {
  essentials: {
    basePrice: 1999,
    recordLimit: 50000,
    perRecordRate: 0,
    transformationRate: 5,
    integrationRate: 180,
    validationRate: 300,
    rollbackRate: 300
  },
  pro: {
    basePrice: 3999,
    recordLimit: 200000,
    perRecordRate: 0,
    transformationRate: 8,
    integrationRate: 280,
    validationRate: 600,
    rollbackRate: 600
  }
};

export const calculatePricing = (input: PricingInput): PricingDetails => {
  const pricing = tierPricingMap[input.tier];
  
  // Base tier price covers the records up to the limit
  const recordsCost = pricing.basePrice;
  const transformationsCost = input.transformationCount * pricing.transformationRate;
  const integrationsCost = input.integrationCount * pricing.integrationRate;
  const validationCost = input.includeValidation ? pricing.validationRate : 0;
  const rollbackCost = input.includeRollback ? pricing.rollbackRate : 0;
  
  const total = recordsCost + transformationsCost + integrationsCost + validationCost + rollbackCost;
  
  return {
    recordsCost,
    transformationsCost,
    integrationsCost,
    validationCost,
    rollbackCost,
    total,
    perRecordRate: pricing.perRecordRate,
    transformationRate: pricing.transformationRate,
    integrationRate: pricing.integrationRate,
    validationRate: pricing.validationRate,
    rollbackRate: pricing.rollbackRate,
    tierLimit: pricing.recordLimit,
    tierPrice: pricing.basePrice
  };
};

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
  if (recordCount <= 50000) return "essentials";
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
