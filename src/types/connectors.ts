
export type ConnectorCategory = 
  | "crm" 
  | "marketing" 
  | "communication" 
  | "analytics" 
  | "productivity" 
  | "payment" 
  | "storage" 
  | "custom";

export interface ConnectorFeature {
  id: string;
  name: string;
  description: string;
}

export interface Connector {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  category: ConnectorCategory;
  popular: boolean;
  features: ConnectorFeature[];
  useCases: string[];
  setupComplexity: "simple" | "moderate" | "complex";
  documentationUrl: string;
  apiVersion?: string;
}
