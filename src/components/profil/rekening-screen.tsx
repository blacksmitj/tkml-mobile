import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useTKMLStore } from '@/stores/tkml-store';
import { ColorPalette } from '@/constants/colors';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Landmark,
  Save,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Info,
  Building,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const POPULAR_BANKS = [
  'Bank Mandiri',
  'Bank Rakyat Indonesia (BRI)',
  'Bank Negara Indonesia (BNI)',
  'Bank Central Asia (BCA)',
  'Bank Syariah Indonesia (BSI)',
  'Bank Tabungan Negara (BTN)',
  'Bank Jabar Banten (BJB)',
];

export const RekeningScreen: React.FC = () => {
  const { user, updateProfile } = useTKMLStore();

  const [bankName, setBankName] = useState(user.rekeningBank.bankName || '');
  const [bankAccountNo, setBankAccountNo] = useState(user.rekeningBank.bankAccountNo || '');
  const [bankAccountName, setBankAccountName] = useState(
    user.rekeningBank.bankAccountName || user.namaLengkap
  );
  const [bankKcp, setBankKcp] = useState(user.rekeningBank.bankKcp || '');
  const [bukuTabunganUri, setBukuTabunganUri] = useState(
    user.rekeningBank.bukuTabunganUri || ''
  );
  const [fileSizeFormatted, setFileSizeFormatted] = useState(
    user.rekeningBank.fileSizeFormatted || ''
  );
  const [previewVisible, setPreviewVisible] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.6,
    });

    if (!result.canceled && result.assets[0]) {
      setBukuTabunganUri(result.assets[0].uri);
      setFileSizeFormatted('420 KB');
      setErrors((prev) => ({ ...prev, bukuTabunganUri: '' }));
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Izin kamera diperlukan untuk mengambil foto buku tabungan');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.6,
    });

    if (!result.canceled && result.assets[0]) {
      setBukuTabunganUri(result.assets[0].uri);
      setFileSizeFormatted('480 KB');
      setErrors((prev) => ({ ...prev, bukuTabunganUri: '' }));
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!bankName.trim()) {
      errs.bankName = 'Nama Bank penyalur wajib dipilih atau diisi';
    }
    if (!bankAccountNo || bankAccountNo.replace(/[^0-9]/g, '').length < 8) {
      errs.bankAccountNo = 'Nomor rekening bank minimal 8 digit angka';
    }
    if (!bankAccountName.trim()) {
      errs.bankAccountName = 'Nama pemilik rekening wajib diisi sesuai buku tabungan';
    }
    if (!bukuTabunganUri) {
      errs.bukuTabunganUri = 'Wajib mengunggah foto halaman depan buku tabungan / e-statement';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    updateProfile({
      rekeningBank: {
        bankName,
        bankAccountNo,
        bankAccountName,
        bankKcp,
        bukuTabunganUri,
        fileSizeFormatted: fileSizeFormatted || '420 KB',
        uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        status: 'lengkap',
        catatanRevisi: undefined,
      },
    });
  };

  const isRevisi = user.rekeningBank.status === 'perlu_revisi';
  const isBelumLengkap = user.rekeningBank.status === 'belum_lengkap';
  const isLengkap = user.rekeningBank.status === 'lengkap';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Title */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.headerTitle}>Rekening Bank Penyaluran</Text>
            {isLengkap && <Badge label="Lengkap" variant="success" />}
            {isRevisi && <Badge label="Perlu Revisi" variant="danger" />}
            {isBelumLengkap && <Badge label="Belum Lengkap" variant="warning" />}
          </View>
          <Text style={styles.headerSubtitle}>
            Rekening bank aktif atas nama pemilik usaha untuk pencairan dana bantuan TKML Kemnaker.
          </Text>
        </View>

        {/* Alert Catatan Revisi jika ada */}
        {isRevisi && (
          <View style={[styles.alertBox, styles.alertBoxDanger]}>
            <AlertCircle size={18} color={ColorPalette.rose[700]} />
            <View style={styles.alertTextWrap}>
              <Text style={styles.alertDangerTitle}>Catatan Revisi Rekening:</Text>
              <Text style={styles.alertDangerDesc}>
                {user.rekeningBank.catatanRevisi ||
                  'Nama pada buku tabungan berbeda dengan identitas KTP pemohon.'}
              </Text>
            </View>
          </View>
        )}

        {/* Info Banner Kemnaker */}
        <View style={styles.infoBanner}>
          <Info size={16} color={ColorPalette.teal[700]} />
          <Text style={styles.infoBannerText}>
            Pastikan rekening dalam kondisi aktif dan nama pemilik rekening sama dengan nama pemohon di KTP.
          </Text>
        </View>

        {/* Form Data Rekening */}
        <Card style={styles.cardSpacing}>
          <CardHeader>
            <View style={styles.sectionHeader}>
              <Landmark size={20} color={ColorPalette.primary[700]} />
              <Text style={styles.sectionTitle}>Rincian Rekening Bank</Text>
            </View>
          </CardHeader>
          <CardContent>
            {/* Quick Bank Selector */}
            <Text style={styles.bankPickerLabel}>Pilih Bank Umum / Syariah:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.bankPillScroll}>
              {POPULAR_BANKS.map((b) => {
                const isSelected = bankName === b;
                return (
                  <TouchableOpacity
                    key={b}
                    style={[styles.bankPill, isSelected && styles.bankPillActive]}
                    onPress={() => {
                      setBankName(b);
                      if (errors.bankName) setErrors((prev) => ({ ...prev, bankName: '' }));
                    }}>
                    <Text
                      style={[
                        styles.bankPillText,
                        isSelected && styles.bankPillTextActive,
                      ]}>
                      {b}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Input
              label="Nama Bank"
              value={bankName}
              onChangeText={(text) => {
                setBankName(text);
                if (errors.bankName) setErrors((prev) => ({ ...prev, bankName: '' }));
              }}
              placeholder="Contoh: Bank Mandiri"
              error={errors.bankName}
              required
            />

            <Input
              label="Nomor Rekening Bank"
              value={bankAccountNo}
              onChangeText={(text) => {
                setBankAccountNo(text);
                if (errors.bankAccountNo) setErrors((prev) => ({ ...prev, bankAccountNo: '' }));
              }}
              keyboardType="number-pad"
              placeholder="Contoh: 1310012345678"
              error={errors.bankAccountNo}
              required
            />

            <Input
              label="Nama Pemilik Rekening (Sesuai Buku Tabungan)"
              value={bankAccountName}
              onChangeText={(text) => {
                setBankAccountName(text);
                if (errors.bankAccountName) setErrors((prev) => ({ ...prev, bankAccountName: '' }));
              }}
              placeholder="Contoh: Asep Sunandar"
              error={errors.bankAccountName}
              hint="Wajib sama persis dengan nama di rekening / KTP."
              required
            />

            <Input
              label="Kantor Cabang Pembantu (KCP) / Kota Pembukaan"
              value={bankKcp}
              onChangeText={setBankKcp}
              placeholder="Contoh: KCP Lembang / KC Bandung Setiabudi"
              hint="Opsional, membantu mempercepat proses transfer kliring Kemnaker."
            />
          </CardContent>
        </Card>

        {/* Upload Dokumen Buku Tabungan */}
        <Card style={styles.cardSpacing}>
          <CardHeader>
            <View style={styles.sectionHeader}>
              <ImageIcon size={20} color={ColorPalette.primary[700]} />
              <Text style={styles.sectionTitle}>Unggah Foto Buku Tabungan / E-Statement</Text>
            </View>
          </CardHeader>
          <CardContent>
            <Text style={styles.uploadDescription}>
              Unggah foto halaman pertama buku tabungan yang memuat nomor rekening, nama pemilik, dan stempel bank, atau screenshot e-statement resmi.
            </Text>

            {/* Preview jika sudah ada */}
            {bukuTabunganUri ? (
              <View style={styles.previewContainer}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setPreviewVisible(true)}
                  style={styles.imageWrapper}>
                  <Image source={{ uri: bukuTabunganUri }} style={styles.previewImage} resizeMode="cover" />
                  <View style={styles.previewOverlay}>
                    <Text style={styles.previewOverlayText}>Ketuk untuk perbesar</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.fileMetaRow}>
                  <View style={styles.fileMetaLeft}>
                    <CheckCircle2 size={16} color={ColorPalette.teal[600]} />
                    <Text style={styles.fileMetaText}>
                      Foto buku tabungan terunggah {fileSizeFormatted ? `(${fileSizeFormatted})` : ''}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setBukuTabunganUri('')}
                    style={styles.deleteFileBtn}>
                    <Text style={styles.deleteFileText}>Ganti Foto</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.uploadButtonGroup}>
                <TouchableOpacity
                  style={styles.uploadBox}
                  activeOpacity={0.7}
                  onPress={handlePickImage}>
                  <ImageIcon size={24} color={ColorPalette.primary[600]} />
                  <Text style={styles.uploadBoxTitle}>Pilih dari Galeri</Text>
                  <Text style={styles.uploadBoxSubtitle}>Format JPG, PNG (Maks 5MB)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.uploadBox}
                  activeOpacity={0.7}
                  onPress={handleTakePhoto}>
                  <Camera size={24} color={ColorPalette.primary[600]} />
                  <Text style={styles.uploadBoxTitle}>Foto dengan Kamera</Text>
                  <Text style={styles.uploadBoxSubtitle}>Ambil foto buku tabungan</Text>
                </TouchableOpacity>
              </View>
            )}

            {errors.bukuTabunganUri ? (
              <Text style={styles.errorText}>{errors.bukuTabunganUri}</Text>
            ) : null}
          </CardContent>
        </Card>

        {/* Tombol Simpan */}
        <View style={styles.buttonContainer}>
          <Button
            title="Simpan & Perbarui Rekening"
            icon={<Save size={18} color="#FFFFFF" />}
            onPress={handleSave}
            variant="primary"
          />
        </View>
      </ScrollView>

      {/* Fullscreen Image Preview Modal */}
      <Modal
        visible={previewVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPreviewVisible(false)}>
        <View style={styles.modalBackdrop}>
          <SafeAreaView style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Foto Buku Tabungan</Text>
            <TouchableOpacity
              onPress={() => setPreviewVisible(false)}
              style={styles.closeBtn}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </SafeAreaView>
          <View style={styles.modalImageWrap}>
            {bukuTabunganUri ? (
              <Image
                source={{ uri: bukuTabunganUri }}
                style={styles.modalFullImage}
                resizeMode="contain"
              />
            ) : null}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ColorPalette.background.main,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: ColorPalette.slate[900],
    flex: 1,
    marginRight: 8,
  },
  headerSubtitle: {
    fontSize: 13,
    color: ColorPalette.slate[600],
    lineHeight: 18,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorPalette.teal[50],
    borderWidth: 1,
    borderColor: ColorPalette.teal[200],
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 16,
  },
  infoBannerText: {
    fontSize: 12,
    color: ColorPalette.teal[900],
    flex: 1,
    lineHeight: 17,
  },
  alertBox: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 10,
    alignItems: 'flex-start',
  },
  alertBoxDanger: {
    backgroundColor: ColorPalette.rose[50],
    borderColor: ColorPalette.rose[200],
    borderWidth: 1,
  },
  alertTextWrap: {
    flex: 1,
  },
  alertDangerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ColorPalette.rose[900],
    marginBottom: 2,
  },
  alertDangerDesc: {
    fontSize: 12,
    color: ColorPalette.rose[700],
    lineHeight: 17,
  },
  cardSpacing: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ColorPalette.slate[800],
  },
  bankPickerLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: ColorPalette.slate[700],
    marginBottom: 8,
  },
  bankPillScroll: {
    gap: 8,
    paddingBottom: 12,
  },
  bankPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: ColorPalette.slate[100],
    borderWidth: 1,
    borderColor: ColorPalette.slate[200],
  },
  bankPillActive: {
    backgroundColor: ColorPalette.primary[700],
    borderColor: ColorPalette.primary[800],
  },
  bankPillText: {
    fontSize: 12,
    fontWeight: '500',
    color: ColorPalette.slate[700],
  },
  bankPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  uploadDescription: {
    fontSize: 13,
    color: ColorPalette.slate[600],
    lineHeight: 18,
    marginBottom: 14,
  },
  uploadButtonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadBox: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: ColorPalette.primary[200],
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ColorPalette.primary[50],
    minHeight: 110,
  },
  uploadBoxTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: ColorPalette.primary[800],
    marginTop: 8,
    marginBottom: 2,
    textAlign: 'center',
  },
  uploadBoxSubtitle: {
    fontSize: 11,
    color: ColorPalette.slate[500],
    textAlign: 'center',
  },
  previewContainer: {
    marginTop: 4,
  },
  imageWrapper: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: ColorPalette.slate[900],
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 6,
    alignItems: 'center',
  },
  previewOverlayText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '500',
  },
  fileMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  fileMetaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fileMetaText: {
    fontSize: 12,
    color: ColorPalette.teal[700],
    fontWeight: '500',
  },
  deleteFileBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteFileText: {
    fontSize: 12,
    color: ColorPalette.primary[600],
    fontWeight: '600',
  },
  errorText: {
    color: ColorPalette.rose[600],
    fontSize: 12,
    marginTop: 6,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#000000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeBtn: {
    padding: 4,
  },
  modalImageWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalFullImage: {
    width: width,
    height: '80%',
  },
});
