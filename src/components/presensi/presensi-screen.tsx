import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTKMLStore } from '@/stores/tkml-store';
import { ColorPalette } from '@/constants/colors';
import { QRCameraScanner } from '@/components/presensi/qr-camera-scanner';
import { SesiCardItem } from '@/components/presensi/sesi-card-item';
import { RiwayatPresensiList } from '@/components/presensi/riwayat-presensi-list';
import { DemoQRModal } from '@/components/presensi/demo-qr-modal';
import { SesiPresensi } from '@/types/tkml';
import {
  QrCode,
  CalendarDays,
  History,
  Sparkles,
  ShieldCheck,
  MapPin,
  Clock,
} from 'lucide-react-native';

export const PresensiScreen: React.FC = () => {
  const {
    sesiPresensiList,
    riwayatPresensiList,
    submitPresensiQR,
    deleteRiwayatPresensi,
  } = useTKMLStore();

  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0); // 0: Scan QR, 1: Jadwal Sesi, 2: Riwayat
  const [demoModalVisible, setDemoModalVisible] = useState(false);
  const [selectedSessionForScan, setSelectedSessionForScan] = useState<
    SesiPresensi | undefined
  >(sesiPresensiList.find((s) => s.status === 'aktif') || sesiPresensiList[0]);

  const activeSesi = sesiPresensiList.find((s) => s.status === 'aktif');

  const handleScanSuccess = (
    token: string,
    coords?: { latitude: number; longitude: number },
    metode?: 'qr_camera' | 'kode_manual' | 'demo_simulasi'
  ) => {
    return submitPresensiQR(
      token,
      coords?.latitude,
      coords?.longitude,
      metode
    );
  };

  const handleSelectDemoToken = (token: string, sesi: SesiPresensi) => {
    setSelectedSessionForScan(sesi);
    // Submit as demo simulation
    submitPresensiQR(
      token,
      sesi.latitude + 0.0001,
      sesi.longitude + 0.0001,
      'demo_simulasi'
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Segmented Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 0 && styles.tabBtnActive]}
          activeOpacity={0.8}
          onPress={() => setActiveTab(0)}>
          <QrCode
            size={16}
            color={activeTab === 0 ? ColorPalette.primary[700] : ColorPalette.slate[500]}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 0 && styles.tabTextActive,
            ]}>
            Scan Kamera
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 1 && styles.tabBtnActive]}
          activeOpacity={0.8}
          onPress={() => setActiveTab(1)}>
          <CalendarDays
            size={16}
            color={activeTab === 1 ? ColorPalette.primary[700] : ColorPalette.slate[500]}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 1 && styles.tabTextActive,
            ]}>
            Jadwal Sesi
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 2 && styles.tabBtnActive]}
          activeOpacity={0.8}
          onPress={() => setActiveTab(2)}>
          <History
            size={16}
            color={activeTab === 2 ? ColorPalette.primary[700] : ColorPalette.slate[500]}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 2 && styles.tabTextActive,
            ]}>
            Riwayat ({riwayatPresensiList.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* TAB 0: SCAN QR */}
        {activeTab === 0 && (
          <View style={styles.tabBody}>
            {/* Header info box */}
            <View style={styles.infoBanner}>
              <View style={styles.shieldIconWrap}>
                <ShieldCheck size={20} color={ColorPalette.primary[700]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoBannerTitle}>
                  Verifikasi Kehadiran Resmi TKML
                </Text>
                <Text style={styles.infoBannerDesc}>
                  Arahkan kamera ke QR Code yang ditampilkan instruktur. Pastikan Anda berada dalam radius lokasi kegiatan.
                </Text>
              </View>
            </View>

            {/* Kamera Viewfinder */}
            <QRCameraScanner
              activeSession={selectedSessionForScan || activeSesi}
              onScanSuccess={handleScanSuccess}
              onOpenDemo={() => setDemoModalVisible(true)}
            />

            {/* Petunjuk Penggunaan */}
            <View style={styles.tipsBox}>
              <Text style={styles.tipsTitle}>💡 Tips Presensi Cepat:</Text>
              <Text style={styles.tipItem}>
                • Nyalakan <Text style={{ fontWeight: '700' }}>Flash/Senter</Text> jika ruangan minim cahaya.
              </Text>
              <Text style={styles.tipItem}>
                • Gunakan <Text style={{ fontWeight: '700' }}>Input Kode Manual</Text> jika QR Code rusak atau tidak terbaca kamera.
              </Text>
              <Text style={styles.tipItem}>
                • Tekan tombol <Text style={{ fontWeight: '700' }}>Demo / Test QR</Text> untuk mencoba simulasi presensi secara instan.
              </Text>
            </View>
          </View>
        )}

        {/* TAB 1: JADWAL SESI */}
        {activeTab === 1 && (
          <View style={styles.tabBody}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeaderTitle}>
                Daftar Sesi Bimtek & Pendampingan
              </Text>
              <TouchableOpacity
                style={styles.demoShortcut}
                onPress={() => setDemoModalVisible(true)}>
                <Sparkles size={14} color={ColorPalette.primary[600]} />
                <Text style={styles.demoShortcutText}>Buka Demo</Text>
              </TouchableOpacity>
            </View>

            {sesiPresensiList.map((sesi) => {
              const isAttended = riwayatPresensiList.some(
                (r) => r.sesiId === sesi.id
              );
              return (
                <SesiCardItem
                  key={sesi.id}
                  sesi={sesi}
                  isAttended={isAttended}
                  onScanThisSession={(selected) => {
                    setSelectedSessionForScan(selected);
                    setActiveTab(0);
                  }}
                />
              );
            })}
          </View>
        )}

        {/* TAB 2: RIWAYAT PRESENSI */}
        {activeTab === 2 && (
          <View style={styles.tabBody}>
            <RiwayatPresensiList
              riwayatList={riwayatPresensiList}
              onDeleteRecord={deleteRiwayatPresensi}
              onOpenScanner={() => setActiveTab(0)}
            />
          </View>
        )}
      </ScrollView>

      {/* Simulator Modal */}
      <DemoQRModal
        visible={demoModalVisible}
        onClose={() => setDemoModalVisible(false)}
        sesiList={sesiPresensiList}
        onSelectToken={handleSelectDemoToken}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorPalette.slate[50],
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: ColorPalette.slate[200],
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: ColorPalette.slate[100],
  },
  tabBtnActive: {
    backgroundColor: ColorPalette.primary[50],
    borderWidth: 1,
    borderColor: ColorPalette.primary[200],
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: ColorPalette.slate[600],
  },
  tabTextActive: {
    color: ColorPalette.primary[800],
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  tabBody: {
    gap: 14,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: ColorPalette.slate[200],
  },
  shieldIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ColorPalette.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ColorPalette.slate[900],
  },
  infoBannerDesc: {
    fontSize: 11,
    color: ColorPalette.slate[500],
    marginTop: 2,
    lineHeight: 16,
  },
  tipsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: ColorPalette.slate[200],
    gap: 6,
  },
  tipsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorPalette.slate[800],
    marginBottom: 2,
  },
  tipItem: {
    fontSize: 11,
    color: ColorPalette.slate[600],
    lineHeight: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorPalette.slate[800],
  },
  demoShortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ColorPalette.primary[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  demoShortcutText: {
    fontSize: 11,
    fontWeight: '700',
    color: ColorPalette.primary[700],
  },
});
