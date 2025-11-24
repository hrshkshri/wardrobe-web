import type { ApiError } from '@/types';

export class ApiException extends Error {
  constructor(
    public code: string,
    public message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

export const handleApiError = (error: ApiError): string => {
  switch (error.code) {
    case 'UNAUTHORIZED':
      return 'You are not authorized. Please log in again.';
    case 'FORBIDDEN':
      return 'You do not have permission to access this resource.';
    case 'NOT_FOUND':
      return 'The requested resource was not found.';
    case 'VALIDATION_ERROR':
      return 'Please check your input and try again.';
    case 'NETWORK_ERROR':
      return 'Network error. Please check your connection.';
    case 'SERVER_ERROR':
      return 'Server error. Please try again later.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
};

export const logError = (error: unknown, context?: string): void => {
  const isDevelopment = import.meta.env.DEV;

  if (isDevelopment) {
    console.error(`[Error${context ? ` - ${context}` : ''}]`, error);
  }

  // TODO: Send to error tracking service (Sentry, etc.)
};
