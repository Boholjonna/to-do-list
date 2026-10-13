// Category management screen
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTasks } from '@/contexts/TaskContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Category } from '@/types';

const PRESET_COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#84CC16',
];

export default function CategoriesScreen() {
  const { categories, createCategory, updateCategory, deleteCategory } = useTasks();
  const { colors, themeSettings } = useTheme();

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [nameError, setNameError] = useState('');

  const openCreateModal = () => {
    setEditingCategory(undefined);
    setName('');
    setSelectedColor(PRESET_COLORS[0]);
    setNameError('');
    setShowModal(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setSelectedColor(category.color);
    setNameError('');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setNameError('Name is required');
      return;
    }

    if (name.length > 40) {
      setNameError('Name must be 40 characters or less');
      return;
    }

    // Check uniqueness
    const isDuplicate = categories.some(
      (cat) => cat.name.toLowerCase() === name.trim().toLowerCase() && cat.id !== editingCategory?.id
    );
    if (isDuplicate) {
      setNameError('Category name already exists');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, name.trim(), selectedColor);
      } else {
        await createCategory(name.trim(), selectedColor);
      }
      setShowModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save category');
    }
  };

  const handleDelete = (category: Category) => {
    Alert.alert(
      'Delete Category',
      `Delete "${category.name}"? Tasks with this category will become uncategorized.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteCategory(category.id),
        },
      ]
    );
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <View style={[styles.categoryCard, { backgroundColor: colors.card }]}>
      <TouchableOpacity
        style={styles.categoryContent}
        onPress={() => openEditModal(item)}
      >
        <View style={[styles.colorCircle, { backgroundColor: item.color }]} />
        <Text style={[styles.categoryName, { color: colors.text }]}>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item)}
      >
        <Text style={{ color: colors.error }}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  const backgroundComponent = themeSettings.background_type === 'gradient' ? (
    <LinearGradient
      colors={colors.background as any}
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
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backButton, { color: colors.text }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Categories</Text>
        <TouchableOpacity onPress={openCreateModal}>
          <Text style={[styles.addButton, { color: colors.primary }]}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Category List */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={renderCategory}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No categories yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Tap + Add to create your first category
            </Text>
          </View>
        }
      />

      {/* Category Form Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {editingCategory ? 'Edit Category' : 'New Category'}
            </Text>

            {/* Name Input */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text }]}>Name *</Text>
              <TextInput
                style={[
                  styles.input,
                  { color: colors.text, borderColor: colors.border },
                  nameError && { borderColor: colors.error },
                ]}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setNameError('');
                }}
                placeholder="Enter category name"
                placeholderTextColor={colors.textSecondary}
                maxLength={40}
              />
              {nameError ? (
                <Text style={[styles.error, { color: colors.error }]}>{nameError}</Text>
              ) : null}
            </View>

            {/* Color Picker */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text }]}>Color</Text>
              <View style={styles.colorGrid}>
                {PRESET_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedColor,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.border }]}
                onPress={() => setShowModal(false)}
              >
                <Text style={{ color: colors.text }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>
                  {editingCategory ? 'Update' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
  backButton: {
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
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
  error: {
    fontSize: 14,
    marginTop: 4,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#FFF',
  },
  checkmark: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
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
