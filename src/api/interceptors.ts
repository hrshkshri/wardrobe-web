import { authService } from '@/services/auth.service';
import { logger } from '@/services/logger.service';
import type { ApiError } from '@/types';

export interface RequestConfig {
  headers?: HeadersInit;
  retries?: number;
}

export interface ResponseData<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

class InterceptorManager {
  private requestInterceptors: Array<(config: RequestConfig) => RequestConfig> =
    [];
  private responseInterceptors: Array<
    (response: ResponseData<unknown>) => ResponseData<unknown>
  > = [];
  private errorInterceptors: Array<(error: ApiError) => void | Promise<void>> =
    [];

  addRequestInterceptor(
    interceptor: (config: RequestConfig) => RequestConfig
  ): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(
    interceptor: (response: ResponseData<unknown>) => ResponseData<unknown>
  ): void {
    this.responseInterceptors.push(interceptor);
  }

  addErrorInterceptor(
    interceptor: (error: ApiError) => void | Promise<void>
  ): void {
    this.errorInterceptors.push(interceptor);
  }

  executeRequestInterceptors(config: RequestConfig): RequestConfig {
    return this.requestInterceptors.reduce((config, interceptor) => {
      return interceptor(config);
    }, config);
  }

  executeResponseInterceptors(
    response: ResponseData<unknown>
  ): ResponseData<unknown> {
    return this.responseInterceptors.reduce((response, interceptor) => {
      return interceptor(response);
    }, response);
  }

  executeErrorInterceptors(error: ApiError): void {
    this.errorInterceptors.forEach((interceptor) => {
      Promise.resolve().then(() => interceptor(error));
    });
  }
}

export const interceptorManager = new InterceptorManager();

// Register default interceptors

// Request: Add logging
interceptorManager.addRequestInterceptor((config) => {
  logger.debug('API Request', {
    headers: Object.keys(config.headers || {}).length,
  });
  return config;
});

// Response: Add logging
interceptorManager.addResponseInterceptor((response) => {
  logger.debug('API Response', {
    success: response.success,
    data: response.data,
  });
  return response;
});

// Error: Handle 401 Unauthorized (refresh token)
interceptorManager.addErrorInterceptor(async (error) => {
  if (error.code === 'UNAUTHORIZED') {
    logger.warn('Unauthorized - Attempting token refresh');

    const refreshed = await authService.refreshAccessToken();

    if (!refreshed) {
      logger.error('Token refresh failed - Logging out');
      authService.logout();
    }
  }
});

// Error: Handle 403 Forbidden
interceptorManager.addErrorInterceptor((error) => {
  if (error.code === 'FORBIDDEN') {
    logger.error('Access forbidden', error);
  }
});

// Error: Log all errors
interceptorManager.addErrorInterceptor((error) => {
  logger.error('API Error', {
    code: error.code,
    message: error.message,
    details: error.details,
  });
});
