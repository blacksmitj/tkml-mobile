import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ColorPalette } from '@/constants/colors';
import { AlertCircle, ChevronRight } from 'lucide-react-native';

interface AlertRevisiCardProps {
  jumlahRevisi: number;
  catatanList: string[];
  onPressAction: () => void;
}

export const AlertRevisiCard: React.FC<AlertRevisiCardProps> = ({
  jumlahRevisi,
  catatanList,
  onPressAction,
}) => {
  if (jumlahRevisi === 0) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={onPressAction}>
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <AlertCircle size={20} color={ColorPalette.rose[600]} />
        </View>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>Perlu Perbaikan ({jumlahRevisi} Berkas)</Text>
          <Text style={styles.subtitle}>
            Ada catatan dari tim verifikator yang harus diperbaiki.
          </Text>
        </View>
      </View>

      <View style={styles.catatanBox}>
        {catatanList.slice(0, 2).map((catatan, idx) => (
          <Text key={idx} style={styles.catatanText} numberOfLines={2}>
            • {catatan}
          </Text>
        ))}
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.actionText}>Buka Berkas & Perbaiki Sekarang</Text>
        <ChevronRight size={16} color={ColorPalette.rose[700]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ColorPalette.rose[50],
    borderWidth: 1.5,
    borderColor: ColorPalette.rose[300],
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: ColorPalette.rose[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: ColorPalette.rose[900],
  },
  subtitle: {
    fontSize: 12,
    color: ColorPalette.rose[700],
    marginTop: 2,
  },
  catatanBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: ColorPalette.rose[200],
    gap: 4,
  },
  catatanText: {
    fontSize: 12,
    color: ColorPalette.slate[800],
    lineHeight: 16,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 4,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: ColorPalette.rose[700],
  },
});
