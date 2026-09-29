import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SesiPresensi } from '@/types/tkml';
import { ColorPalette } from '@/constants/colors';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  QrCode,
  Users,
  CheckCircle,
  Building,
} from 'lucide-react-native';

interface SesiCardItemProps {
  sesi: SesiPresensi;
  isAttended: boolean;
  onScanThisSession: (sesi: SesiPresensi) => void;
}

export const SesiCardItem: React.FC<SesiCardItemProps> = ({
  sesi,
  isAttended,
  onScanThisSession,
}) => {
  const getCategoryTheme = (cat: SesiPresensi['kategori']) => {
    switch (cat) {
      case 'bimtek':
        return {
          bg: ColorPalette.blue[50],
          text: ColorPalette.blue[700],
          label: 'BIMTEK PELATIHAN',
        };
      case 'pendampingan':
        return {
          bg: ColorPalette.teal[50],
          text: ColorPalette.teal[700],
          label: 'PENDAMPINGAN USAHA',
        };
      case 'verifikasi_lapangan':
        return {
          bg: ColorPalette.amber[50],
          text: ColorPalette.amber[800],
          label: 'MONEV LAPANGAN',
        };
      default:
        return {
          bg: ColorPalette.slate[100],
          text: ColorPalette.slate[700],
          label: 'SESI TKML',
        };
    }
  };

  const theme = getCategoryTheme(sesi.kategori);

  return (
    <View style={styles.card}>
      {/* Top Badges */}
      <View style={styles.topRow}>
        <View style={[styles.badge, { backgroundColor: theme.bg }]}>
          <Text style={[styles.badgeText, { color: theme.text }]}>
            {theme.label}
          </Text>
        </View>

        {isAttended ? (
          <View style={styles.attendedBadge}>
            <CheckCircle size={12} color={ColorPalette.emerald[700]} />
            <Text style={styles.attendedBadgeText}>SUDAH PRESENSI</Text>
          </View>
        ) : (
          <View
            style={[
              styles.statusPill,
              {
                backgroundColor:
                  sesi.status === 'aktif'
                    ? ColorPalette.emerald[50]
                    : ColorPalette.slate[100],
              },
            ]}>
            <Text
              style={[
                styles.statusPillText,
                {
                  color:
                    sesi.status === 'aktif'
                      ? ColorPalette.emerald[700]
                      : ColorPalette.slate[600],
                },
              ]}>
              {sesi.status === 'aktif' ? '• Sesi Sedang Berjalan' : 'Sesi Mendatang'}
            </Text>
          </View>
        )}
      </View>

      {/* Judul Sesi */}
      <Text style={styles.title}>{sesi.judulSesi}</Text>
      <Text style={styles.desc}>{sesi.deskripsi}</Text>

      {/* Meta Grid */}
      <View style={styles.metaBox}>
        <View style={styles.metaItem}>
          <User size={13} color={ColorPalette.slate[500]} />
          <Text style={styles.metaLabel} numberOfLines={1}>
            {sesi.namaFasilitator}
          </Text>
        </View>

        <View style={styles.metaItem}>
          <Building size={13} color={ColorPalette.slate[500]} />
          <Text style={styles.metaLabel} numberOfLines={1}>
            {sesi.instansi}
          </Text>
        </View>

        <View style={styles.metaItem}>
          <Clock size={13} color={ColorPalette.slate[500]} />
          <Text style={styles.metaLabel}>
            {sesi.tanggal} • {sesi.jamMulai} - {sesi.jamSelesai} WIB
          </Text>
        </View>

        <View style={styles.metaItem}>
          <MapPin size={13} color={ColorPalette.slate[500]} />
          <Text style={styles.metaLabel} numberOfLines={1}>
            {sesi.lokasiNama} (Radius GPS {sesi.radiusMeter}m)
          </Text>
        </View>
      </View>

      {/* Footer Info & Action */}
      <View style={styles.footerRow}>
        <View style={styles.pesertaInfo}>
          <Users size={14} color={ColorPalette.slate[500]} />
          <Text style={styles.pesertaText}>
            Hadir: <Text style={{ fontWeight: '700', color: ColorPalette.slate[800] }}>{sesi.totalPesertaHadir}</Text>/{sesi.kuotaPeserta} Peserta
          </Text>
        </View>

        {!isAttended && sesi.status === 'aktif' && (
          <TouchableOpacity
            style={styles.scanBtn}
            activeOpacity={0.8}
            onPress={() => onScanThisSession(sesi)}>
            <QrCode size={15} color="#FFFFFF" />
            <Text style={styles.scanBtnText}>Scan Sekarang</Text>
          </TouchableOpacity>
        )}
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  attendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ColorPalette.emerald[100],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  attendedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: ColorPalette.emerald[800],
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: ColorPalette.slate[900],
    lineHeight: 20,
  },
  desc: {
    fontSize: 12,
    color: ColorPalette.slate[500],
    lineHeight: 17,
  },
  metaBox: {
    backgroundColor: ColorPalette.slate[50],
    borderRadius: 10,
    padding: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: ColorPalette.slate[100],
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaLabel: {
    fontSize: 11,
    color: ColorPalette.slate[600],
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  pesertaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pesertaText: {
    fontSize: 12,
    color: ColorPalette.slate[500],
  },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ColorPalette.primary[700],
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  scanBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
