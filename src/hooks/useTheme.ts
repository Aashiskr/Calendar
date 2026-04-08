'use client';

import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'wall-calendar-theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load theme from localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored) {
      setTheme(stored);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
    setIsLoaded(true);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!isLoaded) return;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, isLoaded]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setSeasonalAccent = useCallback((season: string) => {
    document.documentElement.setAttribute('data-season', season);
  }, []);

  return {
    theme,
    isLoaded,
    toggleTheme,
    setTheme,
    setSeasonalAccent,
  };
}
