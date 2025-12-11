import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import axios from 'axios';
import { authAPI, AuthAccount } from '@/apis/auth';

interface AuthState {
  user: AuthAccount | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login({ email, password });

          // Update state - persist middleware will auto-save to localStorage
          set({
            token: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            user: response.data.authAccount,
            isLoading: false,
          });

          // Show success toast
          toast.success('Login successful!');
        } catch (error) {
          let errorMessage = 'Login failed';

          if (axios.isAxiosError(error)) {
            // Extract error message from API response
            const apiError = error.response?.data as Record<string, unknown>;
            errorMessage =
              (apiError?.message as string) ||
              error.response?.statusText ||
              'Login failed';
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({
            error: errorMessage,
            isLoading: false,
          });

          // Show error toast
          toast.error(errorMessage);

          // Throw error so component knows login failed
          throw new Error(errorMessage);
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      setToken: (token: string) => {
        set({ token });
      },
    }),
    {
      name: 'auth-store', // localStorage key name
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }), // Only persist these fields
    }
  )
);
