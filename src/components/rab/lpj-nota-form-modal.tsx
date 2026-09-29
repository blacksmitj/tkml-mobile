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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { LpjNotaSchema, LpjNotaFormData } from '@/utils/validators';
import { ItemRAB } from '@/types/tkml';
import { ColorPalette } from '@/constants/colors';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/utils/formatters';
import {
  X,
  Save,
  Receipt,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react-native';

interface LpjNotaFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmitData: (data: LpjNotaFormData) => void;
  rabItems: ItemRAB[];
}

export const LpjNotaFormModal: React.FC<LpjNotaFormModalProps> = ({
  visible,
  onClose,
  onSubmitData,
  rabItems,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<LpjNotaFormData>({
    resolver: zodResolver(LpjNotaSchema),
    defaultValues: {
      rabItemId: rabItems[0]?.id || '',
      namaToko: '',
      nominalRiil: 0,
      tanggalTransaksi: new Date().toISOString().slice(0, 10),
      fotoNotaUri: '',
      fotoBarangUri: '',
      catatan: '',
    },
    mode: 'onChange',
  });

  const fotoNota = watch('fotoNotaUri');
  const fotoBarang = watch('fotoBarangUri');

  const handlePickImage = async (field: 'fotoNotaUri' | 'fotoBarangUri') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.6,
    });

    if (!result.canceled && result.assets[0]) {
      setValue(field, result.assets[0].uri, { shouldValidate: true });
    }
  };

  const onValidSubmit = (data: LpjNotaFormData) => {
    onSubmitData(data);
    reset();
    onClose();
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
                  <Receipt size={22} color={ColorPalette.amber[600]} />
                  <Text style={styles.title}>Input Realisasi Nota Belanja</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <X size={20} color={ColorPalette.slate[500]} />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.formContent}>
                {/* Link ke RAB item */}
                <View style={styles.fieldSection}>
                  <Text style={styles.fieldLabel}>
                    Pilih Item Anggaran RAB Terkait <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <Controller
                    control={control}
                    name="rabItemId"
                    render={({ field: { onChange, value } }) => (
                      <View style={styles.rabItemsList}>
                        {rabItems.map((item) => (
                          <TouchableOpacity
                            key={item.id}
                            style={[
                              styles.rabPill,
                              value === item.id && styles.rabPillActive,
                            ]}
                            onPress={() => onChange(item.id)}>
                            <View style={styles.rabPillRow}>
                              <Text
                                style={[
                                  styles.rabPillTitle,
                                  value === item.id && styles.rabPillTitleActive,
                                ]}>
                                {item.namaBarang}
                              </Text>
                              <Text style={styles.rabPillSubtotal}>
                                {formatRupiah(item.subtotal)}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  />
                  {errors.rabItemId?.message && (
                    <Text style={styles.errorText}>{errors.rabItemId.message}</Text>
                  )}
                </View>

                {/* Nama Toko */}
                <Controller
                  control={control}
                  name="namaToko"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="Nama Toko / Tempat Belanja"
                      placeholder="Contoh: PT Kopi Mesin Jaya / Toko Kemasan"
                      value={value}
                      onChangeText={onChange}
                      error={errors.namaToko?.message}
                      required
                    />
                  )}
                />

                {/* Nominal Riil */}
                <Controller
                  control={control}
                  name="nominalRiil"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="Nominal Riil Tercatat di Kuitansi (Rp)"
                      placeholder="14500000"
                      keyboardType="number-pad"
                      value={value ? String(value) : ''}
                      onChangeText={(text) => {
                        const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
                        onChange(isNaN(num) ? 0 : num);
                      }}
                      error={errors.nominalRiil?.message}
                      hint="Masukkan nominal bersih yang dibayarkan ke penyedia."
                      required
                    />
                  )}
                />

                {/* Tanggal Transaksi */}
                <Controller
                  control={control}
                  name="tanggalTransaksi"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="Tanggal Transaksi (YYYY-MM-DD)"
                      placeholder="2026-09-25"
                      value={value}
                      onChangeText={onChange}
                      error={errors.tanggalTransaksi?.message}
                      required
                    />
                  )}
                />

                {/* Section 2 Upload Foto Wajib */}
                <View style={styles.uploadSection}>
                  <Text style={styles.fieldLabel}>
                    Dokumentasi 2 Foto Wajib <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <Text style={styles.uploadHint}>
                    Wajib lampirkan foto kuitansi/nota sah & foto fisik barang yang dibeli.
                  </Text>

                  <View style={styles.photosRow}>
                    {/* Foto 1: Nota */}
                    <View style={styles.photoColumn}>
                      <TouchableOpacity
                        style={[styles.uploadBox, fotoNota ? styles.uploadBoxFilled : null]}
                        onPress={() => handlePickImage('fotoNotaUri')}>
                        {fotoNota ? (
                          <Image source={{ uri: fotoNota }} style={styles.previewThumb} />
                        ) : (
                          <View style={styles.placeholderBox}>
                            <Camera size={24} color={ColorPalette.slate[400]} />
                            <Text style={styles.uploadBoxLabel}>1. Foto Nota</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                      {errors.fotoNotaUri?.message && (
                        <Text style={styles.errorText}>Wajib diisi</Text>
                      )}
                    </View>

                    {/* Foto 2: Fisik Barang */}
                    <View style={styles.photoColumn}>
                      <TouchableOpacity
                        style={[styles.uploadBox, fotoBarang ? styles.uploadBoxFilled : null]}
                        onPress={() => handlePickImage('fotoBarangUri')}>
                        {fotoBarang ? (
                          <Image source={{ uri: fotoBarang }} style={styles.previewThumb} />
                        ) : (
                          <View style={styles.placeholderBox}>
                            <ImageIcon size={24} color={ColorPalette.slate[400]} />
                            <Text style={styles.uploadBoxLabel}>2. Fisik Barang</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                      {errors.fotoBarangUri?.message && (
                        <Text style={styles.errorText}>Wajib diisi</Text>
                      )}
                    </View>
                  </View>
                </View>

                {/* Catatan / Keterangan */}
                <Controller
                  control={control}
                  name="catatan"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="Catatan Tambahan (Opsional)"
                      placeholder="Kondisi barang, potongan diskon harga, dsb."
                      value={value}
                      onChangeText={onChange}
                      multiline
                      numberOfLines={2}
                    />
                  )}
                />

                <Button
                  title="Simpan Nota Realisasi LPJ"
                  variant="primary"
                  size="lg"
                  icon={<Save size={18} color="#FFFFFF" />}
                  onPress={handleSubmit(onValidSubmit)}
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
  rabItemsList: {
    gap: 6,
  },
  rabPill: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: ColorPalette.slate[200],
    backgroundColor: ColorPalette.slate[50],
  },
  rabPillActive: {
    borderColor: ColorPalette.primary[700],
    backgroundColor: ColorPalette.primary[50],
  },
  rabPillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rabPillTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: ColorPalette.slate[700],
    flex: 1,
    marginRight: 8,
  },
  rabPillTitleActive: {
    color: ColorPalette.primary[800],
    fontWeight: '700',
  },
  rabPillSubtotal: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorPalette.primary[700],
  },
  uploadSection: {
    gap: 6,
  },
  uploadHint: {
    fontSize: 12,
    color: ColorPalette.slate[500],
  },
  photosRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  photoColumn: {
    flex: 1,
  },
  uploadBox: {
    height: 110,
    borderRadius: 12,
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
  placeholderBox: {
    alignItems: 'center',
    gap: 6,
  },
  uploadBoxLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: ColorPalette.slate[600],
  },
  previewThumb: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    fontSize: 12,
    color: ColorPalette.rose[600],
  },
});
