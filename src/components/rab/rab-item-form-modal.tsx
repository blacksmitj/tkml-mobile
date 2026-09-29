import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { ItemRAB } from '@/types/tkml';
import { ColorPalette } from '@/constants/colors';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/utils/formatters';
import { X, Save, PackagePlus, Calculator } from 'lucide-react-native';

interface RabItemFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmitItem: (data: {
    namaBarang: string;
    spesifikasi: string;
    volume: number;
    satuan: string;
    hargaSatuan: number;
  }) => void;
  initialData?: ItemRAB | null;
}

const SATUAN_OPTIONS = ['Unit', 'Pcs', 'Kg', 'Paket', 'Set', 'Meter', 'Liter', 'Roll'];

export const RabItemFormModal: React.FC<RabItemFormModalProps> = ({
  visible,
  onClose,
  onSubmitItem,
  initialData,
}) => {
  const [namaBarang, setNamaBarang] = useState('');
  const [spesifikasi, setSpesifikasi] = useState('');
  const [volume, setVolume] = useState('1');
  const [satuan, setSatuan] = useState('Unit');
  const [hargaSatuan, setHargaSatuan] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setNamaBarang(initialData.namaBarang);
      setSpesifikasi(initialData.spesifikasi);
      setVolume(String(initialData.volume));
      setSatuan(initialData.satuan);
      setHargaSatuan(String(initialData.hargaSatuan));
    } else {
      setNamaBarang('');
      setSpesifikasi('');
      setVolume('1');
      setSatuan('Unit');
      setHargaSatuan('');
    }
    setErrors({});
  }, [initialData, visible]);

  const numVolume = parseFloat(volume) || 0;
  const numHargaSatuan = parseInt(hargaSatuan.replace(/[^0-9]/g, ''), 10) || 0;
  const subtotal = numVolume * numHargaSatuan;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!namaBarang || namaBarang.trim().length < 3) {
      errs.namaBarang = 'Nama barang minimal 3 karakter';
    }
    if (!spesifikasi || spesifikasi.trim().length < 5) {
      errs.spesifikasi = 'Spesifikasi teknis minimal 5 karakter';
    }
    if (!numVolume || numVolume <= 0) {
      errs.volume = 'Volume harus lebih dari 0';
    }
    if (!numHargaSatuan || numHargaSatuan <= 0) {
      errs.hargaSatuan = 'Harga satuan harus lebih dari Rp 0';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSubmitItem({
        namaBarang,
        spesifikasi,
        volume: numVolume,
        satuan,
        hargaSatuan: numHargaSatuan,
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
                  <PackagePlus size={22} color={ColorPalette.primary[700]} />
                  <Text style={styles.title}>
                    {initialData ? 'Edit Item Usulan RAB' : 'Tambah Usulan Anggaran RAB'}
                  </Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <X size={20} color={ColorPalette.slate[500]} />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.formContent}>
                {/* Nama Barang */}
                <Input
                  label="Nama Barang / Peralatan / Bahan"
                  placeholder="Contoh: Mesin Grinder Kopi / Biji Kopi Arabica"
                  value={namaBarang}
                  onChangeText={setNamaBarang}
                  error={errors.namaBarang}
                  required
                />

                {/* Spesifikasi Teknis */}
                <Input
                  label="Spesifikasi & Kebutuhan Teknis"
                  placeholder="Contoh: Motor 350W, flat burr 64mm, kapasitas giling 5kg/jam..."
                  value={spesifikasi}
                  onChangeText={setSpesifikasi}
                  multiline
                  numberOfLines={3}
                  error={errors.spesifikasi}
                  hint="Jelaskan merek, kapasitas, tipe material, atau ukuran barang."
                  required
                />

                {/* Volume & Satuan */}
                <View style={styles.rowTwo}>
                  <View style={{ flex: 2 }}>
                    <Input
                      label="Volume / Jumlah"
                      placeholder="1"
                      keyboardType="numeric"
                      value={volume}
                      onChangeText={setVolume}
                      error={errors.volume}
                      required
                    />
                  </View>
                  <View style={{ flex: 3 }}>
                    <Input
                      label="Satuan Unit"
                      placeholder="Unit"
                      value={satuan}
                      onChangeText={setSatuan}
                      required
                    />
                  </View>
                </View>

                {/* Satuan Quick Selection Pills */}
                <View style={styles.satuanPillsRow}>
                  {SATUAN_OPTIONS.map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={[styles.satuanPill, satuan === s && styles.satuanPillActive]}
                      onPress={() => setSatuan(s)}>
                      <Text
                        style={[
                          styles.satuanPillText,
                          satuan === s && styles.satuanPillTextActive,
                        ]}>
                        {s}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Harga Satuan */}
                <Input
                  label="Estimasi Harga Satuan (Rp)"
                  placeholder="4200000"
                  keyboardType="number-pad"
                  value={hargaSatuan}
                  onChangeText={(val) => setHargaSatuan(val.replace(/[^0-9]/g, ''))}
                  error={errors.hargaSatuan}
                  hint={
                    numHargaSatuan > 0
                      ? `Terbaca: ${formatRupiah(numHargaSatuan)} per ${satuan}`
                      : undefined
                  }
                  required
                />

                {/* Subtotal Calculation Box */}
                <View style={styles.subtotalCalcBox}>
                  <View style={styles.calcHeaderRow}>
                    <Calculator size={16} color={ColorPalette.primary[700]} />
                    <Text style={styles.calcTitle}>Kalkulasi Subtotal Otomatis</Text>
                  </View>
                  <View style={styles.calcBodyRow}>
                    <Text style={styles.calcFormula}>
                      {numVolume} {satuan} × {formatRupiah(numHargaSatuan)}
                    </Text>
                    <Text style={styles.calcSubtotal}>{formatRupiah(subtotal)}</Text>
                  </View>
                </View>

                {/* Submit Action */}
                <Button
                  title={initialData ? 'Perbarui Usulan RAB' : 'Ajukan Item ke Usulan RAB'}
                  variant="primary"
                  size="lg"
                  icon={<Save size={18} color="#FFFFFF" />}
                  onPress={handleSave}
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
  rowTwo: {
    flexDirection: 'row',
    gap: 10,
  },
  satuanPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: -4,
  },
  satuanPill: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: ColorPalette.slate[100],
    borderWidth: 1,
    borderColor: ColorPalette.slate[200],
  },
  satuanPillActive: {
    backgroundColor: ColorPalette.primary[50],
    borderColor: ColorPalette.primary[700],
  },
  satuanPillText: {
    fontSize: 11,
    color: ColorPalette.slate[600],
    fontWeight: '600',
  },
  satuanPillTextActive: {
    color: ColorPalette.primary[800],
    fontWeight: '700',
  },
  subtotalCalcBox: {
    backgroundColor: ColorPalette.primary[50],
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: ColorPalette.primary[200],
    gap: 6,
  },
  calcHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  calcTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorPalette.primary[800],
  },
  calcBodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  calcFormula: {
    fontSize: 12,
    color: ColorPalette.slate[600],
  },
  calcSubtotal: {
    fontSize: 16,
    fontWeight: '800',
    color: ColorPalette.primary[900],
  },
});
