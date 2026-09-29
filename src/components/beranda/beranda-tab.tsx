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
import { ActionCenterNotifications } from '@/components/beranda/action-center-notifications';
import { ProgramMenuGrid } from '@/components/beranda/program-menu-grid';
import {
  Store,
  ChevronRight,
  Sparkles,
  QrCode,
  ScanLine,
  MapPin,
  CalendarCheck,
} from 'lucide-react-native';

interface BerandaTabProps {
  onOpenBerkas: () => void;
  onOpenProfilUsaha: () => void;
  onOpenAlamat: () => void;
  onOpenNib: () => void;
  onOpenNpwp: () => void;
  onOpenRekening: () => void;
  onOpenKaryawan: () => void;
  onOpenRAB: () => void;
  onOpenBizHub: () => void;
  onOpenPresensi: () => void;
}

export const BerandaTab: React.FC<BerandaTabProps> = ({
  onOpenBerkas,
  onOpenProfilUsaha,
  onOpenAlamat,
  onOpenNib,
  onOpenNpwp,
  onOpenRekening,
  onOpenKaryawan,
  onOpenRAB,
  onOpenBizHub,
  onOpenPresensi,
}) => {
  const {
    user,
    berkasList,
    karyawanList,
    rabList,
    lpjList,
    bizHubAds,
    sesiPresensiList,
    riwayatPresensiList,
  } = useTKMLStore();

  const activeSesi = sesiPresensiList.find((s) => s.status === 'aktif');
  const hasAttendedActiveSesi = activeSesi
    ? riwayatPresensiList.some((r) => r.sesiId === activeSesi.id)
    : false;

  const berkasPerluRevisi = berkasList.filter((b) => b.status === 'perlu_revisi');
  const isProfilIncomplete =
    user.statusProfilUsaha === 'perlu_revisi' || user.statusProfilUsaha === 'belum_lengkap';
  const isAlamatIncomplete =
    user.statusAlamat === 'perlu_revisi' || user.statusAlamat === 'belum_lengkap';
  
  const isNibIncomplete =
    user.nib.status === 'perlu_revisi' || user.nib.status === 'belum_lengkap';
  const isNpwpIncomplete =
    user.npwp.status === 'perlu_revisi' || user.npwp.status === 'belum_lengkap';
  const isRekeningIncomplete =
    user.rekeningBank.status === 'perlu_revisi' || user.rekeningBank.status === 'belum_lengkap';

  const totalKaryawan = karyawanList.length;
  const totalDisabilitas = karyawanList.filter((k) => k.disabilitas !== 'tidak_ada').length;

  const totalUsulan = rabList.reduce((acc, item) => acc + item.subtotal, 0);
  const totalRealisasi = lpjList.reduce((acc, item) => acc + item.nominalRiil, 0);
  const progressLPJPercent =
    totalUsulan > 0 ? Math.min(100, Math.round((totalRealisasi / totalUsulan) * 100)) : 0;

  const catatanRevisiBerkas = berkasPerluRevisi
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

          {/* Action Center Notifications (NIB, NPWP, Rekening, Berkas, Profil, Alamat) */}
          <ActionCenterNotifications
            berkasRevisiCount={berkasPerluRevisi.length}
            isProfilIncomplete={isProfilIncomplete}
            isAlamatIncomplete={isAlamatIncomplete}
            isNibIncomplete={isNibIncomplete}
            isNpwpIncomplete={isNpwpIncomplete}
            isRekeningIncomplete={isRekeningIncomplete}
            catatanRevisiBerkas={catatanRevisiBerkas}
            catatanRevisiProfil={user.catatanRevisiProfil}
            catatanRevisiAlamat={user.catatanRevisiAlamat}
            catatanRevisiNib={user.nib.catatanRevisi}
            catatanRevisiNpwp={user.npwp.catatanRevisi}
            catatanRevisiRekening={user.rekeningBank.catatanRevisi}
            onOpenBerkas={onOpenBerkas}
            onOpenProfilUsaha={onOpenProfilUsaha}
            onOpenAlamat={onOpenAlamat}
            onOpenNib={onOpenNib}
            onOpenNpwp={onOpenNpwp}
            onOpenRekening={onOpenRekening}
          />

          {/* Quick Action Banner: Scan Presensi Kehadiran QR */}
          <TouchableOpacity
            style={styles.presensiBanner}
            activeOpacity={0.85}
            onPress={onOpenPresensi}>
            <View style={styles.presensiBannerLeft}>
              <View style={styles.presensiIconBox}>
                <ScanLine size={24} color="#FFFFFF" />
              </View>
              <View style={styles.presensiTextWrap}>
                <View style={styles.presensiTitleRow}>
                  <Text style={styles.presensiTitle}>Presensi QR Sesi Pelatihan</Text>
                  {hasAttendedActiveSesi ? (
                    <View style={styles.attendedMiniBadge}>
                      <Text style={styles.attendedMiniText}>Sudah Hadir</Text>
                    </View>
                  ) : activeSesi ? (
                    <View style={styles.activeMiniBadge}>
                      <Text style={styles.activeMiniText}>Sesi Aktif</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.presensiSubtitle} numberOfLines={1}>
                  {activeSesi ? activeSesi.judulSesi : 'Cek jadwal & scan QR kehadiran bimtek'}
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color={ColorPalette.emerald[800]} />
          </TouchableOpacity>

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
            onOpenPresensi={onOpenPresensi}
            jumlahRevisi={berkasPerluRevisi.length}
            totalKaryawan={totalKaryawan}
            totalDisabilitas={totalDisabilitas}
            progressLPJPercent={progressLPJPercent}
            totalPresensi={riwayatPresensiList.length}
            hasActiveSesi={!!activeSesi}
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
  presensiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: ColorPalette.emerald[300],
    shadowColor: ColorPalette.emerald[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  presensiBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 6,
  },
  presensiIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: ColorPalette.emerald[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  presensiTextWrap: {
    flex: 1,
  },
  presensiTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  presensiTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: ColorPalette.emerald[900],
  },
  presensiSubtitle: {
    fontSize: 12,
    color: ColorPalette.emerald[700],
    marginTop: 2,
    lineHeight: 16,
  },
  activeMiniBadge: {
    backgroundColor: ColorPalette.emerald[200],
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  activeMiniText: {
    fontSize: 9,
    fontWeight: '800',
    color: ColorPalette.emerald[900],
  },
  attendedMiniBadge: {
    backgroundColor: ColorPalette.blue[100],
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  attendedMiniText: {
    fontSize: 9,
    fontWeight: '800',
    color: ColorPalette.blue[800],
  },
});
