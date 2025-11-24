import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { queryKeys } from '@/lib/queryKeys';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import type { LoginRequest } from '@/types';

export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      const user = await authService.getCurrentUser();
      if (!user) throw new Error('Failed to fetch current user');
      return user;
    },
    enabled: useAuthStore((state) => state.isAuthenticated),
  });
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const result = await authService.login(credentials);
      if (!result) throw new Error('Login failed');
      return result;
    },
    onSuccess: (data) => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });

      // Set auth store
      const { setUser, setToken } = useAuthStore.getState();
      setUser(data.user);
      setToken(data.token, data.refreshToken);
    },
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: async () => {
      await authService.logout();
    },
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();

      // Clear auth store
      useAuthStore.getState().logout();
    },
  });
};

export const useRefreshTokenMutation = () => {
  return useMutation({
    mutationFn: async () => {
      const success = await authService.refreshAccessToken();
      if (!success) throw new Error('Token refresh failed');
      return success;
    },
    onError: () => {
      // Logout on refresh failure
      useAuthStore.getState().logout();
      queryClient.clear();
    },
  });
};
