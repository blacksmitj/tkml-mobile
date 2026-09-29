import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTKMLStore } from '@/stores/tkml-store';
import { DetailAlamat } from '@/types/tkml';
import { ColorPalette } from '@/constants/colors';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Save,
  AlertCircle,
  Home,
  Building,
  Check,
} from 'lucide-react-native';

export const AlamatScreen: React.FC = () => {
  const { user, updateProfile } = useTKMLStore();

  // State 1: Alamat KTP
  const [alamatKtp, setAlamatKtp] = useState<DetailAlamat>({ ...user.alamatKtp });

  // State 2: Alamat Usaha
  const [alamatUsaha, setAlamatUsaha] = useState<DetailAlamat>({ ...user.alamatUsaha });
  const [isUsahaSameAsKtp, setIsUsahaSameAsKtp] = useState(false);

  // State 3: Alamat Domisili
  const [alamatDomisili, setAlamatDomisili] = useState<DetailAlamat>({ ...user.alamatDomisili });
  const [domisiliSameOption, setDomisiliSameOption] = useState<'none' | 'ktp' | 'usaha'>('none');

  // Toggle Checkbox Alamat Usaha sama dengan KTP
  const handleToggleUsahaSameAsKtp = () => {
    const nextVal = !isUsahaSameAsKtp;
    setIsUsahaSameAsKtp(nextVal);
    if (nextVal) {
      setAlamatUsaha({
        ...alamatKtp,
        isComplete: true,
      });
    }
  };

  // Toggle Checkbox Domisili sama dengan KTP / Usaha
  const handleSelectDomisiliSame = (opt: 'ktp' | 'usaha') => {
    if (domisiliSameOption === opt) {
      // Uncheck
      setDomisiliSameOption('none');
    } else {
      // Check
      setDomisiliSameOption(opt);
      if (opt === 'ktp') {
        setAlamatDomisili({
          ...alamatKtp,
          isComplete: true,
        });
      } else if (opt === 'usaha') {
        setAlamatDomisili({
          ...alamatUsaha,
          isComplete: true,
        });
      }
    }
  };

  // Sync jika KTP berubah saat checkbox aktif
  const handleUpdateKtp = (field: keyof DetailAlamat, val: string) => {
    const updated = { ...alamatKtp, [field]: val };
    setAlamatKtp(updated);

    if (isUsahaSameAsKtp) {
      setAlamatUsaha({ ...updated, isComplete: true });
    }
    if (domisiliSameOption === 'ktp') {
      setAlamatDomisili({ ...updated, isComplete: true });
    }
  };

  // Sync jika Usaha berubah saat domisili terhubung ke Usaha
  const handleUpdateUsaha = (field: keyof DetailAlamat, val: string) => {
    const updated = { ...alamatUsaha, [field]: val };
    setAlamatUsaha(updated);

    if (domisiliSameOption === 'usaha') {
      setAlamatDomisili({ ...updated, isComplete: true });
    }
  };

  const handleSaveAllAlamat = () => {
    const isKtpComplete = !!(alamatKtp.jalan && alamatKtp.kecamatan && alamatKtp.kotaKabupaten);
    const isUsahaComplete = !!(alamatUsaha.jalan && alamatUsaha.kecamatan && alamatUsaha.kotaKabupaten);
    const isDomisiliComplete = !!(
      alamatDomisili.jalan &&
      alamatDomisili.kecamatan &&
      alamatDomisili.kotaKabupaten
    );

    const updatedKtp = { ...alamatKtp, isComplete: isKtpComplete };
    const updatedUsaha = { ...alamatUsaha, isComplete: isUsahaComplete };
    const updatedDomisili = { ...alamatDomisili, isComplete: isDomisiliComplete };

    const allComplete = isKtpComplete && isUsahaComplete && isDomisiliComplete;

    updateProfile({
      alamatKtp: updatedKtp,
      alamatUsaha: updatedUsaha,
      alamatDomisili: updatedDomisili,
      statusAlamat: allComplete ? 'lengkap' : 'belum_lengkap',
      catatanRevisiAlamat: allComplete
        ? undefined
        : 'Pastikan 3 kategori alamat (KTP, Usaha, dan Domisili) telah diisi lengkap.',
    });
  };

  const isRevisi = user.statusAlamat === 'perlu_revisi';
  const isBelumLengkap = user.statusAlamat === 'belum_lengkap';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Title */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Data Alamat Terstruktur</Text>
          <Text style={styles.headerSubtitle}>
            Pengelolaan 3 kategori alamat: Alamat KTP, Lokasi Fisik Usaha, dan Domisili Tinggal.
          </Text>
        </View>

        {/* Status / Alert Notification */}
        {(isRevisi || isBelumLengkap) && (
          <View style={[styles.alertBox, isRevisi ? styles.alertBoxDanger : styles.alertBoxWarning]}>
            <AlertCircle
              size={18}
              color={isRevisi ? ColorPalette.rose[700] : ColorPalette.amber[700]}
            />
            <View style={styles.alertTextWrap}>
              <Text
                style={[
                  styles.alertTitle,
                  { color: isRevisi ? ColorPalette.rose[900] : ColorPalette.amber[900] },
                ]}>
                {isRevisi ? 'Perlu Revisi Data Alamat' : 'Alamat Belum Lengkap'}
              </Text>
              <Text
                style={[
                  styles.alertDesc,
                  { color: isRevisi ? ColorPalette.rose[700] : ColorPalette.amber[800] },
                ]}>
                {user.catatanRevisiAlamat ||
                  'Lengkapi 3 kategori alamat terstruktur untuk keperluan verifikasi faktual lapangan.'}
              </Text>
            </View>
          </View>
        )}

        {/* ===================== ALAMAT 1: KTP ===================== */}
        <Card style={styles.cardSpacing}>
          <CardHeader>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconBox, { backgroundColor: ColorPalette.primary[50] }]}>
                <Home size={18} color={ColorPalette.primary[700]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>1. Alamat Sesuai e-KTP</Text>
                <Text style={styles.sectionSubtitle}>
                  Alamat domisili hukum sesuai identitas kependudukan peserta
                </Text>
              </View>
              <Badge
                label={alamatKtp.isComplete ? 'Lengkap' : 'Belum Lengkap'}
                variant={alamatKtp.isComplete ? 'success' : 'warning'}
              />
            </View>
          </CardHeader>
          <CardContent>
            <Input
              label="Alamat Jalan / Dusun / Kampung"
              placeholder="Contoh: Jl. Merdeka No. 45"
              value={alamatKtp.jalan}
              onChangeText={(val) => handleUpdateKtp('jalan', val)}
              required
            />
            <View style={styles.rowTwo}>
              <View style={{ flex: 1 }}>
                <Input
                  label="RT / RW"
                  placeholder="RT 02 / RW 05"
                  value={alamatKtp.rtRw}
                  onChangeText={(val) => handleUpdateKtp('rtRw', val)}
                  required
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Kelurahan / Desa"
                  placeholder="Lembang"
                  value={alamatKtp.kelurahanDesa}
                  onChangeText={(val) => handleUpdateKtp('kelurahanDesa', val)}
                  required
                />
              </View>
            </View>
            <View style={styles.rowTwo}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Kecamatan"
                  placeholder="Lembang"
                  value={alamatKtp.kecamatan}
                  onChangeText={(val) => handleUpdateKtp('kecamatan', val)}
                  required
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Kota / Kabupaten"
                  placeholder="Kab. Bandung Barat"
                  value={alamatKtp.kotaKabupaten}
                  onChangeText={(val) => handleUpdateKtp('kotaKabupaten', val)}
                  required
                />
              </View>
            </View>
            <View style={styles.rowTwo}>
              <View style={{ flex: 2 }}>
                <Input
                  label="Provinsi"
                  placeholder="Jawa Barat"
                  value={alamatKtp.provinsi}
                  onChangeText={(val) => handleUpdateKtp('provinsi', val)}
                  required
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Kode Pos"
                  placeholder="40391"
                  keyboardType="number-pad"
                  value={alamatKtp.kodePos}
                  onChangeText={(val) => handleUpdateKtp('kodePos', val)}
                  required
                />
              </View>
            </View>
          </CardContent>
        </Card>

        {/* ===================== ALAMAT 2: USAHA ===================== */}
        <Card style={styles.cardSpacing}>
          <CardHeader>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconBox, { backgroundColor: ColorPalette.teal[50] }]}>
                <Building size={18} color={ColorPalette.teal[600]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>2. Alamat Lokasi Fisik Usaha</Text>
                <Text style={styles.sectionSubtitle}>
                  Lokasi tempat produksi / operasional toko kegiatan usaha
                </Text>
              </View>
              <Badge
                label={alamatUsaha.isComplete ? 'Lengkap' : 'Belum Lengkap'}
                variant={alamatUsaha.isComplete ? 'success' : 'warning'}
              />
            </View>

            {/* Checkbox: Sama dengan Alamat KTP */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              activeOpacity={0.7}
              onPress={handleToggleUsahaSameAsKtp}>
              <View
                style={[
                  styles.checkboxBox,
                  isUsahaSameAsKtp && styles.checkboxBoxChecked,
                ]}>
                {isUsahaSameAsKtp && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
              </View>
              <Text style={styles.checkboxLabel}>
                Sama dengan Alamat KTP
              </Text>
            </TouchableOpacity>
          </CardHeader>
          <CardContent>
            <Input
              label="Alamat Jalan / Lokasi Tempat Usaha"
              placeholder="Contoh: Jl. Raya Tangkuban Parahu No. 88"
              value={alamatUsaha.jalan}
              onChangeText={(val) => handleUpdateUsaha('jalan', val)}
              editable={!isUsahaSameAsKtp}
              required
            />
            <View style={styles.rowTwo}>
              <View style={{ flex: 1 }}>
                <Input
                  label="RT / RW"
                  placeholder="RT 01 / RW 03"
                  value={alamatUsaha.rtRw}
                  onChangeText={(val) => handleUpdateUsaha('rtRw', val)}
                  editable={!isUsahaSameAsKtp}
                  required
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Kelurahan / Desa"
                  placeholder="Cikole"
                  value={alamatUsaha.kelurahanDesa}
                  onChangeText={(val) => handleUpdateUsaha('kelurahanDesa', val)}
                  editable={!isUsahaSameAsKtp}
                  required
                />
              </View>
            </View>
            <View style={styles.rowTwo}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Kecamatan"
                  placeholder="Lembang"
                  value={alamatUsaha.kecamatan}
                  onChangeText={(val) => handleUpdateUsaha('kecamatan', val)}
                  editable={!isUsahaSameAsKtp}
                  required
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Kota / Kabupaten"
                  placeholder="Kab. Bandung Barat"
                  value={alamatUsaha.kotaKabupaten}
                  onChangeText={(val) => handleUpdateUsaha('kotaKabupaten', val)}
                  editable={!isUsahaSameAsKtp}
                  required
                />
              </View>
            </View>
            <View style={styles.rowTwo}>
              <View style={{ flex: 2 }}>
                <Input
                  label="Provinsi"
                  placeholder="Jawa Barat"
                  value={alamatUsaha.provinsi}
                  onChangeText={(val) => handleUpdateUsaha('provinsi', val)}
                  editable={!isUsahaSameAsKtp}
                  required
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Kode Pos"
                  placeholder="40391"
                  keyboardType="number-pad"
                  value={alamatUsaha.kodePos}
                  onChangeText={(val) => handleUpdateUsaha('kodePos', val)}
                  editable={!isUsahaSameAsKtp}
                  required
                />
              </View>
            </View>
          </CardContent>
        </Card>

        {/* ===================== ALAMAT 3: DOMISILI ===================== */}
        <Card style={styles.cardSpacing}>
          <CardHeader>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconBox, { backgroundColor: ColorPalette.amber[50] }]}>
                <MapPin size={18} color={ColorPalette.amber[600]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>3. Alamat Domisili Tinggal Sekarang</Text>
                <Text style={styles.sectionSubtitle}>
                  Alamat tempat tinggal fisik peserta saat ini
                </Text>
              </View>
              <Badge
                label={alamatDomisili.isComplete ? 'Lengkap' : 'Belum Lengkap'}
                variant={alamatDomisili.isComplete ? 'success' : 'warning'}
              />
            </View>

            {/* Checkbox Options untuk Alamat Domisili */}
            <View style={styles.domisiliChecksRow}>
              {/* Option 1: Sama dengan KTP */}
              <TouchableOpacity
                style={styles.checkboxContainer}
                activeOpacity={0.7}
                onPress={() => handleSelectDomisiliSame('ktp')}>
                <View
                  style={[
                    styles.checkboxBox,
                    domisiliSameOption === 'ktp' && styles.checkboxBoxChecked,
                  ]}>
                  {domisiliSameOption === 'ktp' && (
                    <Check size={14} color="#FFFFFF" strokeWidth={3} />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>Sama dengan KTP</Text>
              </TouchableOpacity>

              {/* Option 2: Sama dengan Usaha */}
              <TouchableOpacity
                style={styles.checkboxContainer}
                activeOpacity={0.7}
                onPress={() => handleSelectDomisiliSame('usaha')}>
                <View
                  style={[
                    styles.checkboxBox,
                    domisiliSameOption === 'usaha' && styles.checkboxBoxChecked,
                  ]}>
                  {domisiliSameOption === 'usaha' && (
                    <Check size={14} color="#FFFFFF" strokeWidth={3} />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>Sama dengan Usaha</Text>
              </TouchableOpacity>
            </View>
          </CardHeader>
          <CardContent>
            <Input
              label="Alamat Jalan / Tempat Tinggal Sekarang"
              placeholder="Alamat tempat tinggal saat ini"
              value={alamatDomisili.jalan}
              onChangeText={(val) =>
                setAlamatDomisili((prev) => ({ ...prev, jalan: val }))
              }
              editable={domisiliSameOption === 'none'}
              required
            />
            <View style={styles.rowTwo}>
              <View style={{ flex: 1 }}>
                <Input
                  label="RT / RW"
                  placeholder="RT 02 / RW 05"
                  value={alamatDomisili.rtRw}
                  onChangeText={(val) =>
                    setAlamatDomisili((prev) => ({ ...prev, rtRw: val }))
                  }
                  editable={domisiliSameOption === 'none'}
                  required
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Kelurahan / Desa"
                  placeholder="Lembang"
                  value={alamatDomisili.kelurahanDesa}
                  onChangeText={(val) =>
                    setAlamatDomisili((prev) => ({ ...prev, kelurahanDesa: val }))
                  }
                  editable={domisiliSameOption === 'none'}
                  required
                />
              </View>
            </View>
            <View style={styles.rowTwo}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Kecamatan"
                  placeholder="Lembang"
                  value={alamatDomisili.kecamatan}
                  onChangeText={(val) =>
                    setAlamatDomisili((prev) => ({ ...prev, kecamatan: val }))
                  }
                  editable={domisiliSameOption === 'none'}
                  required
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Kota / Kabupaten"
                  placeholder="Kab. Bandung Barat"
                  value={alamatDomisili.kotaKabupaten}
                  onChangeText={(val) =>
                    setAlamatDomisili((prev) => ({ ...prev, kotaKabupaten: val }))
                  }
                  editable={domisiliSameOption === 'none'}
                  required
                />
              </View>
            </View>
            <View style={styles.rowTwo}>
              <View style={{ flex: 2 }}>
                <Input
                  label="Provinsi"
                  placeholder="Jawa Barat"
                  value={alamatDomisili.provinsi}
                  onChangeText={(val) =>
                    setAlamatDomisili((prev) => ({ ...prev, provinsi: val }))
                  }
                  editable={domisiliSameOption === 'none'}
                  required
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Kode Pos"
                  placeholder="40391"
                  keyboardType="number-pad"
                  value={alamatDomisili.kodePos}
                  onChangeText={(val) =>
                    setAlamatDomisili((prev) => ({ ...prev, kodePos: val }))
                  }
                  editable={domisiliSameOption === 'none'}
                  required
                />
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Global Save Button */}
        <Button
          title="Simpan Seluruh Data Alamat"
          variant="primary"
          size="lg"
          icon={<Save size={18} color="#FFFFFF" />}
          onPress={handleSaveAllAlamat}
          style={{ marginTop: 8, marginBottom: 20 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    backgroundColor: ColorPalette.slate[50],
    minHeight: '100%',
    paddingBottom: 40,
    gap: 12,
  },
  header: {
    gap: 4,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: ColorPalette.slate[900],
  },
  headerSubtitle: {
    fontSize: 13,
    color: ColorPalette.slate[500],
    lineHeight: 18,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  alertBoxWarning: {
    backgroundColor: ColorPalette.amber[50],
    borderColor: ColorPalette.amber[300],
  },
  alertBoxDanger: {
    backgroundColor: ColorPalette.rose[50],
    borderColor: ColorPalette.rose[300],
  },
  alertTextWrap: {
    flex: 1,
    gap: 2,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  alertDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  cardSpacing: {
    marginVertical: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ColorPalette.slate[900],
  },
  sectionSubtitle: {
    fontSize: 11,
    color: ColorPalette.slate[500],
    marginTop: 2,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.8,
    borderColor: ColorPalette.slate[400],
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: ColorPalette.primary[700],
    borderColor: ColorPalette.primary[700],
  },
  checkboxLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: ColorPalette.slate[700],
  },
  domisiliChecksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  rowTwo: {
    flexDirection: 'row',
    gap: 10,
  },
});
