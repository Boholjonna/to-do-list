// Task creation/editing form
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Task, Category, Priority, ReminderOption } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';

interface TaskFormProps {
  task?: Task;
  categories: Category[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const REMINDERS: { value: ReminderOption; label: string }[] = [
  { value: 'at_time', label: 'At time' },
  { value: '10_min_before', label: '10 min before' },
  { value: '1_hour_before', label: '1 hour before' },
  { value: '1_day_before', label: '1 day before' },
];

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  categories,
  onSubmit,
  onCancel,
}) => {
  const { colors } = useTheme();
  const [title, setTitle] = useState(task?.title || '');
  const [notes, setNotes] = useState(task?.notes || '');
  const [categoryId, setCategoryId] = useState<string | undefined>(task?.category_id);
  const [priority, setPriority] = useState<Priority | undefined>(task?.priority);
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task?.due_date ? new Date(task.due_date) : undefined
  );
  const [reminderOption, setReminderOption] = useState<ReminderOption | undefined>(
    task?.reminder_option
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [titleError, setTitleError] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }

    if (title.length > 120) {
      setTitleError('Title must be 120 characters or less');
      return;
    }

    if (notes.length > 5000) {
      return;
    }

    onSubmit({
      title: title.trim(),
      notes: notes.trim() || undefined,
      category_id: categoryId,
      priority,
      due_date: dueDate?.toISOString(),
      reminder_option: dueDate ? reminderOption : undefined,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {task ? 'Edit Task' : 'New Task'}
        </Text>
      </View>

      <ScrollView style={styles.form}>
        {/* Title */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Title *</Text>
          <TextInput
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.border },
              titleError && { borderColor: colors.error },
            ]}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              setTitleError('');
            }}
            placeholder="Enter task title"
            placeholderTextColor={colors.textSecondary}
            maxLength={120}
          />
          {titleError ? (
            <Text style={[styles.error, { color: colors.error }]}>{titleError}</Text>
          ) : null}
        </View>

        {/* Notes */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Notes</Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              { color: colors.text, borderColor: colors.border },
            ]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add notes"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
            maxLength={5000}
          />
        </View>

        {/* Category */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Category</Text>
          <View style={styles.chips}>
            <TouchableOpacity
              style={[
                styles.chip,
                !categoryId && { backgroundColor: colors.primary },
                { borderColor: colors.border },
              ]}
              onPress={() => setCategoryId(undefined)}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: !categoryId ? '#FFF' : colors.text },
                ]}
              >
                None
              </Text>
            </TouchableOpacity>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.chip,
                  categoryId === cat.id && { backgroundColor: cat.color },
                  { borderColor: colors.border },
                ]}
                onPress={() => setCategoryId(cat.id)}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: categoryId === cat.id ? '#FFF' : colors.text },
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Priority */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Priority</Text>
          <View style={styles.chips}>
            {PRIORITIES.map((p) => (
              <TouchableOpacity
                key={p.value}
                style={[
                  styles.chip,
                  priority === p.value && { backgroundColor: colors.primary },
                  { borderColor: colors.border },
                ]}
                onPress={() => setPriority(p.value)}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: priority === p.value ? '#FFF' : colors.text },
                  ]}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Due Date */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Due Date</Text>
          <TouchableOpacity
            style={[styles.dateButton, { borderColor: colors.border }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: dueDate ? colors.text : colors.textSecondary }}>
              {dueDate ? dueDate.toLocaleDateString() : 'Select date'}
            </Text>
          </TouchableOpacity>

          {dueDate && (
            <TouchableOpacity
              style={[styles.dateButton, { borderColor: colors.border }]}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={{ color: colors.text }}>
                {dueDate.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </TouchableOpacity>
          )}

          {dueDate && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setDueDate(undefined);
                setReminderOption(undefined);
              }}
            >
              <Text style={{ color: colors.error }}>Clear date</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Reminder */}
        {dueDate && (
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.text }]}>Reminder</Text>
            <View style={styles.chips}>
              {REMINDERS.map((r) => (
                <TouchableOpacity
                  key={r.value}
                  style={[
                    styles.chip,
                    reminderOption === r.value && { backgroundColor: colors.primary },
                    { borderColor: colors.border },
                  ]}
                  onPress={() => setReminderOption(r.value)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: reminderOption === r.value ? '#FFF' : colors.text },
                    ]}
                  >
                    {r.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.border }]}
          onPress={onCancel}
        >
          <Text style={{ color: colors.text }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>{task ? 'Update' : 'Create'}</Text>
        </TouchableOpacity>
      </View>

      {/* Date Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDueDate(selectedDate);
            }
          }}
        />
      )}

      {showTimePicker && dueDate && (
        <DateTimePicker
          value={dueDate}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) {
              setDueDate(selectedTime);
            }
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
    padding: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  error: {
    fontSize: 14,
    marginTop: 4,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  clearButton: {
    padding: 8,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
