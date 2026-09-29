import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { ColorPalette } from '@/constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

export const CardHeader: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.cardHeader, style]}>{children}</View>;
};

export const CardContent: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.cardContent, style]}>{children}</View>;
};

export const CardFooter: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.cardFooter, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorPalette.slate[200],
    shadowColor: ColorPalette.slate[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardContent: {
    gap: 8,
  },
  cardFooter: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: ColorPalette.slate[100],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
