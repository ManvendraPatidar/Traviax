import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'glass' | 'gradient';
  padding?: keyof typeof theme.spacing;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  padding = 'md',
}) => {
  const paddingValue = typeof padding === 'string' ? theme.spacing[padding] as number : padding;

  if (variant === 'glass') {
    return (
      <View style={[styles.base, styles.glass, { padding: paddingValue }, style]}>
        {children}
      </View>
    );
  }

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={[theme.colors.surface, theme.colors.card]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.base, { padding: paddingValue }, style]}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.base, styles.default, { padding: paddingValue }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.spacing.borderRadius.lg,
    ...theme.spacing.shadow.md,
  },
  default: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});
