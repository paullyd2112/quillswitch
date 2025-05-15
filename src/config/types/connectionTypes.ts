
import { ReactNode } from "react";

export type SystemCategory = 
  | "crm" 
  | "sales-engagement" 
  | "marketing-automation" 
  | "support" 
  | "productivity" 
  | "analytics" 
  | "finance" 
  | "data-enrichment" 
  | "e-signature" 
  | "connectivity";

export interface SystemConfig {
  id: string;
  name: string;
  description: string;
  icon?: ReactNode;
  authType: 'oauth' | 'api'; // Required field that specifies primary auth method
  connectionType: 'source' | 'destination' | 'related';
  category?: SystemCategory;
  popular?: boolean;
  apiKeyHelp?: string;
  connectionInstructions?: string;
  permissions?: string[];
  docsUrl?: string;
}
