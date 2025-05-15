
// Re-export from modular API client implementation
import { apiClient, ApiClient } from './api/apiClient';

// Export the singleton instance
export { apiClient };

// Export the ApiClient class for dependency injection or testing
export type { ApiClient };
