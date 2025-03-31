
export type PricingTier = "quickStart" | "scaleUp" | "fullPower";

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
}

interface TierPricing {
  perRecordRate: number;
  transformationRate: number;
  integrationRate: number;
  validationRate: number;
  rollbackRate: number;
}

const tierPricingMap: Record<PricingTier, TierPricing> = {
  quickStart: {
    perRecordRate: 0.32,
    transformationRate: 5,
    integrationRate: 180,
    validationRate: 300,
    rollbackRate: 300
  },
  scaleUp: {
    perRecordRate: 0.24,
    transformationRate: 8,
    integrationRate: 280,
    validationRate: 600,
    rollbackRate: 600
  },
  fullPower: {
    perRecordRate: 0.18,
    transformationRate: 11,
    integrationRate: 420,
    validationRate: 1200,
    rollbackRate: 1200
  }
};

export const calculatePricing = (input: PricingInput): PricingDetails => {
  const pricing = tierPricingMap[input.tier];
  
  const recordsCost = input.recordCount * pricing.perRecordRate;
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
    rollbackRate: pricing.rollbackRate
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
