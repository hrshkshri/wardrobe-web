import { useThemeStore } from '@/store/themeStore';

/**
 * Hook to manage dark mode
 * @example
 * const { theme, setTheme, isDark } = useDarkMode();
 * return (
 *   <button onClick={() => setTheme(isDark ? 'light' : 'dark')}>
 *     Toggle Dark Mode
 *   </button>
 * );
 */
export const useDarkMode = () => {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const getEffectiveTheme = useThemeStore((state) => state.getEffectiveTheme);

  const isDark = getEffectiveTheme() === 'dark';

  const toggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return {
    theme,
    setTheme,
    isDark,
    toggle,
    getEffectiveTheme,
  };
};
