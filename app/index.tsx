// Main task list screen
import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  RefreshControl,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTasks } from '@/contexts/TaskContext';
import { useTheme } from '@/contexts/ThemeContext';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { Task, TaskGrouping } from '@/types';
import { isToday, isUpcoming } from '@/utils/dateHelpers';
import { requestNotificationPermissions } from '@/utils/notifications';

export default function HomeScreen() {
  const { tasks, categories, loading, createTask, updateTask, deleteTask, toggleTaskCompletion, refreshData } = useTasks();
  const { colors, themeSettings } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [grouping, setGrouping] = useState<TaskGrouping>('all');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  // Request notification permissions on mount
  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  // Filter and group tasks
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.notes?.toLowerCase().includes(query)
      );
    }

    // Apply grouping
    switch (grouping) {
      case 'today':
        filtered = filtered.filter((task) => task.due_date && isToday(task.due_date));
        break;
      case 'upcoming':
        filtered = filtered.filter((task) => task.due_date && isUpcoming(task.due_date));
        break;
      case 'no_date':
        filtered = filtered.filter((task) => !task.due_date);
        break;
    }

    // Sort by creation date (newest first)
    return filtered.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [tasks, searchQuery, grouping]);

  const handleCreateTask = async (data: any) => {
    await createTask(data);
    setShowTaskForm(false);
  };

  const handleUpdateTask = async (data: any) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
      setEditingTask(undefined);
    }
  };

  const handleDeleteTask = (task: Task) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTask(task.id),
        },
      ]
    );
  };

  const renderTask = ({ item }: { item: Task }) => {
    const category = categories.find((c) => c.id === item.category_id);
    return (
      <TaskCard
        task={item}
        category={category}
        onPress={() => setEditingTask(item)}
        onToggleComplete={() => toggleTaskCompletion(item.id)}
      />
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyText, { color: colors.text }]}>
        {searchQuery
          ? 'No tasks found'
          : grouping !== 'all'
          ? `No ${grouping === 'no_date' ? 'unscheduled' : grouping} tasks`
          : 'No tasks yet'}
      </Text>
      <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
        {!searchQuery && grouping === 'all' && 'Tap + to create your first task'}
      </Text>
    </View>
  );

  const backgroundComponent = themeSettings.background_type === 'gradient' ? (
    <LinearGradient
      colors={colors.background}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
  ) : (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background[0] }]} />
  );

  return (
    <View style={styles.container}>
      {backgroundComponent}

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>My Tasks</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.card }]}
            onPress={() => router.push('/categories')}
          >
            <Text style={{ color: colors.text }}>🏷️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.card }]}
            onPress={() => router.push('/settings')}
          >
            <Text style={{ color: colors.text }}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search tasks..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={{ color: colors.textSecondary }}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Grouping Filters */}
      <View style={styles.filters}>
        {(['all', 'today', 'upcoming', 'no_date'] as TaskGrouping[]).map((g) => (
          <TouchableOpacity
            key={g}
            style={[
              styles.filterChip,
              grouping === g && { backgroundColor: colors.primary },
              { borderColor: colors.border },
            ]}
            onPress={() => setGrouping(g)}
          >
            <Text
              style={[
                styles.filterText,
                { color: grouping === g ? '#FFF' : colors.text },
              ]}
            >
              {g === 'no_date' ? 'No Date' : g.charAt(0).toUpperCase() + g.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        contentContainerStyle={styles.list}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshData} />
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => setShowTaskForm(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Task Form Modal */}
      <Modal
        visible={showTaskForm || !!editingTask}
        animationType="slide"
        onRequestClose={() => {
          setShowTaskForm(false);
          setEditingTask(undefined);
        }}
      >
        <View style={styles.modalContainer}>
          {backgroundComponent}
          <TaskForm
            task={editingTask}
            categories={categories}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={() => {
              setShowTaskForm(false);
              setEditingTask(undefined);
            }}
          />
          {editingTask && (
            <TouchableOpacity
              style={[styles.deleteButton, { backgroundColor: colors.error }]}
              onPress={() => {
                setEditingTask(undefined);
                handleDeleteTask(editingTask);
              }}
            >
              <Text style={styles.deleteButtonText}>Delete Task</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  searchIcon: {
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  list: {
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    left: '50%',
    marginLeft: -30,
    bottom: 80,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: '300',
  },
  modalContainer: {
    flex: 1,
  },
  deleteButton: {
    margin: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
