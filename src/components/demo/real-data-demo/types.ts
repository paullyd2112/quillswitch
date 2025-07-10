export interface RealDataDemoProps {
  userEmail?: string;
}

export interface AccessInfo {
  canAccess: boolean;
  recordLimit?: number;
  remainingDemos?: number;
  reason?: string;
}

export interface ExtractedData {
  objectType: string;
  totalCount: number;
}

export interface Connection {
  id: string;
  name: string;
  type: string;
}

export interface DataTypeOption {
  id: string;
  name: string;
  icon: any;
  description: string;
}

export type DemoStep = "access" | "connect" | "configure" | "extract" | "results";