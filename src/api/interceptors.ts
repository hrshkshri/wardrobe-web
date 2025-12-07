import { authService } from '@/services/auth.service';
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

// Error: Handle 401 Unauthorized (refresh token)
interceptorManager.addErrorInterceptor(async (error) => {
  if (error.code === 'UNAUTHORIZED') {
    const refreshed = await authService.refreshAccessToken();

    if (!refreshed) {
      authService.logout();
    }
  }
});

// Error: Handle 403 Forbidden
interceptorManager.addErrorInterceptor((error) => {
  if (error.code === 'FORBIDDEN') {
    console.error('Access forbidden', error);
  }
});
