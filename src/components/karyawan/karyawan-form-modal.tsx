import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Karyawan, JenisDisabilitas, JenisKelamin, StatusHubunganKerja } from '@/types/tkml';
import { ColorPalette } from '@/constants/colors';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Save, UserCheck } from 'lucide-react-native';

interface KaryawanFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmitData: (data: {
    nik: string;
    namaLengkap: string;
    jenisKelamin: JenisKelamin;
    tanggalLahir: string;
    noHp: string;
    disabilitas: JenisDisabilitas;
    posisi: string;
    statusKerja: StatusHubunganKerja;
  }) => void;
  initialData?: Karyawan | null;
}

const DISABILITAS_OPTIONS: { label: string; value: JenisDisabilitas }[] = [
  { label: 'Tidak Ada (Reguler)', value: 'tidak_ada' },
  { label: 'Disabilitas Fisik', value: 'fisik' },
  { label: 'Sensorik Netra', value: 'sensorik_netra' },
  { label: 'Sensorik Rungu/Wicara', value: 'sensorik_rungu_wicara' },
  { label: 'Disabilitas Intelektual', value: 'intelektual' },
  { label: 'Disabilitas Mental', value: 'mental' },
];

const STATUS_KERJA_OPTIONS: { label: string; value: StatusHubunganKerja }[] = [
  { label: 'Penuh Waktu (Full Time)', value: 'penuh_waktu' },
  { label: 'Paruh Waktu (Part Time)', value: 'paruh_waktu' },
  { label: 'Borongan', value: 'borongan' },
  { label: 'Musiman', value: 'musiman' },
];

export const KaryawanFormModal: React.FC<KaryawanFormModalProps> = ({
  visible,
  onClose,
  onSubmitData,
  initialData,
}) => {
  const [nik, setNik] = useState('');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState<JenisKelamin>('L');
  const [tanggalLahir, setTanggalLahir] = useState('1998-01-01');
  const [noHp, setNoHp] = useState('');
  const [disabilitas, setDisabilitas] = useState<JenisDisabilitas>('tidak_ada');
  const [posisi, setPosisi] = useState('');
  const [statusKerja, setStatusKerja] = useState<StatusHubunganKerja>('penuh_waktu');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setNik(initialData.nik);
      setNamaLengkap(initialData.namaLengkap);
      setJenisKelamin(initialData.jenisKelamin);
      setTanggalLahir(initialData.tanggalLahir);
      setNoHp(initialData.noHp);
      setDisabilitas(initialData.disabilitas);
      setPosisi(initialData.posisi);
      setStatusKerja(initialData.statusKerja);
    } else {
      setNik('');
      setNamaLengkap('');
      setJenisKelamin('L');
      setTanggalLahir('1998-01-01');
      setNoHp('');
      setDisabilitas('tidak_ada');
      setPosisi('');
      setStatusKerja('penuh_waktu');
    }
    setErrors({});
  }, [initialData, visible]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!nik || nik.length !== 16 || !/^\d+$/.test(nik)) {
      errs.nik = 'NIK harus tepat 16 digit angka';
    }
    if (!namaLengkap || namaLengkap.trim().length < 3) {
      errs.namaLengkap = 'Nama lengkap minimal 3 karakter';
    }
    if (!noHp || noHp.length < 10) {
      errs.noHp = 'Nomor HP minimal 10 digit angka';
    }
    if (!posisi || posisi.trim().length === 0) {
      errs.posisi = 'Posisi kerja wajib diisi';
    }
    if (!tanggalLahir) {
      errs.tanggalLahir = 'Tanggal lahir wajib diisi';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSubmitData({
        nik,
        namaLengkap,
        jenisKelamin,
        tanggalLahir,
        noHp,
        disabilitas,
        posisi,
        statusKerja,
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
                  <UserCheck size={22} color={ColorPalette.primary[700]} />
                  <Text style={styles.title}>
                    {initialData ? 'Edit Data Tenaga Kerja' : 'Tambah Tenaga Kerja Baru'}
                  </Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <X size={20} color={ColorPalette.slate[500]} />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.formContent}>
                {/* NIK Field */}
                <Input
                  label="Nomor Induk Kependudukan (NIK)"
                  placeholder="16 digit NIK KTP"
                  keyboardType="number-pad"
                  maxLength={16}
                  value={nik}
                  onChangeText={(val) => {
                    setNik(val);
                    if (val.length === 16) {
                      setErrors((prev) => ({ ...prev, nik: '' }));
                    }
                  }}
                  error={errors.nik}
                  hint="Pastikan NIK tepat 16 digit sesuai e-KTP."
                  required
                />

                {/* Nama Lengkap */}
                <Input
                  label="Nama Lengkap Tenaga Kerja"
                  placeholder="Nama lengkap sesuai KTP"
                  value={namaLengkap}
                  onChangeText={(val) => {
                    setNamaLengkap(val);
                    if (val.length >= 3) {
                      setErrors((prev) => ({ ...prev, namaLengkap: '' }));
                    }
                  }}
                  error={errors.namaLengkap}
                  required
                />

                {/* Jenis Kelamin Radio */}
                <View style={styles.fieldSection}>
                  <Text style={styles.fieldLabel}>
                    Jenis Kelamin <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <View style={styles.radioRow}>
                    <TouchableOpacity
                      style={[
                        styles.radioPill,
                        jenisKelamin === 'L' && styles.radioPillActive,
                      ]}
                      onPress={() => setJenisKelamin('L')}>
                      <Text
                        style={[
                          styles.radioPillText,
                          jenisKelamin === 'L' && styles.radioPillTextActive,
                        ]}>
                        Laki-laki
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.radioPill,
                        jenisKelamin === 'P' && styles.radioPillActive,
                      ]}
                      onPress={() => setJenisKelamin('P')}>
                      <Text
                        style={[
                          styles.radioPillText,
                          jenisKelamin === 'P' && styles.radioPillTextActive,
                        ]}>
                        Perempuan
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Tanggal Lahir */}
                <Input
                  label="Tanggal Lahir (YYYY-MM-DD)"
                  placeholder="1995-04-12"
                  value={tanggalLahir}
                  onChangeText={setTanggalLahir}
                  error={errors.tanggalLahir}
                  required
                />

                {/* No WhatsApp / HP */}
                <Input
                  label="Nomor HP / WhatsApp"
                  placeholder="081234567890"
                  keyboardType="phone-pad"
                  value={noHp}
                  onChangeText={setNoHp}
                  error={errors.noHp}
                  required
                />

                {/* Dropdown / Opsi Disabilitas */}
                <View style={styles.fieldSection}>
                  <Text style={styles.fieldLabel}>
                    Status & Ragam Disabilitas <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <View style={styles.optionsWrap}>
                    {DISABILITAS_OPTIONS.map((opt) => (
                      <TouchableOpacity
                        key={opt.value}
                        style={[
                          styles.optionPill,
                          disabilitas === opt.value && styles.optionPillActive,
                        ]}
                        onPress={() => setDisabilitas(opt.value)}>
                        <Text
                          style={[
                            styles.optionPillText,
                            disabilitas === opt.value && styles.optionPillTextActive,
                          ]}>
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Posisi Kerja */}
                <Input
                  label="Posisi / Bagian Pekerjaan"
                  placeholder="Contoh: Barista, Roaster, Staff Kemasan"
                  value={posisi}
                  onChangeText={setPosisi}
                  error={errors.posisi}
                  required
                />

                {/* Status Hubungan Kerja */}
                <View style={styles.fieldSection}>
                  <Text style={styles.fieldLabel}>
                    Status Hubungan Kerja <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <View style={styles.optionsWrap}>
                    {STATUS_KERJA_OPTIONS.map((opt) => (
                      <TouchableOpacity
                        key={opt.value}
                        style={[
                          styles.optionPill,
                          statusKerja === opt.value && styles.optionPillActive,
                        ]}
                        onPress={() => setStatusKerja(opt.value)}>
                        <Text
                          style={[
                            styles.optionPillText,
                            statusKerja === opt.value && styles.optionPillTextActive,
                          ]}>
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Action Submit */}
                <Button
                  title={initialData ? 'Perbarui Data Karyawan' : 'Simpan Data Karyawan'}
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
  radioRow: {
    flexDirection: 'row',
    gap: 10,
  },
  radioPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: ColorPalette.slate[200],
    backgroundColor: ColorPalette.slate[50],
    alignItems: 'center',
  },
  radioPillActive: {
    borderColor: ColorPalette.primary[700],
    backgroundColor: ColorPalette.primary[50],
  },
  radioPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: ColorPalette.slate[600],
  },
  radioPillTextActive: {
    color: ColorPalette.primary[800],
    fontWeight: '700',
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
});
