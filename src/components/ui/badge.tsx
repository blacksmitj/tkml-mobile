import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { StatusTheme, ColorPalette } from '@/constants/colors';
import { StatusBerkas } from '@/types/tkml';

interface BadgeProps {
  label: string;
  status?: StatusBerkas;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  status,
  variant,
  style,
  textStyle,
  icon,
}) => {
  let bgColor = ColorPalette.slate[100];
  let textColor = ColorPalette.slate[700];

  if (status && StatusTheme[status]) {
    bgColor = StatusTheme[status].badgeBg;
    textColor = StatusTheme[status].badgeText;
  } else if (variant) {
    switch (variant) {
      case 'primary':
        bgColor = ColorPalette.primary[100];
        textColor = ColorPalette.primary[800];
        break;
      case 'success':
        bgColor = ColorPalette.emerald[100];
        textColor = ColorPalette.emerald[700];
        break;
      case 'warning':
        bgColor = ColorPalette.amber[100];
        textColor = ColorPalette.amber[700];
        break;
      case 'danger':
        bgColor = ColorPalette.rose[100];
        textColor = ColorPalette.rose[700];
        break;
      case 'neutral':
      default:
        bgColor = ColorPalette.slate[100];
        textColor = ColorPalette.slate[700];
        break;
    }
  }

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }, style]}>
      {icon}
      <Text style={[styles.badgeText, { color: textColor }, textStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
