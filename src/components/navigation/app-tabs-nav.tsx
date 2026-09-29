import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ColorPalette } from '@/constants/colors';
import {
  Home,
  Store,
  User,
} from 'lucide-react-native';

interface AppTabsNavigationProps {
  currentTab: number;
  onTabChange: (index: number) => void;
}

export const AppTabsNavigation: React.FC<AppTabsNavigationProps> = ({
  currentTab,
  onTabChange,
}) => {
  const tabs = [
    { label: 'Beranda', icon: Home },
    { label: 'BizHub (B2B)', icon: Store },
    { label: 'Akun', icon: User },
  ];

  return (
    <View style={styles.tabBarContainer}>
      {tabs.map((tab, idx) => {
        const IconComponent = tab.icon;
        const isActive = currentTab === idx;

        return (
          <TouchableOpacity
            key={idx}
            activeOpacity={0.7}
            style={styles.tabItem}
            onPress={() => onTabChange(idx)}>
            <View
              style={[
                styles.iconWrapper,
                isActive && styles.iconWrapperActive,
              ]}>
              <IconComponent
                size={22}
                color={isActive ? ColorPalette.primary[700] : ColorPalette.slate[400]}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </View>
            <Text
              style={[
                styles.tabLabel,
                isActive && styles.tabLabelActive,
              ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: ColorPalette.slate[200],
    paddingBottom: 22,
    paddingTop: 8,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    shadowColor: ColorPalette.slate[900],
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 3,
  },
  iconWrapper: {
    paddingVertical: 5,
    paddingHorizontal: 18,
    borderRadius: 18,
  },
  iconWrapperActive: {
    backgroundColor: ColorPalette.primary[50],
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: ColorPalette.slate[500],
  },
  tabLabelActive: {
    fontWeight: '700',
    color: ColorPalette.primary[700],
  },
});
