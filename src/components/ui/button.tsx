import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { ColorPalette } from '@/constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}) => {
  const getContainerStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryContainer;
      case 'outline':
        return styles.outlineContainer;
      case 'ghost':
        return styles.ghostContainer;
      case 'danger':
        return styles.dangerContainer;
      case 'primary':
      default:
        return styles.primaryContainer;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'ghost':
        return styles.ghostText;
      case 'danger':
        return styles.dangerText;
      case 'primary':
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.sizeSm;
      case 'lg':
        return styles.sizeLg;
      case 'md':
      default:
        return styles.sizeMd;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.baseButton,
        getContainerStyle(),
        getSizeStyle(),
        disabled && styles.disabledContainer,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : ColorPalette.primary[700]}
        />
      ) : (
        <>
          {icon}
          <Text style={[styles.baseText, getTextStyle(), disabled && styles.disabledText, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sizeSm: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  sizeMd: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  sizeLg: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  baseText: {
    fontWeight: '600',
    fontSize: 15,
  },
  primaryContainer: {
    backgroundColor: ColorPalette.primary[700],
    shadowColor: ColorPalette.primary[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryContainer: {
    backgroundColor: ColorPalette.primary[50],
  },
  secondaryText: {
    color: ColorPalette.primary[800],
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: ColorPalette.primary[700],
  },
  outlineText: {
    color: ColorPalette.primary[700],
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: ColorPalette.slate[700],
  },
  dangerContainer: {
    backgroundColor: ColorPalette.rose[600],
  },
  dangerText: {
    color: '#FFFFFF',
  },
  disabledContainer: {
    backgroundColor: ColorPalette.slate[200],
    borderColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledText: {
    color: ColorPalette.slate[400],
  },
});
