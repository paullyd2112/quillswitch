
// Re-export all transfer functionality from focused modules
import { DEFAULT_BATCH_CONFIG, ENTERPRISE_BATCH_CONFIG, ENTERPRISE_COMPLEX_BATCH_CONFIG, ENTERPRISE_SIMPLE_BATCH_CONFIG } from "./types/transferTypes";
import { migrateContacts } from "./contactMigrationService";
import { migrateAccounts } from "./accountMigrationService";
import { resumeTransfer } from "./recoveryService";
import { executeDataTransfer, executeStreamingDataTransfer } from "./core/batchProcessingService";
import { 
  migrateEnterpriseContacts, 
  estimateMigrationResources,
  testEnterpriseCapabilities 
} from "./enterpriseService";

// Export core types
export type { BatchConfig, TransferProgress } from "./types/transferTypes";
export { 
  DEFAULT_BATCH_CONFIG,
  ENTERPRISE_BATCH_CONFIG,
  ENTERPRISE_COMPLEX_BATCH_CONFIG,
  ENTERPRISE_SIMPLE_BATCH_CONFIG
};

// Export core functionality
export { executeDataTransfer, executeStreamingDataTransfer };

// Export migration services
export { migrateContacts, migrateAccounts, resumeTransfer };

// Export enterprise capability services
export { 
  migrateEnterpriseContacts,
  estimateMigrationResources,
  testEnterpriseCapabilities
};
