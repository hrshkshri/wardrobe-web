import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthError } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string, refreshToken: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: AuthError | null) => void;
  logout: () => void;
  reset: () => void;
}

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: user !== null,
        }),

      setToken: (token, refreshToken) =>
        set({
          token,
          refreshToken,
          isAuthenticated: true,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      logout: () =>
        set({
          ...initialState,
        }),

      reset: () => set({ ...initialState }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
