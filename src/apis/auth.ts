import axiosInstance from '@/lib/axios';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthAccount {
  id: string;
  email: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  authAccount: AuthAccount;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginResponseData;
  timestamp: string;
  traceId: string;
}

export const authAPI = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(
      '/auth/login',
      data
    );

    // Check if API returned success: false even with 200 status
    if (!response.data.success) {
      throw new Error(response.data.message || 'Login failed');
    }

    return response.data;
  },
};
