// Task card component for displaying individual tasks
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Task, Category } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';
import { formatDueDate, isOverdue } from '@/utils/dateHelpers';

interface TaskCardProps {
  task: Task;
  category?: Category;
  onPress: () => void;
  onToggleComplete: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  category,
  onPress,
  onToggleComplete,
}) => {
  const { colors } = useTheme();
  const isCompleted = !!task.completed_at;
  const overdue = task.due_date ? isOverdue(task.due_date, isCompleted) : false;

  const getPriorityIcon = () => {
    switch (task.priority) {
      case 'high':
        return { icon: '↑', color: colors.error };
      case 'medium':
        return { icon: '−', color: colors.warning };
      case 'low':
        return { icon: '↓', color: colors.success };
      default:
        return null;
    }
  };

  const priority = getPriorityIcon();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Checkbox */}
      <TouchableOpacity
        style={[
          styles.checkbox,
          { borderColor: colors.primary },
          isCompleted && { backgroundColor: colors.primary },
        ]}
        onPress={onToggleComplete}
      >
        {isCompleted && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              { color: colors.text },
              isCompleted && styles.completedText,
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>
        </View>

        {task.notes && (
          <Text
            style={[styles.notes, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {task.notes}
          </Text>
        )}

        <View style={styles.metadata}>
          {category && (
            <View
              style={[styles.categoryChip, { backgroundColor: category.color }]}
            >
              <Text style={styles.categoryText}>{category.name}</Text>
            </View>
          )}

          {priority && (
            <View style={styles.priorityContainer}>
              <Text style={[styles.priorityIcon, { color: priority.color }]}>
                {priority.icon}
              </Text>
            </View>
          )}

          {task.due_date && (
            <Text
              style={[
                styles.dueDate,
                { color: overdue ? colors.error : colors.textSecondary },
              ]}
            >
              {overdue && '⚠ '}
              {formatDueDate(task.due_date)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkmark: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  notes: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.8,
  },
  metadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  priorityContainer: {
    marginRight: 4,
  },
  priorityIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dueDate: {
    fontSize: 13,
  },
});
