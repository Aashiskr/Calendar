'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import styles from '@/styles/calendar.module.css';
import type { Theme } from '@/hooks/useTheme';

interface ThemeSwitcherProps {
  theme: Theme;
  onToggle: () => void;
}

export default function ThemeSwitcher({ theme, onToggle }: ThemeSwitcherProps) {
  const isDark = theme === 'dark';

  return (
    <div className={styles.themeSwitcher}>
      <Sun size={16} style={{ color: isDark ? 'var(--color-text-muted)' : 'var(--color-primary)', transition: 'color var(--transition-base)' }} />
      <button
        className={styles.themeToggle}
        onClick={onToggle}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        type="button"
        role="switch"
        aria-checked={isDark}
      >
        <span
          className={styles.themeToggleThumb}
          data-active={isDark ? 'true' : 'false'}
        >
          {isDark ? <Moon size={13} /> : <Sun size={13} />}
        </span>
      </button>
      <Moon size={16} style={{ color: isDark ? 'var(--color-primary)' : 'var(--color-text-muted)', transition: 'color var(--transition-base)' }} />
    </div>
  );
}
