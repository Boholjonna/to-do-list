// Settings screen for theme customization
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTheme, DARK_GRADIENTS } from '@/contexts/ThemeContext';
import { BackgroundType } from '@/types';

const PRESET_SOLIDS = ['#000000', '#1a1a1a', '#0f172a', '#18181b', '#1e293b'];

export default function SettingsScreen() {
  const { themeSettings, updateThemeSettings, colors } = useTheme();

  const handleBackgroundTypeChange = (type: BackgroundType) => {
    updateThemeSettings({ background_type: type });
  };

  const handleSolidColorChange = (color: string) => {
    updateThemeSettings({
      background_type: 'solid',
      solid_color: color,
    });
  };

  const handleGradientChange = (gradient: string[]) => {
    updateThemeSettings({
      background_type: 'gradient',
      gradient_colors: gradient,
    });
  };

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
        <Text style={[styles.title, { color: colors.text }]}>Theme</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Background Type */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Background Type</Text>
          <View style={styles.options}>
            {(['solid', 'gradient'] as BackgroundType[]).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.optionButton,
                  { borderColor: colors.border },
                  themeSettings.background_type === type && { backgroundColor: colors.primary },
                ]}
                onPress={() => handleBackgroundTypeChange(type)}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: themeSettings.background_type === type ? '#FFF' : colors.text },
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Color Presets */}
        {themeSettings.background_type === 'solid' ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Dark Colors</Text>
            <View style={styles.colorGrid}>
              {PRESET_SOLIDS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    themeSettings.solid_color === color && styles.selectedColor,
                  ]}
                  onPress={() => handleSolidColorChange(color)}
                >
                  {themeSettings.solid_color === color && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Gradient Themes</Text>
            <View style={styles.gradientGrid}>
              {DARK_GRADIENTS.map((gradient, index) => {
                const isSelected =
                  JSON.stringify(themeSettings.gradient_colors) === JSON.stringify(gradient);
                
                // Get color name from gradient
                const colorName = gradient[1] === '#14b8a6' ? 'Teal' :
                                 gradient[1] === '#ec4899' ? 'Pink' :
                                 gradient[1] === '#8b5cf6' ? 'Purple' :
                                 gradient[1] === '#3b82f6' ? 'Blue' :
                                 gradient[1] === '#f59e0b' ? 'Orange' :
                                 gradient[1] === '#10b981' ? 'Green' :
                                 gradient[1] === '#ef4444' ? 'Red' :
                                 gradient[1] === '#06b6d4' ? 'Cyan' : '';

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.gradientOption,
                      isSelected && styles.selectedGradient,
                    ]}
                    onPress={() => handleGradientChange(gradient)}
                  >
                    <LinearGradient
                      colors={gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.gradientPreview}
                    >
                      {isSelected && <Text style={styles.checkmark}>✓</Text>}
                    </LinearGradient>
                    <Text style={[styles.gradientName, { color: colors.textSecondary }]}>
                      {colorName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Info */}
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Choose between solid dark backgrounds or stylish gradients combining black with vibrant colors. Changes are saved automatically.
          </Text>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  options: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
  gradientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  gradientOption: {
    width: 100,
    alignItems: 'center',
  },
  selectedGradient: {
    transform: [{ scale: 1.05 }],
  },
  gradientPreview: {
    width: 100,
    height: 80,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  gradientName: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
