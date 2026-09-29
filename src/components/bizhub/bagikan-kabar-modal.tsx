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
import { TipeMilestoneBizHub, BizHubMilestone } from '@/types/tkml';
import { ColorPalette } from '@/constants/colors';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  X,
  TrendingUp,
  Users,
  Award,
  Rocket,
  Camera,
  Share2,
} from 'lucide-react-native';

interface BagikanKabarModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmitMilestone: (
    milestone: Omit<BizHubMilestone, 'id' | 'createdAt' | 'likesCount' | 'isVerifiedTKML'>
  ) => void;
  userNamaUsaha: string;
  userNamaPemilik: string;
  userIdTKML: string;
  userSektorUsaha?: string;
  userDaerah?: string;
  userNoHp?: string;
}

const TIPE_OPTIONS: {
  label: string;
  value: TipeMilestoneBizHub;
  icon: any;
  desc: string;
}[] = [
  {
    label: 'Omzet & Karyawan',
    value: 'omzet_dan_karyawan',
    icon: Award,
    desc: 'Update gabungan capaian penjualan & penyerapan kerja',
  },
  {
    label: 'Capaian Omzet',
    value: 'omzet',
    icon: TrendingUp,
    desc: 'Peningkatan omzet/penjualan bulan ini',
  },
  {
    label: 'Rekrut Karyawan',
    value: 'karyawan',
    icon: Users,
    desc: 'Penambahan tenaga kerja baru dari warga sekitar',
  },
  {
    label: 'Ekspansi Usaha',
    value: 'ekspansi',
    icon: Rocket,
    desc: 'Buka cabang baru / mesin produksi baru',
  },
];

export const BagikanKabarModal: React.FC<BagikanKabarModalProps> = ({
  visible,
  onClose,
  onSubmitMilestone,
  userNamaUsaha,
  userNamaPemilik,
  userIdTKML,
  userSektorUsaha = 'Kuliner & Pengolahan Pangan',
  userDaerah = 'Kab. Bandung Barat',
  userNoHp = '6281234567890',
}) => {
  const [tipeUpdate, setTipeUpdate] = useState<TipeMilestoneBizHub>('omzet_dan_karyawan');
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [omzetBulanIni, setOmzetBulanIni] = useState('');
  const [kenaikanOmzetPersen, setKenaikanOmzetPersen] = useState('');
  const [penambahanKaryawan, setPenambahanKaryawan] = useState('');
  const [totalKaryawanSekarang, setTotalKaryawanSekarang] = useState('');
  const [fotoUri, setFotoUri] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.6,
    });

    if (!result.canceled && result.assets[0]) {
      setFotoUri(result.assets[0].uri);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!judul || judul.trim().length < 6) {
      errs.judul = 'Judul kabar usaha minimal 6 karakter';
    }
    if (!deskripsi || deskripsi.trim().length < 10) {
      errs.deskripsi = 'Deskripsi cerita/kabar minimal 10 karakter';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const cleanOmzet = omzetBulanIni.replace(/[^0-9]/g, '');
      const cleanKenaikan = kenaikanOmzetPersen.replace(/[^0-9]/g, '');
      const cleanNaker = penambahanKaryawan.replace(/[^0-9]/g, '');
      const cleanTotal = totalKaryawanSekarang.replace(/[^0-9]/g, '');

      onSubmitMilestone({
        idTKML: userIdTKML,
        namaUsaha: userNamaUsaha,
        namaPemilik: userNamaPemilik,
        sektorUsaha: userSektorUsaha,
        lokasiDaerah: userDaerah,
        jarakKm: 0.5,
        tipeUpdate,
        judul,
        deskripsi,
        omzetBulanIni: cleanOmzet ? parseInt(cleanOmzet, 10) : undefined,
        kenaikanOmzetPersen: cleanKenaikan ? parseInt(cleanKenaikan, 10) : undefined,
        penambahanKaryawan: cleanNaker ? parseInt(cleanNaker, 10) : undefined,
        totalKaryawanSekarang: cleanTotal ? parseInt(cleanTotal, 10) : undefined,
        fotoUri: fotoUri || undefined,
        noWhatsapp: userNoHp.replace(/[^0-9]/g, ''),
      });

      // Reset form
      setJudul('');
      setDeskripsi('');
      setOmzetBulanIni('');
      setKenaikanOmzetPersen('');
      setPenambahanKaryawan('');
      setTotalKaryawanSekarang('');
      setFotoUri('');
      setErrors({});
      onClose();
    }
  };

  const showOmzetFields =
    tipeUpdate === 'omzet' ||
    tipeUpdate === 'omzet_dan_karyawan' ||
    tipeUpdate === 'ekspansi';

  const showKaryawanFields =
    tipeUpdate === 'karyawan' ||
    tipeUpdate === 'omzet_dan_karyawan' ||
    tipeUpdate === 'ekspansi';

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
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                  <Award size={22} color={ColorPalette.primary[700]} />
                  <Text style={styles.title}>Bagikan Kabar Capaian Usaha</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <X size={20} color={ColorPalette.slate[500]} />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.formContent}>
                {/* Tipe Update Selector */}
                <View style={styles.fieldSection}>
                  <Text style={styles.fieldLabel}>Pilih Jenis Kabar Capaian</Text>
                  <View style={styles.typeGrid}>
                    {TIPE_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = tipeUpdate === opt.value;
                      return (
                        <TouchableOpacity
                          key={opt.value}
                          style={[styles.typeBox, isSelected && styles.typeBoxActive]}
                          onPress={() => setTipeUpdate(opt.value)}>
                          <Icon
                            size={18}
                            color={
                              isSelected ? ColorPalette.primary[700] : ColorPalette.slate[500]
                            }
                          />
                          <Text
                            style={[
                              styles.typeBoxTitle,
                              isSelected && styles.typeBoxTitleActive,
                            ]}>
                            {opt.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Judul */}
                <Input
                  label="Judul Kabar Capaian"
                  placeholder="Contoh: Omzet Bulan Ini Tembus 35 Juta & Tambah 2 Karyawan"
                  value={judul}
                  onChangeText={setJudul}
                  error={errors.judul}
                  required
                />

                {/* Optional Omzet Fields */}
                {showOmzetFields && (
                  <View style={styles.rowTwo}>
                    <View style={{ flex: 3 }}>
                      <Input
                        label="Omzet Bulan Ini (Rp)"
                        placeholder="Contoh: 35000000"
                        keyboardType="number-pad"
                        value={omzetBulanIni}
                        onChangeText={setOmzetBulanIni}
                      />
                    </View>
                    <View style={{ flex: 2 }}>
                      <Input
                        label="Kenaikan (%)"
                        placeholder="Contoh: 25"
                        keyboardType="number-pad"
                        value={kenaikanOmzetPersen}
                        onChangeText={setKenaikanOmzetPersen}
                      />
                    </View>
                  </View>
                )}

                {/* Optional Karyawan Fields */}
                {showKaryawanFields && (
                  <View style={styles.rowTwo}>
                    <View style={{ flex: 1 }}>
                      <Input
                        label="Rekrut Naker Baru (Org)"
                        placeholder="Contoh: 2"
                        keyboardType="number-pad"
                        value={penambahanKaryawan}
                        onChangeText={setPenambahanKaryawan}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Input
                        label="Total Karyawan Skrg"
                        placeholder="Contoh: 6"
                        keyboardType="number-pad"
                        value={totalKaryawanSekarang}
                        onChangeText={setTotalKaryawanSekarang}
                      />
                    </View>
                  </View>
                )}

                {/* Deskripsi */}
                <Input
                  label="Cerita Capaian & Perkembangan"
                  placeholder="Ceritakan bagaimana bantuan TKML, bimtek, atau sinergi rantai pasok membantu capaian usaha Anda..."
                  value={deskripsi}
                  onChangeText={setDeskripsi}
                  multiline
                  numberOfLines={3}
                  error={errors.deskripsi}
                  required
                />

                {/* Upload Foto Dokumentasi (Opsional) */}
                <View style={styles.fieldSection}>
                  <Text style={styles.fieldLabel}>Foto Dokumentasi (Opsional)</Text>
                  <TouchableOpacity
                    style={[styles.uploadBox, fotoUri ? styles.uploadBoxFilled : null]}
                    onPress={handlePickImage}>
                    {fotoUri ? (
                      <Image source={{ uri: fotoUri }} style={styles.previewImage} />
                    ) : (
                      <View style={styles.uploadPlaceholder}>
                        <Camera size={24} color={ColorPalette.slate[400]} />
                        <Text style={styles.uploadText}>Unggah Foto Tempat/Aktivitas Usaha</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                <Button
                  title="Bagikan ke BizHub Sekarang"
                  variant="primary"
                  size="lg"
                  icon={<Share2 size={18} color="#FFFFFF" />}
                  onPress={handleSubmit}
                  style={{ marginTop: 10, marginBottom: 20 }}
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
    paddingVertical: 14,
    gap: 12,
  },
  fieldSection: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: ColorPalette.slate[800],
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeBox: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: ColorPalette.slate[200],
    backgroundColor: ColorPalette.slate[50],
  },
  typeBoxActive: {
    borderColor: ColorPalette.primary[700],
    backgroundColor: ColorPalette.primary[50],
  },
  typeBoxTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: ColorPalette.slate[700],
    flex: 1,
  },
  typeBoxTitleActive: {
    color: ColorPalette.primary[800],
  },
  rowTwo: {
    flexDirection: 'row',
    gap: 10,
  },
  uploadBox: {
    height: 120,
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
});
