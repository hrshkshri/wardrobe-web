import { useState, useCallback } from 'react';
import { apiClient } from '@/api/client';
import type { ApiResponse, ApiError } from '@/types';

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
}

export const useApi = <T>() => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(async (request: Promise<ApiResponse<T>>) => {
    setState({ data: null, isLoading: true, error: null });

    try {
      const response = await request;

      if (response.success && response.data) {
        setState({ data: response.data, isLoading: false, error: null });
        return response.data;
      }

      const error = response.error || {
        code: 'UNKNOWN_ERROR',
        message: 'An unknown error occurred',
      };

      setState({ data: null, isLoading: false, error });
      return null;
    } catch (err) {
      const error: ApiError = {
        code: 'NETWORK_ERROR',
        message: err instanceof Error ? err.message : 'Network error',
      };

      setState({ data: null, isLoading: false, error });
      return null;
    }
  }, []);

  const get = useCallback(
    (endpoint: string) => execute(apiClient.get<T>(endpoint)),
    [execute]
  );

  const post = useCallback(
    (endpoint: string, body?: unknown) =>
      execute(apiClient.post<T>(endpoint, body)),
    [execute]
  );

  const put = useCallback(
    (endpoint: string, body?: unknown) =>
      execute(apiClient.put<T>(endpoint, body)),
    [execute]
  );

  const patch = useCallback(
    (endpoint: string, body?: unknown) =>
      execute(apiClient.patch<T>(endpoint, body)),
    [execute]
  );

  const remove = useCallback(
    (endpoint: string) => execute(apiClient.delete<T>(endpoint)),
    [execute]
  );

  return {
    ...state,
    get,
    post,
    put,
    patch,
    delete: remove,
  };
};
