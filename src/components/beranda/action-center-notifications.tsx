import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ColorPalette } from '@/constants/colors';
import {
  AlertCircle,
  ChevronRight,
  FolderArchive,
  Building2,
  MapPin,
  FileText,
  CreditCard,
  Landmark,
} from 'lucide-react-native';

interface ActionCenterNotificationsProps {
  berkasRevisiCount: number;
  isProfilIncomplete: boolean;
  isAlamatIncomplete: boolean;
  isNibIncomplete: boolean;
  isNpwpIncomplete: boolean;
  isRekeningIncomplete: boolean;
  catatanRevisiBerkas: string[];
  catatanRevisiProfil?: string;
  catatanRevisiAlamat?: string;
  catatanRevisiNib?: string;
  catatanRevisiNpwp?: string;
  catatanRevisiRekening?: string;
  onOpenBerkas: () => void;
  onOpenProfilUsaha: () => void;
  onOpenAlamat: () => void;
  onOpenNib: () => void;
  onOpenNpwp: () => void;
  onOpenRekening: () => void;
}

export const ActionCenterNotifications: React.FC<ActionCenterNotificationsProps> = ({
  berkasRevisiCount,
  isProfilIncomplete,
  isAlamatIncomplete,
  isNibIncomplete,
  isNpwpIncomplete,
  isRekeningIncomplete,
  catatanRevisiBerkas,
  catatanRevisiProfil,
  catatanRevisiAlamat,
  catatanRevisiNib,
  catatanRevisiNpwp,
  catatanRevisiRekening,
  onOpenBerkas,
  onOpenProfilUsaha,
  onOpenAlamat,
  onOpenNib,
  onOpenNpwp,
  onOpenRekening,
}) => {
  const totalIssues =
    (berkasRevisiCount > 0 ? 1 : 0) +
    (isNibIncomplete ? 1 : 0) +
    (isNpwpIncomplete ? 1 : 0) +
    (isRekeningIncomplete ? 1 : 0) +
    (isProfilIncomplete ? 1 : 0) +
    (isAlamatIncomplete ? 1 : 0);

  if (totalIssues === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <AlertCircle size={18} color={ColorPalette.rose[600]} />
        <Text style={styles.sectionTitle}>
          Pemberitahuan Perlu Tindakan ({totalIssues})
        </Text>
      </View>

      <View style={styles.cardsList}>
        {/* Notifikasi NIB */}
        {isNibIncomplete && (
          <TouchableOpacity
            style={[styles.itemCard, styles.itemCardWarning]}
            activeOpacity={0.8}
            onPress={onOpenNib}>
            <View style={[styles.iconBox, { backgroundColor: ColorPalette.primary[100] }]}>
              <FileText size={18} color={ColorPalette.primary[700]} />
            </View>
            <View style={styles.itemTextWrap}>
              <Text style={[styles.itemTitle, { color: ColorPalette.primary[900] }]}>
                Lengkapi Nomor Induk Berusaha (NIB OSS)
              </Text>
              <Text style={styles.itemSubtitle} numberOfLines={2}>
                {catatanRevisiNib ||
                  'Nomor NIB 13 digit dan scan dokumen NIB belum diunggah.'}
              </Text>
            </View>
            <ChevronRight size={16} color={ColorPalette.primary[700]} />
          </TouchableOpacity>
        )}

        {/* Notifikasi NPWP */}
        {isNpwpIncomplete && (
          <TouchableOpacity
            style={[styles.itemCard, styles.itemCardWarning]}
            activeOpacity={0.8}
            onPress={onOpenNpwp}>
            <View style={[styles.iconBox, { backgroundColor: ColorPalette.blue[100] }]}>
              <CreditCard size={18} color={ColorPalette.blue[700]} />
            </View>
            <View style={styles.itemTextWrap}>
              <Text style={[styles.itemTitle, { color: ColorPalette.blue[900] }]}>
                Lengkapi NPWP Usaha / Pemilik
              </Text>
              <Text style={styles.itemSubtitle} numberOfLines={2}>
                {catatanRevisiNpwp ||
                  'Nomor NPWP dan foto kartu NPWP belum diunggah.'}
              </Text>
            </View>
            <ChevronRight size={16} color={ColorPalette.blue[700]} />
          </TouchableOpacity>
        )}

        {/* Notifikasi Rekening */}
        {isRekeningIncomplete && (
          <TouchableOpacity
            style={[styles.itemCard, styles.itemCardWarning]}
            activeOpacity={0.8}
            onPress={onOpenRekening}>
            <View style={[styles.iconBox, { backgroundColor: ColorPalette.teal[100] }]}>
              <Landmark size={18} color={ColorPalette.teal[700]} />
            </View>
            <View style={styles.itemTextWrap}>
              <Text style={[styles.itemTitle, { color: ColorPalette.teal[900] }]}>
                Lengkapi Rekening Bank Penyaluran
              </Text>
              <Text style={styles.itemSubtitle} numberOfLines={2}>
                {catatanRevisiRekening ||
                  'Data rekening dan foto buku tabungan belum diunggah.'}
              </Text>
            </View>
            <ChevronRight size={16} color={ColorPalette.teal[700]} />
          </TouchableOpacity>
        )}

        {/* Notifikasi Berkas Revisi */}
        {berkasRevisiCount > 0 && (
          <TouchableOpacity
            style={[styles.itemCard, styles.itemCardDanger]}
            activeOpacity={0.8}
            onPress={onOpenBerkas}>
            <View style={[styles.iconBox, { backgroundColor: ColorPalette.rose[100] }]}>
              <FolderArchive size={18} color={ColorPalette.rose[700]} />
            </View>
            <View style={styles.itemTextWrap}>
              <Text style={[styles.itemTitle, { color: ColorPalette.rose[900] }]}>
                Perbaiki {berkasRevisiCount} Berkas Persyaratan
              </Text>
              <Text style={styles.itemSubtitle} numberOfLines={2}>
                {catatanRevisiBerkas[0] || 'Ada catatan perbaikan dokumen dari verifikator.'}
              </Text>
            </View>
            <ChevronRight size={16} color={ColorPalette.rose[700]} />
          </TouchableOpacity>
        )}

        {/* Notifikasi Profil Usaha */}
        {isProfilIncomplete && (
          <TouchableOpacity
            style={[styles.itemCard, styles.itemCardWarning]}
            activeOpacity={0.8}
            onPress={onOpenProfilUsaha}>
            <View style={[styles.iconBox, { backgroundColor: ColorPalette.amber[100] }]}>
              <Building2 size={18} color={ColorPalette.amber[700]} />
            </View>
            <View style={styles.itemTextWrap}>
              <Text style={[styles.itemTitle, { color: ColorPalette.amber[900] }]}>
                Lengkapi Data Profil Identitas Usaha
              </Text>
              <Text style={styles.itemSubtitle} numberOfLines={2}>
                {catatanRevisiProfil ||
                  'KBLI, sektor bidang usaha, dan deskripsi usaha belum lengkap.'}
              </Text>
            </View>
            <ChevronRight size={16} color={ColorPalette.amber[700]} />
          </TouchableOpacity>
        )}

        {/* Notifikasi Alamat */}
        {isAlamatIncomplete && (
          <TouchableOpacity
            style={[styles.itemCard, styles.itemCardWarning]}
            activeOpacity={0.8}
            onPress={onOpenAlamat}>
            <View style={[styles.iconBox, { backgroundColor: ColorPalette.amber[100] }]}>
              <MapPin size={18} color={ColorPalette.amber[700]} />
            </View>
            <View style={styles.itemTextWrap}>
              <Text style={[styles.itemTitle, { color: ColorPalette.amber[900] }]}>
                Lengkapi 3 Kategori Data Alamat
              </Text>
              <Text style={styles.itemSubtitle} numberOfLines={2}>
                {catatanRevisiAlamat ||
                  'Alamat KTP, Lokasi Usaha, atau Domisili tempat tinggal belum lengkap.'}
              </Text>
            </View>
            <ChevronRight size={16} color={ColorPalette.amber[700]} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ColorPalette.rose[800],
  },
  cardsList: {
    gap: 8,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 10,
  },
  itemCardDanger: {
    backgroundColor: ColorPalette.rose[50],
    borderColor: ColorPalette.rose[200],
  },
  itemCardWarning: {
    backgroundColor: ColorPalette.amber[50],
    borderColor: ColorPalette.amber[200],
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTextWrap: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  itemSubtitle: {
    fontSize: 11,
    color: ColorPalette.slate[600],
    lineHeight: 15,
  },
});
