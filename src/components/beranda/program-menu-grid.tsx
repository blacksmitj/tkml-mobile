import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ColorPalette } from '@/constants/colors';
import {
  FolderArchive,
  Users,
  ReceiptText,
  Building2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react-native';

interface ProgramMenuGridProps {
  onOpenBerkas: () => void;
  onOpenKaryawan: () => void;
  onOpenRAB: () => void;
  jumlahRevisi: number;
  totalKaryawan: number;
  totalDisabilitas: number;
  progressLPJPercent: number;
}

export const ProgramMenuGrid: React.FC<ProgramMenuGridProps> = ({
  onOpenBerkas,
  onOpenKaryawan,
  onOpenRAB,
  jumlahRevisi,
  totalKaryawan,
  totalDisabilitas,
  progressLPJPercent,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Menu Utama Program TKML</Text>

      {/* Grid 3 Kartu Menu Program */}
      <View style={styles.grid}>
        {/* Menu 1: Berkas & Usaha */}
        <TouchableOpacity
          style={styles.menuCard}
          activeOpacity={0.8}
          onPress={onOpenBerkas}>
          <View style={[styles.iconBox, { backgroundColor: ColorPalette.primary[50] }]}>
            <FolderArchive size={24} color={ColorPalette.primary[700]} />
          </View>
          <View style={styles.cardContent}>
            <View style={styles.titleRow}>
              <Text style={styles.cardTitle}>Berkas & Usaha</Text>
              {jumlahRevisi > 0 && (
                <View style={styles.revisiBadge}>
                  <Text style={styles.revisiBadgeText}>{jumlahRevisi} Revisi</Text>
                </View>
              )}
            </View>
            <Text style={styles.cardSubtitle}>
              KTP, NIB, Rekening & Profil Usaha
            </Text>
          </View>
          <ChevronRight size={18} color={ColorPalette.slate[400]} />
        </TouchableOpacity>

        {/* Menu 2: Tenaga Kerja / Karyawan */}
        <TouchableOpacity
          style={styles.menuCard}
          activeOpacity={0.8}
          onPress={onOpenKaryawan}>
          <View style={[styles.iconBox, { backgroundColor: ColorPalette.teal[50] }]}>
            <Users size={24} color={ColorPalette.teal[600]} />
          </View>
          <View style={styles.cardContent}>
            <View style={styles.titleRow}>
              <Text style={styles.cardTitle}>Data Tenaga Kerja</Text>
              {totalDisabilitas > 0 && (
                <View style={styles.disabilitasBadge}>
                  <Text style={styles.disabilitasBadgeText}>{totalDisabilitas} Disabilitas</Text>
                </View>
              )}
            </View>
            <Text style={styles.cardSubtitle}>
              {totalKaryawan} Orang Karyawan Terdaftar
            </Text>
          </View>
          <ChevronRight size={18} color={ColorPalette.slate[400]} />
        </TouchableOpacity>

        {/* Menu 3: RAB & Pelaporan Belanja LPJ */}
        <TouchableOpacity
          style={styles.menuCard}
          activeOpacity={0.8}
          onPress={onOpenRAB}>
          <View style={[styles.iconBox, { backgroundColor: ColorPalette.amber[50] }]}>
            <ReceiptText size={24} color={ColorPalette.amber[600]} />
          </View>
          <View style={styles.cardContent}>
            <View style={styles.titleRow}>
              <Text style={styles.cardTitle}>RAB & LPJ Belanja</Text>
              <View style={styles.progressBadge}>
                <Text style={styles.progressBadgeText}>{progressLPJPercent}% LPJ</Text>
              </View>
            </View>
            <Text style={styles.cardSubtitle}>
              Rincian Anggaran & Upload Kuitansi
            </Text>
          </View>
          <ChevronRight size={18} color={ColorPalette.slate[400]} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorPalette.slate[800],
  },
  grid: {
    gap: 10,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: ColorPalette.slate[200],
    shadowColor: ColorPalette.slate[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    gap: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ColorPalette.slate[900],
  },
  cardSubtitle: {
    fontSize: 12,
    color: ColorPalette.slate[500],
  },
  revisiBadge: {
    backgroundColor: ColorPalette.rose[100],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  revisiBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: ColorPalette.rose[700],
  },
  disabilitasBadge: {
    backgroundColor: ColorPalette.amber[100],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  disabilitasBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: ColorPalette.amber[800],
  },
  progressBadge: {
    backgroundColor: ColorPalette.emerald[100],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  progressBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: ColorPalette.emerald[800],
  },
});
