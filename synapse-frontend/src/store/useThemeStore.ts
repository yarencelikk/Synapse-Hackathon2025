import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create(
  persist<ThemeState>(
    (set) => ({
      theme: "system", // Varsayılan tema sistemi takip etsin
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'synapse-theme-storage', // localStorage'da verinin saklanacağı anahtar
    }
  )
);
