import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ColorPalette } from '@/constants/colors';
import { FileUp, Users, ReceiptText } from 'lucide-react-native';

interface QuickActionsProps {
  onPressUpload: () => void;
  onPressKaryawan: () => void;
  onPressLpj: () => void;
}

export const QuickActionButtons: React.FC<QuickActionsProps> = ({
  onPressUpload,
  onPressKaryawan,
  onPressLpj,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Aksi Cepat</Text>
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.actionBtn}
          onPress={onPressUpload}>
          <View style={[styles.iconBox, { backgroundColor: ColorPalette.primary[50] }]}>
            <FileUp size={22} color={ColorPalette.primary[700]} />
          </View>
          <Text style={styles.btnLabel}>Upload Berkas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.actionBtn}
          onPress={onPressKaryawan}>
          <View style={[styles.iconBox, { backgroundColor: ColorPalette.teal[50] }]}>
            <Users size={22} color={ColorPalette.teal[600]} />
          </View>
          <Text style={styles.btnLabel}>Data Karyawan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.actionBtn}
          onPress={onPressLpj}>
          <View style={[styles.iconBox, { backgroundColor: ColorPalette.amber[50] }]}>
            <ReceiptText size={22} color={ColorPalette.amber[600]} />
          </View>
          <Text style={styles.btnLabel}>Input LPJ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorPalette.slate[800],
    marginBottom: 10,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ColorPalette.slate[200],
    shadowColor: ColorPalette.slate[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  btnLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: ColorPalette.slate[800],
    textAlign: 'center',
  },
});
