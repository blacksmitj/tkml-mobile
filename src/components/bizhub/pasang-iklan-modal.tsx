import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { KategoriBizHub, BizHubAd } from '@/types/tkml';
import { ColorPalette } from '@/constants/colors';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Save, PlusCircle, Camera, Image as ImageIcon } from 'lucide-react-native';

interface PasangIklanModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmitAd: (ad: Omit<BizHubAd, 'id' | 'createdAt' | 'isVerifiedTKML'>) => void;
  userNamaUsaha: string;
  userNamaPemilik: string;
  userIdTKML: string;
  userSektorUsaha?: string;
  userDaerah?: string;
  userNoHp?: string;
}

const KATEGORI_OPTIONS: { label: string; value: KategoriBizHub }[] = [
  { label: 'Bahan Baku', value: 'bahan_baku' },
  { label: 'Kemasan & Packaging', value: 'kemasan' },
  { label: 'Mesin & Alat Produksi', value: 'mesin_alat' },
  { label: 'Jasa Maklon / Produksi', value: 'jasa_maklon' },
  { label: 'Produk Jadi (Retail/Grosir)', value: 'produk_jadi' },
];

export const PasangIklanModal: React.FC<PasangIklanModalProps> = ({
  visible,
  onClose,
  onSubmitAd,
  userNamaUsaha,
  userNamaPemilik,
  userIdTKML,
  userSektorUsaha = 'Kuliner & Pengolahan Pangan',
  userDaerah = 'Kab. Bandung Barat',
  userNoHp = '6281234567890',
}) => {
  const [judulProduk, setJudulProduk] = useState('');
  const [kategori, setKategori] = useState<KategoriBizHub>('bahan_baku');
  const [sektorUsaha, setSektorUsaha] = useState(userSektorUsaha);
  const [deskripsi, setDeskripsi] = useState('');
  const [harga, setHarga] = useState('');
  const [satuanHarga, setSatuanHarga] = useState('per kg');
  const [lokasiDaerah, setLokasiDaerah] = useState(userDaerah);
  const [noWhatsapp, setNoWhatsapp] = useState(userNoHp);
  const [fotoProdukUri, setFotoProdukUri] = useState('');
  const [b2bReady, setB2bReady] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.6,
    });

    if (!result.canceled && result.assets[0]) {
      setFotoProdukUri(result.assets[0].uri);
      setErrors((prev) => ({ ...prev, fotoProdukUri: '' }));
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!judulProduk || judulProduk.trim().length < 5) {
      errs.judulProduk = 'Judul produk minimal 5 karakter';
    }
    if (!deskripsi || deskripsi.trim().length < 10) {
      errs.deskripsi = 'Deskripsi iklan minimal 10 karakter';
    }
    if (!harga || parseInt(harga, 10) <= 0) {
      errs.harga = 'Harga penawaran harus lebih dari 0';
    }
    if (!fotoProdukUri) {
      errs.fotoProdukUri = 'Wajib sertakan 1 foto produk';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmitAd({
        namaUsaha: userNamaUsaha,
        namaPemilik: userNamaPemilik,
        idTKML: userIdTKML,
        judulProduk,
        kategori,
        sektorUsaha: sektorUsaha || userSektorUsaha,
        deskripsi,
        harga: parseInt(harga.replace(/[^0-9]/g, ''), 10) || 0,
        satuanHarga,
        lokasiDaerah,
        jarakKm: 0.5,
        noWhatsapp: noWhatsapp.replace(/[^0-9]/g, ''),
        fotoProdukUri,
        b2bReady,
      });
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                  <PlusCircle size={22} color={ColorPalette.primary[700]} />
                  <Text style={styles.title}>Pasang Iklan Produk di BizHub</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <X size={20} color={ColorPalette.slate[500]} />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.formContent}>
                <Input
                  label="Judul Produk / Jasa"
                  placeholder="Contoh: Green Bean Arabica Lembang Grade 1"
                  value={judulProduk}
                  onChangeText={setJudulProduk}
                  error={errors.judulProduk}
                  required
                />

                {/* Kategori Radio */}
                <View style={styles.fieldSection}>
                  <Text style={styles.fieldLabel}>
                    Kategori Usaha / Produk <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <View style={styles.optionsWrap}>
                    {KATEGORI_OPTIONS.map((opt) => (
                      <TouchableOpacity
                        key={opt.value}
                        style={[
                          styles.optionPill,
                          kategori === opt.value && styles.optionPillActive,
                        ]}
                        onPress={() => setKategori(opt.value)}>
                        <Text
                          style={[
                            styles.optionPillText,
                            kategori === opt.value && styles.optionPillTextActive,
                          ]}>
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Deskripsi */}
                <Input
                  label="Deskripsi Penawaran Produk"
                  placeholder="Jelaskan spesifikasi, keunggulan, minimal pemesanan, atau kapasitas suplai..."
                  value={deskripsi}
                  onChangeText={setDeskripsi}
                  multiline
                  numberOfLines={3}
                  error={errors.deskripsi}
                  required
                />

                {/* Harga & Satuan */}
                <View style={styles.rowTwo}>
                  <View style={{ flex: 3 }}>
                    <Input
                      label="Harga (Rp)"
                      placeholder="110000"
                      keyboardType="number-pad"
                      value={harga}
                      onChangeText={setHarga}
                      error={errors.harga}
                      required
                    />
                  </View>
                  <View style={{ flex: 2 }}>
                    <Input
                      label="Satuan"
                      placeholder="per kg / pcs"
                      value={satuanHarga}
                      onChangeText={setSatuanHarga}
                      required
                    />
                  </View>
                </View>

                {/* Nomor WhatsApp */}
                <Input
                  label="Nomor WhatsApp untuk Dihubungi"
                  placeholder="6281234567890"
                  keyboardType="phone-pad"
                  value={noWhatsapp}
                  onChangeText={setNoWhatsapp}
                  hint="Format angka tanpa tanda +, diawali 62 atau 08"
                  required
                />

                {/* Upload Foto Produk */}
                <View style={styles.fieldSection}>
                  <Text style={styles.fieldLabel}>
                    Foto Produk / Banner Iklan <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={[styles.uploadBox, fotoProdukUri ? styles.uploadBoxFilled : null]}
                    onPress={handlePickImage}>
                    {fotoProdukUri ? (
                      <Image source={{ uri: fotoProdukUri }} style={styles.previewImage} />
                    ) : (
                      <View style={styles.uploadPlaceholder}>
                        <Camera size={26} color={ColorPalette.slate[400]} />
                        <Text style={styles.uploadText}>Pilih Foto Produk dari Galeri</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  {errors.fotoProdukUri && (
                    <Text style={styles.errorText}>{errors.fotoProdukUri}</Text>
                  )}
                </View>

                <Button
                  title="Tayangkan Iklan Sekarang"
                  variant="primary"
                  size="lg"
                  icon={<Save size={18} color="#FFFFFF" />}
                  onPress={handleSubmit}
                  style={{ marginTop: 12, marginBottom: 20 }}
                />
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: ColorPalette.slate[200],
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: ColorPalette.slate[900],
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: ColorPalette.slate[100],
  },
  formContent: {
    paddingVertical: 16,
    gap: 14,
  },
  fieldSection: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: ColorPalette.slate[800],
  },
  requiredAsterisk: {
    color: ColorPalette.rose[600],
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionPill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: ColorPalette.slate[200],
    backgroundColor: ColorPalette.slate[50],
  },
  optionPillActive: {
    borderColor: ColorPalette.primary[700],
    backgroundColor: ColorPalette.primary[50],
  },
  optionPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: ColorPalette.slate[600],
  },
  optionPillTextActive: {
    color: ColorPalette.primary[800],
    fontWeight: '700',
  },
  rowTwo: {
    flexDirection: 'row',
    gap: 10,
  },
  uploadBox: {
    height: 140,
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
  },
  uploadPlaceholder: {
    alignItems: 'center',
    gap: 6,
  },
  uploadText: {
    fontSize: 12,
    fontWeight: '600',
    color: ColorPalette.slate[500],
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    fontSize: 12,
    color: ColorPalette.rose[600],
  },
});
