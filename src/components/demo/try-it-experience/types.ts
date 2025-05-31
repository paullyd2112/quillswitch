
export interface CrmSystem {
  id: string;
  name: string;
  logo: string;
  isConnected: boolean;
}

export interface DataType {
  id: string;
  name: string;
  count: number;
  selected: boolean;
}

export interface MigrationStats {
  recordsMigrated: number;
  recordsPerSecond: number;
  timeElapsed: number;
}

export type TabType = "connect" | "select" | "map" | "validate" | "migrate";
