import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import axios from 'axios';
import { authAPI, AuthAccount, RegisterRequest } from '@/apis/auth';

interface AuthState {
  user: AuthAccount | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  refreshToken: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login({ email, password });

          // Update state - persist middleware will auto-save to localStorage
          set({
            token: response.data.accessToken,
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

      register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register(data);

          // Update state - persist middleware will auto-save to localStorage
          set({
            token: response.data.accessToken,
            user: response.data.authAccount,
            isLoading: false,
          });

          // Show success toast
          toast.success('Registration successful!');
        } catch (error) {
          let errorMessage = 'Registration failed';

          if (axios.isAxiosError(error)) {
            // Extract error message from API response
            const apiError = error.response?.data as Record<string, unknown>;
            errorMessage =
              (apiError?.message as string) ||
              error.response?.statusText ||
              'Registration failed';
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({
            error: errorMessage,
            isLoading: false,
          });

          // Show error toast
          toast.error(errorMessage);

          // Throw error so component knows registration failed
          throw new Error(errorMessage);
        }
      },

      refreshToken: async () => {
        try {
          const response = await authAPI.refresh();

          // Update token from refresh response
          set({
            token: response.data.accessToken,
            isLoading: false,
          });
        } catch {
          // If refresh fails, logout user
          set({
            user: null,
            token: null,
            error: 'Session expired. Please login again.',
            isLoading: false,
          });

          // Redirect to login
          window.location.href = '/auth/login';
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
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
      }), // Only persist these fields
    }
  )
);
