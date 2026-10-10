// Core data types for the Todo List app

export type Priority = 'low' | 'medium' | 'high';

export type ReminderOption = 'at_time' | '10_min_before' | '1_hour_before' | '1_day_before';

export type ThemeMode = 'dark';

export type BackgroundType = 'solid' | 'gradient';

export interface Task {
  id: string;
  title: string;
  notes?: string;
  category_id?: string;
  priority?: Priority;
  due_date?: string; // ISO date string
  reminder_option?: ReminderOption;
  notification_id?: string;
  completed_at?: string; // ISO date string
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface ThemeSettings {
  mode: ThemeMode;
  background_type: BackgroundType;
  solid_color?: string;
  gradient_colors?: string[]; // 2-4 colors
}

export type TaskGrouping = 'all' | 'today' | 'upcoming' | 'no_date';

export type SortOption = 'created_desc' | 'created_asc' | 'priority_high_low' | 'priority_low_high' | 'due_date_asc';
