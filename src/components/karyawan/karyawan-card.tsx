import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Karyawan } from '@/types/tkml';
import { ColorPalette } from '@/constants/colors';
import { Badge } from '@/components/ui/badge';
import { maskNik } from '@/utils/formatters';
import {
  User,
  Briefcase,
  Phone,
  Calendar,
  Accessibility,
  Edit2,
  Trash2,
} from 'lucide-react-native';

interface KaryawanCardProps {
  karyawan: Karyawan;
  onEdit: (karyawan: Karyawan) => void;
  onDelete: (id: string) => void;
}

export const KaryawanCard: React.FC<KaryawanCardProps> = ({
  karyawan,
  onEdit,
  onDelete,
}) => {
  const getDisabilitasLabel = () => {
    switch (karyawan.disabilitas) {
      case 'sensorik_netra':
        return 'Sensorik Netra';
      case 'sensorik_rungu_wicara':
        return 'Sensorik Rungu/Wicara';
      case 'fisik':
        return 'Disabilitas Fisik';
      case 'intelektual':
        return 'Disabilitas Intelektual';
      case 'mental':
        return 'Disabilitas Mental';
      case 'tidak_ada':
      default:
        return 'Reguler (Non-Disabilitas)';
    }
  };

  const isDisabilitas = karyawan.disabilitas !== 'tidak_ada';

  const getStatusKerjaLabel = () => {
    switch (karyawan.statusKerja) {
      case 'penuh_waktu':
        return 'Penuh Waktu (Full Time)';
      case 'paruh_waktu':
        return 'Paruh Waktu (Part Time)';
      case 'borongan':
        return 'Borongan';
      case 'musiman':
        return 'Musiman';
      default:
        return karyawan.statusKerja;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarText}>
            {karyawan.namaLengkap
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')}
          </Text>
        </View>

        <View style={styles.nameContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.namaLengkap} numberOfLines={1}>
              {karyawan.namaLengkap}
            </Text>
            <Text style={styles.genderBadge}>
              {karyawan.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
            </Text>
          </View>
          <Text style={styles.nikText}>NIK: {maskNik(karyawan.nik)}</Text>
        </View>
      </View>

      <View style={styles.chipsRow}>
        <Badge
          label={getDisabilitasLabel()}
          variant={isDisabilitas ? 'warning' : 'neutral'}
          icon={
            isDisabilitas ? (
              <Accessibility size={13} color={ColorPalette.amber[700]} />
            ) : undefined
          }
        />
        <Badge label={getStatusKerjaLabel()} variant="primary" />
      </View>

      <View style={styles.detailsBox}>
        <View style={styles.detailItem}>
          <Briefcase size={14} color={ColorPalette.slate[400]} />
          <Text style={styles.detailText}>Posisi: {karyawan.posisi}</Text>
        </View>
        <View style={styles.detailItem}>
          <Phone size={14} color={ColorPalette.slate[400]} />
          <Text style={styles.detailText}>{karyawan.noHp}</Text>
        </View>
        <View style={styles.detailItem}>
          <Calendar size={14} color={ColorPalette.slate[400]} />
          <Text style={styles.detailText}>Lahir: {karyawan.tanggalLahir}</Text>
        </View>
      </View>

      <View style={styles.footerActions}>
        <TouchableOpacity
          style={styles.deleteBtn}
          activeOpacity={0.7}
          onPress={() => onDelete(karyawan.id)}>
          <Trash2 size={16} color={ColorPalette.rose[600]} />
          <Text style={styles.deleteText}>Hapus</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editBtn}
          activeOpacity={0.7}
          onPress={() => onEdit(karyawan)}>
          <Edit2 size={16} color={ColorPalette.primary[700]} />
          <Text style={styles.editText}>Edit Data</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorPalette.slate[200],
    shadowColor: ColorPalette.slate[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
    marginVertical: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ColorPalette.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: ColorPalette.primary[800],
  },
  nameContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  namaLengkap: {
    fontSize: 15,
    fontWeight: '700',
    color: ColorPalette.slate[900],
    flex: 1,
  },
  genderBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: ColorPalette.slate[600],
    backgroundColor: ColorPalette.slate[100],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  nikText: {
    fontSize: 12,
    color: ColorPalette.slate[500],
    marginTop: 2,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  detailsBox: {
    backgroundColor: ColorPalette.slate[50],
    borderRadius: 10,
    padding: 10,
    gap: 6,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    color: ColorPalette.slate[700],
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: ColorPalette.slate[100],
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  deleteText: {
    fontSize: 12,
    fontWeight: '600',
    color: ColorPalette.rose[600],
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ColorPalette.primary[50],
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editText: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorPalette.primary[700],
  },
});
