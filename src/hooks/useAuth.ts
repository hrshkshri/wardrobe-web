import { useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import type { LoginRequest } from '@/types';

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, error } = useAuthStore();

  const login = useCallback(async (credentials: LoginRequest) => {
    return authService.login(credentials);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
  }, []);

  const getCurrentUser = useCallback(async () => {
    return authService.getCurrentUser();
  }, []);

  const refreshToken = useCallback(async () => {
    return authService.refreshAccessToken();
  }, []);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    getCurrentUser,
    refreshToken,
  };
};
