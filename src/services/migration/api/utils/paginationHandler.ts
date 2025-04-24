
export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  metadata: {
    hasMore: boolean;
    nextCursor?: string;
    total?: number;
  };
}

export class PaginationHandler {
  static async fetchAll<T>(
    fetchPage: (params: PaginationParams) => Promise<PaginatedResponse<T>>,
    options: {
      initialParams?: PaginationParams;
      maxItems?: number;
      onProgress?: (items: T[], total: number) => void;
    } = {}
  ): Promise<T[]> {
    const {
      initialParams = { page: 1, limit: 50 },
      maxItems = Infinity,
      onProgress
    } = options;
    
    let allItems: T[] = [];
    let currentParams = { ...initialParams };
    
    while (true) {
      const response = await fetchPage(currentParams);
      allItems = [...allItems, ...response.data];
      
      if (onProgress) {
        onProgress(response.data, response.metadata.total || allItems.length);
      }
      
      if (!response.metadata.hasMore || allItems.length >= maxItems) {
        break;
      }
      
      if (response.metadata.nextCursor) {
        currentParams.cursor = response.metadata.nextCursor;
      } else if (currentParams.page) {
        currentParams.page++;
      }
    }
    
    return allItems.slice(0, maxItems);
  }
}
