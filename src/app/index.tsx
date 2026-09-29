import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTKMLStore } from '@/stores/tkml-store';
import { LoginScreen } from '@/components/login/login-screen';
import { BerandaTab } from '@/components/beranda/beranda-tab';
import { BerkasTab } from '@/components/berkas/berkas-tab';
import { ProfilUsahaScreen } from '@/components/profil/profil-usaha-screen';
import { AlamatScreen } from '@/components/profil/alamat-screen';
import { NibScreen } from '@/components/profil/nib-screen';
import { NpwpScreen } from '@/components/profil/npwp-screen';
import { RekeningScreen } from '@/components/profil/rekening-screen';
import { ProdukScreen } from '@/components/produk/produk-screen';
import { KaryawanTab } from '@/components/karyawan/karyawan-tab';
import { RabTab } from '@/components/rab/rab-tab';
import { BizHubTab } from '@/components/bizhub/bizhub-tab';
import { AkunTab } from '@/components/akun/akun-tab';
import { PresensiScreen } from '@/components/presensi/presensi-screen';
import { AppTabsNavigation } from '@/components/navigation/app-tabs-nav';
import { ToastNotification } from '@/components/ui/toast-notification';
import { ArrowLeft } from 'lucide-react-native';
import { ColorPalette } from '@/constants/colors';

export default function HomeScreen() {
  const { isAuthenticated } = useTKMLStore();
  const [currentTab, setCurrentTab] = useState(0); // 0: Beranda, 1: BizHub, 2: Akun
  const [activeSubScreen, setActiveSubScreen] = useState<
    | 'berkas'
    | 'profil_usaha'
    | 'alamat'
    | 'nib'
    | 'npwp'
    | 'rekening'
    | 'produk'
    | 'karyawan'
    | 'rab'
    | 'presensi'
    | null
  >(null);

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <LoginScreen
          onSuccessLogin={() => {
            setCurrentTab(0);
            setActiveSubScreen(null);
          }}
        />
        <ToastNotification />
      </View>
    );
  }

  // Header Back Button untuk Sub-screens
  const renderSubScreenHeader = (title: string) => (
    <SafeAreaView edges={['top']} style={styles.subScreenHeader}>
      <TouchableOpacity
        style={styles.backBtn}
        activeOpacity={0.7}
        onPress={() => setActiveSubScreen(null)}>
        <ArrowLeft size={20} color={ColorPalette.slate[800]} />
        <Text style={styles.backText}>Kembali</Text>
      </TouchableOpacity>
      <Text style={styles.subScreenTitle}>{title}</Text>
    </SafeAreaView>
  );

  const renderContent = () => {
    // Sub-screens Navigation
    if (activeSubScreen === 'berkas') {
      return (
        <View style={{ flex: 1 }}>
          {renderSubScreenHeader('Dokumen Berkas Persyaratan')}
          <BerkasTab />
        </View>
      );
    }
    if (activeSubScreen === 'profil_usaha') {
      return (
        <View style={{ flex: 1 }}>
          {renderSubScreenHeader('Profil Identitas Usaha')}
          <ProfilUsahaScreen />
        </View>
      );
    }
    if (activeSubScreen === 'alamat') {
      return (
        <View style={{ flex: 1 }}>
          {renderSubScreenHeader('Data 3 Alamat Terstruktur')}
          <AlamatScreen />
        </View>
      );
    }
    if (activeSubScreen === 'nib') {
      return (
        <View style={{ flex: 1 }}>
          {renderSubScreenHeader('Nomor Induk Berusaha (NIB OSS)')}
          <NibScreen />
        </View>
      );
    }
    if (activeSubScreen === 'npwp') {
      return (
        <View style={{ flex: 1 }}>
          {renderSubScreenHeader('Nomor Pokok Wajib Pajak (NPWP)')}
          <NpwpScreen />
        </View>
      );
    }
    if (activeSubScreen === 'rekening') {
      return (
        <View style={{ flex: 1 }}>
          {renderSubScreenHeader('Rekening Bank Penyaluran')}
          <RekeningScreen />
        </View>
      );
    }
    if (activeSubScreen === 'produk') {
      return (
        <View style={{ flex: 1 }}>
          {renderSubScreenHeader('Katalog Produk Usaha')}
          <ProdukScreen />
        </View>
      );
    }
    if (activeSubScreen === 'karyawan') {
      return (
        <View style={{ flex: 1 }}>
          {renderSubScreenHeader('Data Tenaga Kerja')}
          <KaryawanTab />
        </View>
      );
    }
    if (activeSubScreen === 'rab') {
      return (
        <View style={{ flex: 1 }}>
          {renderSubScreenHeader('RAB & Pelaporan LPJ')}
          <RabTab />
        </View>
      );
    }
    if (activeSubScreen === 'presensi') {
      return (
        <View style={{ flex: 1 }}>
          {renderSubScreenHeader('Presensi Kehadiran Pelatihan (QR)')}
          <PresensiScreen />
        </View>
      );
    }

    // 3 Primary Tabs
    switch (currentTab) {
      case 0:
        return (
          <BerandaTab
            onOpenBerkas={() => setActiveSubScreen('berkas')}
            onOpenProfilUsaha={() => setActiveSubScreen('profil_usaha')}
            onOpenAlamat={() => setActiveSubScreen('alamat')}
            onOpenNib={() => setActiveSubScreen('nib')}
            onOpenNpwp={() => setActiveSubScreen('npwp')}
            onOpenRekening={() => setActiveSubScreen('rekening')}
            onOpenKaryawan={() => setActiveSubScreen('karyawan')}
            onOpenRAB={() => setActiveSubScreen('rab')}
            onOpenBizHub={() => setCurrentTab(1)}
            onOpenPresensi={() => setActiveSubScreen('presensi')}
          />
        );
      case 1:
        return <BizHubTab />;
      case 2:
        return (
          <AkunTab
            onOpenBerkas={() => setActiveSubScreen('berkas')}
            onOpenProfilUsaha={() => setActiveSubScreen('profil_usaha')}
            onOpenAlamat={() => setActiveSubScreen('alamat')}
            onOpenNib={() => setActiveSubScreen('nib')}
            onOpenNpwp={() => setActiveSubScreen('npwp')}
            onOpenRekening={() => setActiveSubScreen('rekening')}
            onOpenProduk={() => setActiveSubScreen('produk')}
            onLogout={() => {
              setCurrentTab(0);
              setActiveSubScreen(null);
            }}
          />
        );
      default:
        return (
          <BerandaTab
            onOpenBerkas={() => setActiveSubScreen('berkas')}
            onOpenProfilUsaha={() => setActiveSubScreen('profil_usaha')}
            onOpenAlamat={() => setActiveSubScreen('alamat')}
            onOpenNib={() => setActiveSubScreen('nib')}
            onOpenNpwp={() => setActiveSubScreen('npwp')}
            onOpenRekening={() => setActiveSubScreen('rekening')}
            onOpenKaryawan={() => setActiveSubScreen('karyawan')}
            onOpenRAB={() => setActiveSubScreen('rab')}
            onOpenBizHub={() => setCurrentTab(1)}
            onOpenPresensi={() => setActiveSubScreen('presensi')}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <ToastNotification />
      <View style={styles.content}>{renderContent()}</View>
      {/* Bottom Bar selalu tampil di root 3 tab */}
      {!activeSubScreen && (
        <AppTabsNavigation
          currentTab={currentTab}
          onTabChange={(index) => {
            setActiveSubScreen(null);
            setCurrentTab(index);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  subScreenHeader: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: ColorPalette.slate[200],
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  backText: {
    fontSize: 13,
    fontWeight: '600',
    color: ColorPalette.slate[700],
  },
  subScreenTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorPalette.slate[900],
  },
});
