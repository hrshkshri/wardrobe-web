import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';

/**
 * Hook to manually refresh access token
 * Usually auto-triggered on 401, but available for manual refresh
 * @example
 * const { refreshToken, isRefreshing } = useRefreshToken();
 * await refreshToken();
 */
export const useRefreshToken = () => {
  const isRefreshingStore = useAuthStore((state) => state.isLoading);

  const refreshToken = async (): Promise<boolean> => {
    try {
      return await authService.refreshAccessToken();
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  return {
    refreshToken,
    isRefreshing: isRefreshingStore,
  };
};
