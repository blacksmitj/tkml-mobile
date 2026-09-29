import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTKMLStore } from '@/stores/tkml-store';
import { ColorPalette } from '@/constants/colors';
import { UserHeader } from '@/components/beranda/user-header';
import { ProgressStepper } from '@/components/beranda/progress-stepper';
import { AlertRevisiCard } from '@/components/beranda/alert-revisi-card';
import { ProgramMenuGrid } from '@/components/beranda/program-menu-grid';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Store, ChevronRight, Sparkles, MapPin } from 'lucide-react-native';

interface BerandaTabProps {
  onOpenBerkas: () => void;
  onOpenKaryawan: () => void;
  onOpenRAB: () => void;
  onOpenBizHub: () => void;
}

export const BerandaTab: React.FC<BerandaTabProps> = ({
  onOpenBerkas,
  onOpenKaryawan,
  onOpenRAB,
  onOpenBizHub,
}) => {
  const { user, berkasList, karyawanList, rabList, lpjList, bizHubAds } = useTKMLStore();

  const berkasPerluRevisi = berkasList.filter((b) => b.status === 'perlu_revisi');
  const totalKaryawan = karyawanList.length;
  const totalDisabilitas = karyawanList.filter((k) => k.disabilitas !== 'tidak_ada').length;

  const totalUsulan = rabList.reduce((acc, item) => acc + item.subtotal, 0);
  const totalRealisasi = lpjList.reduce((acc, item) => acc + item.nominalRiil, 0);
  const progressLPJPercent =
    totalUsulan > 0 ? Math.min(100, Math.round((totalRealisasi / totalUsulan) * 100)) : 0;

  const catatanRevisi = berkasPerluRevisi
    .map((b) => `${b.nama}: ${b.catatanAdmin || 'Harap perbaiki dokumen'}`)
    .filter(Boolean);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={ColorPalette.primary[700]} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Header Sapaan & Profil TKML */}
        <UserHeader user={user} />

        <View style={styles.bodyContainer}>
          {/* Stepper Progres Program */}
          <ProgressStepper currentTahap={user.tahapanProgram} />

          {/* Alert Revisi jika ada dokumen bermasalah */}
          <AlertRevisiCard
            jumlahRevisi={berkasPerluRevisi.length}
            catatanList={catatanRevisi}
            onPressAction={onOpenBerkas}
          />

          {/* Banner Shortcut ke BizHub (Bisnis Hub) */}
          <TouchableOpacity
            style={styles.bizhubBanner}
            activeOpacity={0.85}
            onPress={onOpenBizHub}>
            <View style={styles.bizhubBannerLeft}>
              <View style={styles.bizhubIconBox}>
                <Store size={22} color="#FFFFFF" />
              </View>
              <View style={styles.bizhubTextWrap}>
                <View style={styles.bizhubTitleRow}>
                  <Text style={styles.bizhubTitle}>Bisnis Hub (BizHub)</Text>
                  <Sparkles size={14} color={ColorPalette.amber[300]} />
                </View>
                <Text style={styles.bizhubSubtitle}>
                  Ada {bizHubAds.length} produk & bahan baku dari peserta TKML sekitar Anda
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Menu Utama Program TKML (SuperApp Grid) */}
          <ProgramMenuGrid
            onOpenBerkas={onOpenBerkas}
            onOpenKaryawan={onOpenKaryawan}
            onOpenRAB={onOpenRAB}
            jumlahRevisi={berkasPerluRevisi.length}
            totalKaryawan={totalKaryawan}
            totalDisabilitas={totalDisabilitas}
            progressLPJPercent={progressLPJPercent}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ColorPalette.primary[700],
  },
  scrollContent: {
    backgroundColor: ColorPalette.slate[50],
    minHeight: '100%',
    paddingBottom: 40,
  },
  bodyContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  bizhubBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ColorPalette.primary[800],
    borderRadius: 16,
    padding: 14,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: ColorPalette.primary[600],
    shadowColor: ColorPalette.primary[900],
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  bizhubBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 6,
  },
  bizhubIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: ColorPalette.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  bizhubTextWrap: {
    flex: 1,
  },
  bizhubTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bizhubTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bizhubSubtitle: {
    fontSize: 12,
    color: ColorPalette.primary[200],
    marginTop: 2,
    lineHeight: 16,
  },
});
