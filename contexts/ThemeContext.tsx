// Theme context for managing app appearance
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeSettings } from '@/types';
import { loadThemeSettings, saveThemeSettings } from '@/utils/storage';

// Dark gradient presets - combinations of black with other colors
export const DARK_GRADIENTS = [
  ['#000000', '#14b8a6', '#000000'], // Black Teal
  ['#000000', '#ec4899', '#000000'], // Black Pink
  ['#000000', '#8b5cf6', '#000000'], // Black Purple
  ['#000000', '#3b82f6', '#000000'], // Black Blue
  ['#000000', '#f59e0b', '#000000'], // Black Orange
  ['#000000', '#10b981', '#000000'], // Black Green
  ['#000000', '#ef4444', '#000000'], // Black Red
  ['#000000', '#06b6d4', '#000000'], // Black Cyan
];

export const DEFAULT_GRADIENT = DARK_GRADIENTS[0]; // Black Teal

interface ThemeColors {
  background: string[];
  text: string;
  textSecondary: string;
  card: string;
  cardOpacity: number;
  border: string;
  primary: string;
  error: string;
  success: string;
  warning: string;
}

interface ThemeContextType {
  themeSettings: ThemeSettings;
  updateThemeSettings: (settings: Partial<ThemeSettings>) => Promise<void>;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getColors = (settings: ThemeSettings): ThemeColors => {
  let background: string[];
  if (settings.background_type === 'solid') {
    const color = settings.solid_color || '#000000';
    background = [color];
  } else {
    background = settings.gradient_colors || DEFAULT_GRADIENT;
  }

  return {
    background,
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    card: 'rgba(31, 41, 55, 0.8)',
    cardOpacity: 0.8,
    border: 'rgba(75, 85, 99, 0.3)',
    primary: '#3B82F6',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
  };
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    mode: 'dark',
    background_type: 'gradient',
    gradient_colors: DEFAULT_GRADIENT,
  });

  // Load theme settings on mount
  useEffect(() => {
    const loadTheme = async () => {
      const savedSettings = await loadThemeSettings();
      if (savedSettings) {
        setThemeSettings(savedSettings);
      }
    };
    loadTheme();
  }, []);

  const updateThemeSettings = async (settings: Partial<ThemeSettings>) => {
    const newSettings = { ...themeSettings, ...settings };
    setThemeSettings(newSettings);
    await saveThemeSettings(newSettings);
  };

  const colors = getColors(themeSettings);

  return (
    <ThemeContext.Provider
      value={{
        themeSettings,
        updateThemeSettings,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
