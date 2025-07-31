/**
 * Reusable API calling hook for QuillSwitch
 * Provides consistent error handling, loading states, and logging
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createAuthHeaders, type ApiResponse } from '@/utils/constants/apiEndpoints';
import { apiLog } from '@/utils/logging/consoleReplacer';

interface UseApiCallOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  category?: string;
}

interface ApiCallState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useApiCall = <T = any>(options: UseApiCallOptions = {}) => {
  const { onSuccess, onError, category = 'API' } = options;
  
  const [state, setState] = useState<ApiCallState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponse<T>> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No authentication token available');
      }

      const headers = {
        ...createAuthHeaders(session.access_token),
        ...customHeaders,
      };

      apiLog.info(`Making ${method} request to ${url}`, { 
        method, 
        hasBody: !!body,
        category 
      });

      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        
        const errorMessage = errorData.error || errorData.message || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      setState(prev => ({ ...prev, data, loading: false }));
      
      if (onSuccess) {
        onSuccess(data);
      }
      
      apiLog.info(`${method} request to ${url} completed successfully`, { category });
      
      return { success: true, data };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      
      if (onError) {
        onError(errorMessage);
      }
      
      apiLog.error(`${method} request to ${url} failed`, error instanceof Error ? error : undefined, { 
        category,
        errorMessage 
      });
      
      return { success: false, error: errorMessage };
    }
  }, [onSuccess, onError, category]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};

// Convenience hooks for specific HTTP methods
export const useGet = <T = any>(options?: UseApiCallOptions) => {
  const { execute, ...rest } = useApiCall<T>(options);
  
  const get = useCallback((url: string, headers?: Record<string, string>) => 
    execute(url, 'GET', undefined, headers), [execute]);
  
  return { get, ...rest };
};

export const usePost = <T = any>(options?: UseApiCallOptions) => {
  const { execute, ...rest } = useApiCall<T>(options);
  
  const post = useCallback((url: string, body?: any, headers?: Record<string, string>) => 
    execute(url, 'POST', body, headers), [execute]);
  
  return { post, ...rest };
};

export const usePut = <T = any>(options?: UseApiCallOptions) => {
  const { execute, ...rest } = useApiCall<T>(options);
  
  const put = useCallback((url: string, body?: any, headers?: Record<string, string>) => 
    execute(url, 'PUT', body, headers), [execute]);
  
  return { put, ...rest };
};

export const useDelete = <T = any>(options?: UseApiCallOptions) => {
  const { execute, ...rest } = useApiCall<T>(options);
  
  const del = useCallback((url: string, headers?: Record<string, string>) => 
    execute(url, 'DELETE', undefined, headers), [execute]);
  
  return { delete: del, ...rest };
};