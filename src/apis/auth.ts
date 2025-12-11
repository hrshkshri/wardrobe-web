import axiosInstance from '@/lib/axios';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthAccount {
  id: string;
  email: string;
}

export interface AuthResponseData {
  accessToken: string;
  authAccount: AuthAccount;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthResponseData;
  timestamp: string;
  traceId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RefreshResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
  timestamp: string;
  traceId: string;
}

export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      '/auth/login',
      data
    );

    // Check if API returned success: false even with 200 status
    if (!response.data.success) {
      throw new Error(response.data.message || 'Login failed');
    }

    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      '/auth/register',
      data
    );

    // Check if API returned success: false even with 200 status
    if (!response.data.success) {
      throw new Error(response.data.message || 'Registration failed');
    }

    return response.data;
  },

  refresh: async (): Promise<RefreshResponse> => {
    const response = await axiosInstance.post<RefreshResponse>(
      '/auth/refresh'
    );

    // Check if API returned success: false even with 200 status
    if (!response.data.success) {
      throw new Error(response.data.message || 'Token refresh failed');
    }

    return response.data;
  },
};
