/**
 * Query Service - Centralized API queries using React Query
 * This service provides all the query functions for the API
 */

import { queryClient } from '@/lib/queryClient';
import { queryKeys } from '@/lib/queryKeys';
import { apiClient } from '@/api/client';
import type { User, PaginatedResponse } from '@/types';

class QueryService {
  /**
   * Invalidate all queries by key prefix
   * Useful for refetching data after mutations
   */
  invalidateQueries(keys: readonly unknown[]) {
    return queryClient.invalidateQueries({ queryKey: keys });
  }

  /**
   * Remove all queries from cache
   * Useful for logout
   */
  clearCache() {
    return queryClient.clear();
  }

  /**
   * Get cached data directly without hook
   * Useful for accessing data outside of components
   */
  getQueryData<T>(queryKey: unknown[]) {
    return queryClient.getQueryData<T>(queryKey);
  }

  /**
   * Set cached data directly
   * Useful for optimistic updates
   */
  setQueryData<T>(queryKey: unknown[], data: T) {
    return queryClient.setQueryData(queryKey, data);
  }

  // Auth queries
  async fetchCurrentUser() {
    const response = await apiClient.get<User>('/auth/me');
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to fetch user');
    }
    return response.data;
  }

  // Users queries
  async fetchUsers(filters?: Record<string, unknown>) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const endpoint = params.toString()
      ? `/users?${params.toString()}`
      : '/users';
    const response = await apiClient.get<User[]>(endpoint);

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to fetch users');
    }
    return response.data;
  }

  async fetchUserById(id: string) {
    const response = await apiClient.get<User>(`/users/${id}`);
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to fetch user');
    }
    return response.data;
  }

  // Items/Products queries
  async fetchItems(page = 1, filters?: Record<string, unknown>) {
    const params = new URLSearchParams({ page: String(page) });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get<PaginatedResponse<unknown>>(
      `/items?${params.toString()}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to fetch items');
    }
    return response.data;
  }

  // Search queries
  async searchItems(query: string) {
    const response = await apiClient.get(
      `/search?q=${encodeURIComponent(query)}`
    );
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Search failed');
    }
    return response.data;
  }

  // Invalidate specific query keys after mutations
  invalidateUserQueries() {
    return this.invalidateQueries(queryKeys.users.all);
  }

  invalidateItemQueries() {
    return this.invalidateQueries(queryKeys.items.all);
  }

  invalidateAuthQueries() {
    return this.invalidateQueries(queryKeys.auth.all);
  }
}

export const queryService = new QueryService();
