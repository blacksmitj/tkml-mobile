import React from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { ColorPalette } from '@/constants/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  required,
  containerStyle,
  inputStyle,
  leftIcon,
  rightIcon,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.requiredAsterisk}>*</Text>}
        </View>
      )}
      <View
        style={[
          styles.inputWrapper,
          error ? styles.inputError : null,
          props.editable === false ? styles.inputDisabled : null,
        ]}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        <TextInput
          placeholderTextColor={ColorPalette.slate[400]}
          style={[styles.input, inputStyle]}
          {...props}
        />
        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hintText}>{hint}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 6,
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: ColorPalette.slate[800],
  },
  requiredAsterisk: {
    color: ColorPalette.rose[600],
    fontSize: 14,
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: ColorPalette.slate[200],
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  inputError: {
    borderColor: ColorPalette.rose[500],
    backgroundColor: ColorPalette.rose[50],
  },
  inputDisabled: {
    backgroundColor: ColorPalette.slate[100],
    borderColor: ColorPalette.slate[200],
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: ColorPalette.slate[900],
    paddingVertical: 10,
  },
  iconContainer: {
    marginHorizontal: 4,
  },
  errorText: {
    fontSize: 12,
    color: ColorPalette.rose[600],
    fontWeight: '500',
  },
  hintText: {
    fontSize: 12,
    color: ColorPalette.slate[500],
  },
});
