
// Re-export all migration services through this index file
// This provides backward compatibility with existing code while maintaining a clean structure

export { getProjectProgress } from './migration/projectService';
export { logUserActivity } from './migration/activityService';
export { createDefaultMigrationProject } from './migration/setupService';

// Project Service
export { 
  createMigrationProject, 
  getMigrationProjects, 
  getMigrationProject, 
  updateMigrationProject 
} from './migration/projectService';

// Stages Service
export { 
  getMigrationStages, 
  createMigrationStage, 
  updateMigrationStage 
} from './migration/stageService';

// Object Types Service
export { 
  getMigrationObjectTypes, 
  createMigrationObjectType, 
  updateMigrationObjectType 
} from './migration/objectTypeService';

// Field Mappings Service
export { 
  getFieldMappings,
  createFieldMapping,
  updateFieldMapping
} from './migration/fieldMappingService';

// Errors Service
export { 
  getMigrationErrors,
  createMigrationError,
  resolveError
} from './migration/errorService';

// Activities Service
export { 
  getUserActivities
} from './migration/activityService';
