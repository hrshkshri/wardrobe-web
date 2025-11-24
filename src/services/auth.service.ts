import { apiClient } from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import type { LoginRequest, LoginResponse, User } from '@/types';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse | null> {
    const { setLoading, setError, setToken, setUser } = useAuthStore.getState();

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.post<LoginResponse>(
        '/auth/login',
        credentials
      );

      if (!response.success || !response.data) {
        const error = response.error || {
          code: 'LOGIN_FAILED',
          message: 'Login failed',
        };
        setError(error);
        return null;
      }

      const { user, token, refreshToken } = response.data;

      // Store token in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refreshToken);

      // Update store
      setToken(token, refreshToken);
      setUser(user);

      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Login failed';
      setError({
        code: 'LOGIN_ERROR',
        message: errorMessage,
      });
      return null;
    } finally {
      setLoading(false);
    }
  }

  async logout(): Promise<void> {
    const { logout } = useAuthStore.getState();

    try {
      // Call logout endpoint if needed
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');

      // Clear store
      logout();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const { user } = useAuthStore.getState();

    if (user) {
      return user;
    }

    try {
      const response = await apiClient.get<User>('/auth/me');

      if (response.success && response.data) {
        useAuthStore.getState().setUser(response.data);
        return response.data;
      }

      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async refreshAccessToken(): Promise<boolean> {
    const { refreshToken } = useAuthStore.getState();

    if (!refreshToken) {
      return false;
    }

    try {
      const response = await apiClient.post<{
        token: string;
        refreshToken: string;
      }>('/auth/refresh', { refreshToken });

      if (response.success && response.data) {
        const { token, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem('authToken', token);
        localStorage.setItem('refreshToken', newRefreshToken);

        useAuthStore.getState().setToken(token, newRefreshToken);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  isAuthenticated(): boolean {
    const { isAuthenticated } = useAuthStore.getState();
    return isAuthenticated;
  }

  getToken(): string | null {
    const { token } = useAuthStore.getState();
    return token;
  }
}

export const authService = new AuthService();
