
import { crmSystems } from "./crmSystems";
import { salesEngagementTools } from "./salesEngagementTools";
import { marketingTools } from "./marketingTools";
import { supportTools } from "./supportTools";
import { productivityTools } from "./productivityTools";
import { analyticsTools } from "./analyticsTools";
import { financeTools } from "./financeTools";
import { dataEnrichmentTools } from "./dataEnrichmentTools";
import { eSignatureTools } from "./eSignatureTools";
import { connectivityTools } from "./connectivityTools";
import { SystemConfig } from "../types/connectionTypes";

// Combine all related tools into a single array
export const relatedApps: SystemConfig[] = [
  ...salesEngagementTools,
  ...marketingTools,
  ...supportTools,
  ...productivityTools,
  ...analyticsTools,
  ...financeTools,
  ...dataEnrichmentTools,
  ...eSignatureTools,
  ...connectivityTools
];

// Export everything for direct access
export {
  crmSystems,
  salesEngagementTools,
  marketingTools,
  supportTools,
  productivityTools,
  analyticsTools,
  financeTools,
  dataEnrichmentTools,
  eSignatureTools,
  connectivityTools
};

// Re-export types
export type { SystemConfig } from "../types/connectionTypes";
export type { SystemCategory } from "../types/connectionTypes";
