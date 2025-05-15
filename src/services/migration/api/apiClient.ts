
// API client for making requests to external services

/**
 * Base client for making API requests
 */
export const apiClient = {
  /**
   * Make a GET request to the API
   */
  get: async (url: string, headers?: Record<string, string>) => {
    try {
      const response = await fetch(url, { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("API client error:", error);
      throw error;
    }
  },
  
  /**
   * Make a POST request to the API
   */
  post: async (url: string, data: any, headers?: Record<string, string>) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("API client error:", error);
      throw error;
    }
  }
};
