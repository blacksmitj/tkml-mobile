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
  FileText,
  Save,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export const NibScreen: React.FC = () => {
  const { user, updateProfile } = useTKMLStore();

  const [nomor, setNomor] = useState(user.nib.nomor || '');
  const [namaTerdaftar, setNamaTerdaftar] = useState(user.nib.namaTerdaftar || user.namaUsaha);
  const [fileUri, setFileUri] = useState(user.nib.fileUri || '');
  const [fileSizeFormatted, setFileSizeFormatted] = useState(user.nib.fileSizeFormatted || '');
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
      setFileSizeFormatted('450 KB');
      setErrors((prev) => ({ ...prev, fileUri: '' }));
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!nomor || nomor.replace(/[^0-9]/g, '').length < 9) {
      errs.nomor = 'Nomor Induk Berusaha (NIB) harus 13 digit angka OSS';
    }
    if (!namaTerdaftar || namaTerdaftar.trim().length < 3) {
      errs.namaTerdaftar = 'Nama usaha terdaftar wajib diisi';
    }
    if (!fileUri) {
      errs.fileUri = 'Wajib mengunggah scan / foto dokumen NIB OSS';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      updateProfile({
        nib: {
          nomor: nomor.replace(/[^0-9]/g, ''),
          namaTerdaftar,
          fileUri,
          fileSizeFormatted,
          uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          status: 'lengkap',
          catatanRevisi: undefined,
        },
      });
    }
  };

  const isRevisi = user.nib.status === 'perlu_revisi';
  const isLengkap = user.nib.status === 'lengkap';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Nomor Induk Berusaha (NIB)</Text>
          <Text style={styles.headerSubtitle}>
            Legalitas perizinan berusaha berbasis risiko dari sistem OSS RBA Kementerian Investasi/BKPM.
          </Text>
        </View>

        {/* Alert Notification */}
        {isRevisi && (
          <View style={styles.alertBoxDanger}>
            <AlertCircle size={18} color={ColorPalette.rose[700]} />
            <View style={styles.alertTextWrap}>
              <Text style={styles.alertTitleDanger}>Perlu Revisi Dokumen NIB</Text>
              <Text style={styles.alertDescDanger}>
                {user.nib.catatanRevisi || 'Foto dokumen NIB tidak terbaca, mohon unggah ulang.'}
              </Text>
            </View>
          </View>
        )}

        {/* Form Card */}
        <Card style={styles.cardSpacing}>
          <CardHeader>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconBox, { backgroundColor: ColorPalette.primary[50] }]}>
                <FileText size={20} color={ColorPalette.primary[700]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Data Perizinan NIB OSS</Text>
                <Text style={styles.sectionSubtitle}>
                  Pastikan 13 digit NIK/NIB sesuai lembar lampiran OSS
                </Text>
              </View>
              <Badge
                label={isLengkap ? 'Terverifikasi / Lengkap' : isRevisi ? 'Revisi' : 'Belum Lengkap'}
                variant={isLengkap ? 'success' : isRevisi ? 'danger' : 'warning'}
              />
            </View>
          </CardHeader>
          <CardContent>
            {/* Input No NIB */}
            <Input
              label="Nomor Induk Berusaha (13 Digit NIB)"
              placeholder="Contoh: 1234567890123"
              keyboardType="number-pad"
              maxLength={13}
              value={nomor}
              onChangeText={setNomor}
              error={errors.nomor}
              hint="13 digit angka resmi NIB OSS RBA."
              required
            />

            {/* Nama Terdaftar */}
            <Input
              label="Nama Usaha / Pelaku Usaha di NIB"
              placeholder="Contoh: UD. KOPI MANDIRI BAROKAH"
              value={namaTerdaftar}
              onChangeText={setNamaTerdaftar}
              error={errors.namaTerdaftar}
              required
            />

            {/* Upload Scan / Foto NIB */}
            <View style={styles.uploadSection}>
              <Text style={styles.uploadLabel}>
                Unggah Foto / Scan Dokumen NIB <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <Text style={styles.uploadHint}>
                Unggah halaman pertama NIB yang menampilkan barcode dan nomor registrasi resmi.
              </Text>

              <TouchableOpacity
                style={[styles.uploadBox, fileUri ? styles.uploadBoxFilled : null]}
                activeOpacity={0.8}
                onPress={handlePickImage}>
                {fileUri ? (
                  <View style={styles.uploadedWrapper}>
                    <Image source={{ uri: fileUri }} style={styles.previewThumb} />
                    <View style={styles.uploadedInfo}>
                      <Text style={styles.uploadedTitle}>Dokumen NIB Terpilih</Text>
                      <Text style={styles.uploadedSize}>{fileSizeFormatted || 'Ukuran: ~450 KB'}</Text>
                      <TouchableOpacity
                        style={styles.viewDocBtn}
                        onPress={() => setPreviewVisible(true)}>
                        <Text style={styles.viewDocText}>Lihat Foto Penuh</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.placeholderBox}>
                    <Camera size={26} color={ColorPalette.slate[400]} />
                    <Text style={styles.uploadBoxTitle}>Pilih Foto / Scan NIB dari Galeri</Text>
                    <Text style={styles.uploadBoxSub}>Format JPG/PNG (Maks 800 KB, otomatis dikompres)</Text>
                  </View>
                )}
              </TouchableOpacity>
              {errors.fileUri && <Text style={styles.errorText}>{errors.fileUri}</Text>}
            </View>

            <Button
              title="Simpan & Perbarui Data NIB"
              variant="primary"
              size="lg"
              icon={<Save size={18} color="#FFFFFF" />}
              onPress={handleSave}
              style={{ marginTop: 12 }}
            />
          </CardContent>
        </Card>
      </ScrollView>

      {/* Fullscreen Preview Modal */}
      <Modal
        visible={previewVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewVisible(false)}>
        <View style={styles.previewBackdrop}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle}>Scan Dokumen NIB OSS</Text>
            <TouchableOpacity
              onPress={() => setPreviewVisible(false)}
              style={styles.previewCloseBtn}>
              <X size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          {fileUri && (
            <Image
              source={{ uri: fileUri }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
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
  alertBoxDanger: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    backgroundColor: ColorPalette.rose[50],
    borderColor: ColorPalette.rose[300],
  },
  alertTextWrap: {
    flex: 1,
    gap: 2,
  },
  alertTitleDanger: {
    fontSize: 13,
    fontWeight: '700',
    color: ColorPalette.rose[900],
  },
  alertDescDanger: {
    fontSize: 12,
    color: ColorPalette.rose[700],
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
    width: 38,
    height: 38,
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
  uploadSection: {
    gap: 6,
    marginTop: 6,
  },
  uploadLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: ColorPalette.slate[800],
  },
  requiredAsterisk: {
    color: ColorPalette.rose[600],
  },
  uploadHint: {
    fontSize: 12,
    color: ColorPalette.slate[500],
  },
  uploadBox: {
    height: 130,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: ColorPalette.slate[300],
    borderStyle: 'dashed',
    backgroundColor: ColorPalette.slate[50],
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  uploadBoxFilled: {
    borderStyle: 'solid',
    borderColor: ColorPalette.emerald[500],
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  placeholderBox: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
  },
  uploadBoxTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: ColorPalette.slate[700],
  },
  uploadBoxSub: {
    fontSize: 11,
    color: ColorPalette.slate[400],
    textAlign: 'center',
  },
  uploadedWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 14,
  },
  previewThumb: {
    width: 100,
    height: 90,
    borderRadius: 8,
  },
  uploadedInfo: {
    flex: 1,
    gap: 4,
  },
  uploadedTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ColorPalette.slate[900],
  },
  uploadedSize: {
    fontSize: 11,
    color: ColorPalette.slate[500],
  },
  viewDocBtn: {
    alignSelf: 'flex-start',
    backgroundColor: ColorPalette.primary[50],
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginTop: 2,
  },
  viewDocText: {
    fontSize: 11,
    fontWeight: '700',
    color: ColorPalette.primary[700],
  },
  errorText: {
    fontSize: 12,
    color: ColorPalette.rose[600],
  },
  previewBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  previewCloseBtn: {
    padding: 8,
  },
  previewImage: {
    width: width - 40,
    height: width * 1.2,
    borderRadius: 12,
    alignSelf: 'center',
  },
});
