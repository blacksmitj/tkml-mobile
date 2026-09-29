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
  CreditCard,
  Save,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export const NpwpScreen: React.FC = () => {
  const { user, updateProfile } = useTKMLStore();

  const [nomor, setNomor] = useState(user.npwp.nomor || '');
  const [namaTerdaftar, setNamaTerdaftar] = useState(user.npwp.namaTerdaftar || user.namaLengkap);
  const [fileUri, setFileUri] = useState(user.npwp.fileUri || '');
  const [fileSizeFormatted, setFileSizeFormatted] = useState(user.npwp.fileSizeFormatted || '');
  const [previewVisible, setPreviewVisible] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.6,
    });

    if (!result.canceled && result.assets[0]) {
      setFileUri(result.assets[0].uri);
      setFileSizeFormatted('380 KB');
      setErrors((prev) => ({ ...prev, fileUri: '' }));
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Izin kamera diperlukan untuk mengambil foto NPWP');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.6,
    });

    if (!result.canceled && result.assets[0]) {
      setFileUri(result.assets[0].uri);
      setFileSizeFormatted('410 KB');
      setErrors((prev) => ({ ...prev, fileUri: '' }));
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    const cleanNum = nomor.replace(/[^0-9]/g, '');
    if (!nomor || (cleanNum.length !== 15 && cleanNum.length !== 16)) {
      errs.nomor = 'Nomor Pokok Wajib Pajak (NPWP) harus 15 atau 16 digit angka';
    }
    if (!namaTerdaftar || namaTerdaftar.trim().length < 3) {
      errs.namaTerdaftar = 'Nama wajib pajak terdaftar wajib diisi';
    }
    if (!fileUri) {
      errs.fileUri = 'Wajib mengunggah scan / foto kartu NPWP';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    updateProfile({
      npwp: {
        nomor,
        namaTerdaftar,
        fileUri,
        fileSizeFormatted: fileSizeFormatted || '380 KB',
        uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        status: 'lengkap',
        catatanRevisi: undefined,
      },
    });
  };

  const isRevisi = user.npwp.status === 'perlu_revisi';
  const isBelumLengkap = user.npwp.status === 'belum_lengkap';
  const isLengkap = user.npwp.status === 'lengkap';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Title */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.headerTitle}>Nomor Pokok Wajib Pajak (NPWP)</Text>
            {isLengkap && <Badge label="Lengkap" variant="success" />}
            {isRevisi && <Badge label="Perlu Revisi" variant="danger" />}
            {isBelumLengkap && <Badge label="Belum Lengkap" variant="warning" />}
          </View>
          <Text style={styles.headerSubtitle}>
            Legalitas perpajakan usaha/perorangan pemohon bantuan program TKML Kemnaker.
          </Text>
        </View>

        {/* Alert Revisi jika ada */}
        {isRevisi && (
          <View style={[styles.alertBox, styles.alertBoxDanger]}>
            <AlertCircle size={18} color={ColorPalette.rose[700]} />
            <View style={styles.alertTextWrap}>
              <Text style={styles.alertDangerTitle}>Catatan Perbaikan NPWP:</Text>
              <Text style={styles.alertDangerDesc}>
                {user.npwp.catatanRevisi || 'Foto kartu NPWP buram atau nomor tidak sesuai master data perpajakan.'}
              </Text>
            </View>
          </View>
        )}

        {/* Info Card DJP */}
        <View style={styles.infoBanner}>
          <ExternalLink size={16} color={ColorPalette.blue[700]} />
          <Text style={styles.infoBannerText}>
            Dapat menggunakan NPWP 15 digit format lama atau NPWP 16 digit (NIK terintegrasi DJP).
          </Text>
        </View>

        {/* Form Input NPWP */}
        <Card style={styles.cardSpacing}>
          <CardHeader>
            <View style={styles.sectionHeader}>
              <CreditCard size={20} color={ColorPalette.primary[700]} />
              <Text style={styles.sectionTitle}>Data Identitas Perpajakan</Text>
            </View>
          </CardHeader>
          <CardContent>
            <Input
              label="Nomor NPWP (15 atau 16 Digit)"
              value={nomor}
              onChangeText={(text) => {
                setNomor(text);
                if (errors.nomor) setErrors((prev) => ({ ...prev, nomor: '' }));
              }}
              placeholder="Contoh: 84.123.456.7-428.000 / 3204..."
              keyboardType="number-pad"
              error={errors.nomor}
              hint="Masukkan nomor NPWP perorangan atau badan usaha pemohon."
              required
            />

            <Input
              label="Nama Wajib Pajak Terdaftar"
              value={namaTerdaftar}
              onChangeText={(text) => {
                setNamaTerdaftar(text);
                if (errors.namaTerdaftar) setErrors((prev) => ({ ...prev, namaTerdaftar: '' }));
              }}
              placeholder="Contoh: Asep Sunandar / UD. Kopi Barokah"
              error={errors.namaTerdaftar}
              hint="Harus sama persis dengan yang tertera pada kartu NPWP fisik/elektronik."
              required
            />
          </CardContent>
        </Card>

        {/* Upload Dokumen NPWP */}
        <Card style={styles.cardSpacing}>
          <CardHeader>
            <View style={styles.sectionHeader}>
              <ImageIcon size={20} color={ColorPalette.primary[700]} />
              <Text style={styles.sectionTitle}>Unggah Scan / Foto Kartu NPWP</Text>
            </View>
          </CardHeader>
          <CardContent>
            <Text style={styles.uploadDescription}>
              Unggah foto fisik kartu NPWP atau unduhan PDF/JPG NPWP Elektronik dari DJP Online. Pastikan teks nomor dan nama terbaca jelas.
            </Text>

            {/* Preview Box jika sudah ada file */}
            {fileUri ? (
              <View style={styles.previewContainer}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setPreviewVisible(true)}
                  style={styles.imageWrapper}>
                  <Image source={{ uri: fileUri }} style={styles.previewImage} resizeMode="cover" />
                  <View style={styles.previewOverlay}>
                    <Text style={styles.previewOverlayText}>Ketuk untuk perbesar</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.fileMetaRow}>
                  <View style={styles.fileMetaLeft}>
                    <CheckCircle2 size={16} color={ColorPalette.teal[600]} />
                    <Text style={styles.fileMetaText}>
                      Dokumen terlampir {fileSizeFormatted ? `(${fileSizeFormatted})` : ''}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setFileUri('')}
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
                  <Text style={styles.uploadBoxSubtitle}>Ambil foto kartu langsung</Text>
                </TouchableOpacity>
              </View>
            )}

            {errors.fileUri ? (
              <Text style={styles.errorText}>{errors.fileUri}</Text>
            ) : null}
          </CardContent>
        </Card>

        {/* Tombol Simpan */}
        <View style={styles.buttonContainer}>
          <Button
            title="Simpan & Perbarui NPWP"
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
            <Text style={styles.modalTitle}>Foto Kartu NPWP</Text>
            <TouchableOpacity
              onPress={() => setPreviewVisible(false)}
              style={styles.closeBtn}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </SafeAreaView>
          <View style={styles.modalImageWrap}>
            {fileUri ? (
              <Image
                source={{ uri: fileUri }}
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
    backgroundColor: ColorPalette.blue[50],
    borderWidth: 1,
    borderColor: ColorPalette.blue[200],
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 16,
  },
  infoBannerText: {
    fontSize: 12,
    color: ColorPalette.blue[800],
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
