// AsyncStorage wrapper for data persistence
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, Category, ThemeSettings } from '@/types';

const KEYS = {
  TASKS: 'tasks',
  CATEGORIES: 'categories',
  THEME_SETTINGS: 'theme_settings',
};

// Tasks Storage
export const loadTasks = async (): Promise<Task[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load tasks:', error);
    return [];
  }
};

export const saveTasks = async (tasks: Task[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks:', error);
    throw new Error('Failed to save tasks');
  }
};

// Categories Storage
export const loadCategories = async (): Promise<Category[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load categories:', error);
    return [];
  }
};

export const saveCategories = async (categories: Category[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (error) {
    console.error('Failed to save categories:', error);
    throw new Error('Failed to save categories');
  }
};

// Theme Settings Storage
export const loadThemeSettings = async (): Promise<ThemeSettings | null> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.THEME_SETTINGS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load theme settings:', error);
    return null;
  }
};

export const saveThemeSettings = async (settings: ThemeSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.THEME_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save theme settings:', error);
    throw new Error('Failed to save theme settings');
  }
};
