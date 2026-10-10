// Task context for managing tasks and categories
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Task, Category, Priority, ReminderOption } from '@/types';
import { loadTasks, saveTasks, loadCategories, saveCategories } from '@/utils/storage';
import { scheduleNotification, cancelNotification } from '@/utils/notifications';
import { generateId } from '@/utils/dateHelpers';

interface TaskContextType {
  tasks: Task[];
  categories: Category[];
  loading: boolean;
  createTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  createCategory: (name: string, color: string) => Promise<void>;
  updateCategory: (id: string, name: string, color: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [loadedTasks, loadedCategories] = await Promise.all([
        loadTasks(),
        loadCategories(),
      ]);
      setTasks(loadedTasks);
      setCategories(loadedCategories);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      created_at: now,
      updated_at: now,
    };

    // Schedule notification if reminder is set
    if (newTask.due_date && newTask.reminder_option) {
      try {
        const notificationId = await scheduleNotification(
          newTask.title,
          newTask.notes,
          newTask.due_date,
          newTask.reminder_option
        );
        newTask.notification_id = notificationId;
      } catch (error) {
        console.error('Failed to schedule notification:', error);
      }
    }

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) return;

    const currentTask = tasks[taskIndex];
    const updatedTask = {
      ...currentTask,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    // Handle notification rescheduling
    if (
      updates.due_date !== undefined ||
      updates.reminder_option !== undefined
    ) {
      // Cancel old notification
      if (currentTask.notification_id) {
        await cancelNotification(currentTask.notification_id);
      }

      // Schedule new notification if both due_date and reminder_option exist
      if (updatedTask.due_date && updatedTask.reminder_option) {
        try {
          const notificationId = await scheduleNotification(
            updatedTask.title,
            updatedTask.notes,
            updatedTask.due_date,
            updatedTask.reminder_option
          );
          updatedTask.notification_id = notificationId;
        } catch (error) {
          console.error('Failed to reschedule notification:', error);
        }
      } else {
        updatedTask.notification_id = undefined;
      }
    }

    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = updatedTask;
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  const deleteTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task?.notification_id) {
      await cancelNotification(task.notification_id);
    }

    const updatedTasks = tasks.filter((t) => t.id !== id);
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  const toggleTaskCompletion = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const isCompleting = !task.completed_at;
    const updates: Partial<Task> = {
      completed_at: isCompleting ? new Date().toISOString() : undefined,
    };

    // Cancel notification when completing
    if (isCompleting && task.notification_id) {
      await cancelNotification(task.notification_id);
      updates.notification_id = undefined;
    }

    await updateTask(id, updates);
  };

  const createCategory = async (name: string, color: string) => {
    const newCategory: Category = {
      id: generateId(),
      name,
      color,
      created_at: new Date().toISOString(),
    };

    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    await saveCategories(updatedCategories);
  };

  const updateCategory = async (id: string, name: string, color: string) => {
    const updatedCategories = categories.map((cat) =>
      cat.id === id ? { ...cat, name, color } : cat
    );
    setCategories(updatedCategories);
    await saveCategories(updatedCategories);
  };

  const deleteCategory = async (id: string) => {
    // Remove category from all tasks
    const updatedTasks = tasks.map((task) =>
      task.category_id === id ? { ...task, category_id: undefined } : task
    );
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);

    // Remove category
    const updatedCategories = categories.filter((cat) => cat.id !== id);
    setCategories(updatedCategories);
    await saveCategories(updatedCategories);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        categories,
        loading,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        createCategory,
        updateCategory,
        deleteCategory,
        refreshData,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
};
