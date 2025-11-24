import { ApiError, ApiResponse } from '@/types';
import { interceptorManager } from './interceptors';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const token = localStorage.getItem('authToken');
      const headers = new Headers({
        'Content-Type': 'application/json',
      });

      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers.set(key, value);
        });
      } else if (
        typeof options.headers === 'object' &&
        options.headers !== null
      ) {
        Object.entries(options.headers).forEach(([key, value]) => {
          headers.set(key, value);
        });
      }

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          code: data.code || 'UNKNOWN_ERROR',
          message: data.message || `HTTP ${response.status}`,
          details: data.details,
        };

        // Map HTTP status to error code if not already set
        if (response.status === 401) {
          error.code = 'UNAUTHORIZED';
        } else if (response.status === 403) {
          error.code = 'FORBIDDEN';
        }

        // Execute error interceptors
        interceptorManager.executeErrorInterceptors(error);

        return {
          success: false,
          error,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      const apiError: ApiError = {
        code: 'NETWORK_ERROR',
        message:
          error instanceof Error ? error.message : 'Network request failed',
      };

      return {
        success: false,
        error: apiError,
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
