// Local notification scheduling utilities
// NOTE: Notifications are disabled in Expo Go SDK 53+
// For production, use a development build to enable notifications
import { ReminderOption } from '@/types';

export const requestNotificationPermissions = async (): Promise<boolean> => {
  // Notifications not supported in Expo Go SDK 53+
  console.log('Notifications require a development build');
  return false;
};

export const scheduleNotification = async (
  taskTitle: string,
  taskNotes: string | undefined,
  dueDate: string,
  reminderOption: ReminderOption
): Promise<string> => {
  // Notifications not supported in Expo Go SDK 53+
  console.log('Notification scheduled (requires development build):', taskTitle);
  return 'mock-notification-id';
};

export const cancelNotification = async (notificationId: string): Promise<void> => {
  // Notifications not supported in Expo Go SDK 53+
  console.log('Notification cancelled (requires development build)');
};
