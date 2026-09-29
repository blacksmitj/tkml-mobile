import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTKMLStore } from '@/stores/tkml-store';
import { ColorPalette } from '@/constants/colors';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Save,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react-native';

export const ProfilUsahaScreen: React.FC = () => {
  const { user, updateProfile } = useTKMLStore();

  const [namaUsaha, setNamaUsaha] = useState(user.namaUsaha);
  const [kbli, setKbli] = useState(user.kbli || '');
  const [sektorUsaha, setSektorUsaha] = useState(user.sektorUsaha || '');
  const [deskripsiUsaha, setDeskripsiUsaha] = useState(
    user.deskripsiUsaha ||
      'Usaha pengolahan biji kopi sangrai specialty asal lereng Gunung Tangkuban Parahu yang memberdayakan petani dan tenaga kerja lokal.'
  );
  const [tahunMulaiUsaha, setTahunMulaiUsaha] = useState(user.tahunMulaiUsaha || '2023');

  const handleSaveProfile = () => {
    updateProfile({
      namaUsaha,
      kbli,
      sektorUsaha,
      deskripsiUsaha,
      tahunMulaiUsaha,
      statusProfilUsaha: 'lengkap',
      catatanRevisiProfil: undefined,
    });
  };

  const isRevisi = user.statusProfilUsaha === 'perlu_revisi';
  const isBelumLengkap = user.statusProfilUsaha === 'belum_lengkap';
  const isLengkap = user.statusProfilUsaha === 'lengkap';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Title */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.headerTitle}>Profil Identitas Usaha</Text>
            {isLengkap && <Badge label="Lengkap" variant="success" />}
            {isRevisi && <Badge label="Perlu Revisi" variant="danger" />}
            {isBelumLengkap && <Badge label="Belum Lengkap" variant="warning" />}
          </View>
          <Text style={styles.headerSubtitle}>
            Klasifikasi Baku Lapangan Usaha (KBLI), sektor bidang usaha, dan ringkasan profil operasional.
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
                {isRevisi ? 'Perlu Revisi Profil Usaha' : 'Profil Usaha Belum Lengkap'}
              </Text>
              <Text
                style={[
                  styles.alertDesc,
                  { color: isRevisi ? ColorPalette.rose[700] : ColorPalette.amber[800] },
                ]}>
                {user.catatanRevisiProfil ||
                  'Lengkapi data KBLI, sektor usaha, dan deskripsi kegiatan operasional usaha.'}
              </Text>
            </View>
          </View>
        )}

        {/* Profil Usaha Form Card */}
        <Card style={styles.cardSpacing}>
          <CardHeader>
            <View style={styles.sectionHeader}>
              <Building2 size={20} color={ColorPalette.primary[700]} />
              <Text style={styles.sectionTitle}>Identitas & Bidang Usaha</Text>
            </View>
          </CardHeader>
          <CardContent>
            <Input
              label="Nama Unit Usaha / Merek Dagang"
              value={namaUsaha}
              onChangeText={setNamaUsaha}
              placeholder="Contoh: UD. Kopi Barokah"
              required
            />
            <Input
              label="Klasifikasi Baku Lapangan Usaha (KBLI)"
              value={kbli}
              onChangeText={setKbli}
              placeholder="10761 - Industri Pengolahan Kopi"
              hint="Kode KBLI 5 digit sesuai yang tertera di dokumen NIB OSS."
              required
            />
            <Input
              label="Sektor Bidang Usaha"
              value={sektorUsaha}
              onChangeText={setSektorUsaha}
              placeholder="Kuliner & Pengolahan Pangan"
              required
            />
            <Input
              label="Tahun Mulai Beroperasi"
              value={tahunMulaiUsaha}
              onChangeText={setTahunMulaiUsaha}
              keyboardType="number-pad"
              placeholder="2023"
              required
            />
            <Input
              label="Deskripsi Ringkas Kegiatan Usaha"
              value={deskripsiUsaha}
              onChangeText={setDeskripsiUsaha}
              multiline
              numberOfLines={4}
              placeholder="Jelaskan profil kegiatan, keunikan produk, dan jangkauan pasar usaha Anda..."
              required
            />
          </CardContent>
        </Card>

        {/* Action Button Simpan */}
        <View style={styles.buttonContainer}>
          <Button
            title="Simpan Perubahan Profil Usaha"
            icon={<Save size={18} color="#FFFFFF" />}
            onPress={handleSaveProfile}
            variant="primary"
          />
        </View>
      </ScrollView>
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
  },
  headerSubtitle: {
    fontSize: 13,
    color: ColorPalette.slate[600],
    lineHeight: 18,
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
  alertBoxWarning: {
    backgroundColor: ColorPalette.amber[50],
    borderColor: ColorPalette.amber[200],
    borderWidth: 1,
  },
  alertTextWrap: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  alertDesc: {
    fontSize: 12,
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
  buttonContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
});
