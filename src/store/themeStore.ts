import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  getEffectiveTheme: () => 'light' | 'dark';
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',

      setTheme: (theme: Theme) => {
        set({ theme });

        // Update document class for Tailwind dark mode
        const effectiveTheme = get().getEffectiveTheme();
        if (effectiveTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      getEffectiveTheme: (): 'light' | 'dark' => {
        const { theme } = get();

        if (theme === 'system') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
        }

        return theme;
      },
    }),
    {
      name: 'theme-store',
      version: 1,
    }
  )
);

// Initialize theme on store creation
if (typeof window !== 'undefined') {
  const initializeTheme = () => {
    const { getEffectiveTheme } = useThemeStore.getState();
    const effectiveTheme = getEffectiveTheme();

    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  initializeTheme();

  // Listen to system theme changes
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      const { theme: currentTheme } = useThemeStore.getState();
      if (currentTheme === 'system') {
        initializeTheme();
      }
    });
}
