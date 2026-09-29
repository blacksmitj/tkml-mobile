import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTKMLStore } from '@/stores/tkml-store';
import { ColorPalette } from '@/constants/colors';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react-native';

export const ToastNotification: React.FC = () => {
  const { toastMessage, toastType, hideToast } = useTKMLStore();

  if (!toastMessage) return null;

  const getToastIcon = () => {
    switch (toastType) {
      case 'success':
        return <CheckCircle2 size={18} color={ColorPalette.emerald[600]} />;
      case 'error':
        return <AlertCircle size={18} color={ColorPalette.rose[600]} />;
      case 'info':
      default:
        return <Info size={18} color={ColorPalette.primary[700]} />;
    }
  };

  const getContainerStyle = () => {
    switch (toastType) {
      case 'success':
        return {
          backgroundColor: ColorPalette.emerald[50],
          borderColor: ColorPalette.emerald[300],
        };
      case 'error':
        return {
          backgroundColor: ColorPalette.rose[50],
          borderColor: ColorPalette.rose[300],
        };
      case 'info':
      default:
        return {
          backgroundColor: ColorPalette.primary[50],
          borderColor: ColorPalette.primary[300],
        };
    }
  };

  const getTextColor = () => {
    switch (toastType) {
      case 'success':
        return ColorPalette.emerald[900];
      case 'error':
        return ColorPalette.rose[900];
      case 'info':
      default:
        return ColorPalette.primary[900];
    }
  };

  return (
    <View style={styles.positionWrapper} pointerEvents="box-none">
      <View style={[styles.container, getContainerStyle()]}>
        {getToastIcon()}
        <Text style={[styles.messageText, { color: getTextColor() }]} numberOfLines={2}>
          {toastMessage}
        </Text>
        <TouchableOpacity onPress={hideToast} style={styles.closeBtn}>
          <X size={16} color={ColorPalette.slate[400]} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  positionWrapper: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 10,
    width: '100%',
    maxWidth: 500,
    shadowColor: ColorPalette.slate[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  messageText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  closeBtn: {
    padding: 4,
  },
});
