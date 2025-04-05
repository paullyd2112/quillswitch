
import { CrmSource } from "../MultiSourceSelection";
import { formatTimeRemaining } from "@/components/home/migration-demo/utils/format-utils";

export const calculateTotalRecords = (
  sources: CrmSource[],
  recordType: keyof CrmSource['recordCounts']
): number => {
  return sources
    .filter(source => source.selected)
    .reduce((total, source) => total + source.recordCounts[recordType], 0);
};

export const calculateMigrationTimeEstimate = (
  sources: CrmSource[],
  totalConcurrency: number
) => {
  const selectedSources = sources.filter(source => source.selected);
  
  if (selectedSources.length === 0) {
    return {
      seconds: 0,
      formatted: '0s'
    };
  }
  
  // Base processing rates (records per second) for different object types and complexity
  const baseRates = {
    contact: { simple: 50, medium: 30, complex: 15 },
    account: { simple: 40, medium: 20, complex: 10 },
    opportunity: { simple: 30, medium: 15, complex: 7 },
    custom: { simple: 35, medium: 18, complex: 8 }
  };
  
  // Calculate total duration for each source
  let totalDuration = 0;
  
  selectedSources.forEach(source => {
    const complexity = source.complexity;
    
    // Calculate base duration for each object type in this source
    const contactDuration = source.recordCounts.contacts / baseRates.contact[complexity];
    const accountDuration = source.recordCounts.accounts / baseRates.account[complexity];
    const opportunityDuration = source.recordCounts.opportunities / baseRates.opportunity[complexity];
    const customDuration = source.recordCounts.customObjects / baseRates.custom[complexity];
    
    // Add this source's duration to the total
    totalDuration += contactDuration + accountDuration + opportunityDuration + customDuration;
  });
  
  // Apply concurrency factor (simplified estimation)
  // We'll use the average concurrency as a divisor
  const avgConcurrency = totalConcurrency / 4;
  const estimatedDuration = totalDuration / (avgConcurrency * (1 + (selectedSources.length > 1 ? 0.2 : 0)));
  
  // If multiple sources, add 20% overhead for cross-CRM coordination
  const adjustedDuration = selectedSources.length > 1 
    ? estimatedDuration * 1.2 
    : estimatedDuration;
  
  return {
    seconds: Math.round(adjustedDuration),
    formatted: formatTimeRemaining(Math.round(adjustedDuration))
  };
};

export const initialCrmSources: CrmSource[] = [
  {
    id: '1',
    name: 'Salesforce',
    type: 'salesforce',
    selected: true,
    recordCounts: {
      contacts: 20000,
      accounts: 5000,
      opportunities: 5000,
      customObjects: 2000
    },
    complexity: 'medium'
  },
  {
    id: '2',
    name: 'HubSpot',
    type: 'hubspot',
    selected: false,
    recordCounts: {
      contacts: 15000,
      accounts: 3000,
      opportunities: 2000,
      customObjects: 1000
    },
    complexity: 'medium'
  },
  {
    id: '3',
    name: 'Microsoft Dynamics',
    type: 'dynamics',
    selected: false,
    recordCounts: {
      contacts: 25000,
      accounts: 7000,
      opportunities: 6000,
      customObjects: 3000
    },
    complexity: 'complex'
  },
  {
    id: '4',
    name: 'Zoho CRM',
    type: 'zoho',
    selected: false,
    recordCounts: {
      contacts: 10000,
      accounts: 2000,
      opportunities: 1500,
      customObjects: 500
    },
    complexity: 'simple'
  },
  {
    id: '5',
    name: 'Pipedrive',
    type: 'pipedrive',
    selected: false,
    recordCounts: {
      contacts: 8000,
      accounts: 1500,
      opportunities: 1000,
      customObjects: 300
    },
    complexity: 'simple'
  }
];
