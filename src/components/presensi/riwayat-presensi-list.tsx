import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { RiwayatPresensi } from '@/types/tkml';
import { ColorPalette } from '@/constants/colors';
import {
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
  Trash2,
  QrCode,
  Sparkles,
  Award,
} from 'lucide-react-native';

interface RiwayatPresensiListProps {
  riwayatList: RiwayatPresensi[];
  onDeleteRecord: (id: string) => void;
  onOpenScanner: () => void;
}

export const RiwayatPresensiList: React.FC<RiwayatPresensiListProps> = ({
  riwayatList,
  onDeleteRecord,
  onOpenScanner,
}) => {
  if (riwayatList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <QrCode size={36} color={ColorPalette.slate[400]} />
        </View>
        <Text style={styles.emptyTitle}>Belum Ada Riwayat Presensi</Text>
        <Text style={styles.emptyDesc}>
          Anda belum memindai QR Code kehadiran untuk sesi bimtek atau pendampingan TKML.
        </Text>
        <TouchableOpacity
          style={styles.emptyScanBtn}
          activeOpacity={0.8}
          onPress={onOpenScanner}>
          <QrCode size={16} color="#FFFFFF" />
          <Text style={styles.emptyScanText}>Mulai Scan Kehadiran</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getStatusBadge = (status: RiwayatPresensi['statusKehadiran']) => {
    switch (status) {
      case 'hadir_tepat_waktu':
        return {
          bg: ColorPalette.emerald[100],
          text: ColorPalette.emerald[800],
          icon: <CheckCircle2 size={13} color={ColorPalette.emerald[700]} />,
          label: 'Hadir Tepat Waktu',
        };
      case 'hadir_terlambat':
        return {
          bg: ColorPalette.amber[100],
          text: ColorPalette.amber[800],
          icon: <AlertCircle size={13} color={ColorPalette.amber[700]} />,
          label: 'Hadir Terlambat',
        };
      case 'di_luar_radius':
        return {
          bg: ColorPalette.rose[100],
          text: ColorPalette.rose[800],
          icon: <AlertCircle size={13} color={ColorPalette.rose[700]} />,
          label: 'Di Luar Radius GPS',
        };
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Stat Ringkas */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryVal}>{riwayatList.length}</Text>
          <Text style={styles.summaryLabel}>Total Kehadiran</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryVal, { color: ColorPalette.emerald[600] }]}>
            {riwayatList.filter((r) => r.statusKehadiran !== 'di_luar_radius').length}
          </Text>
          <Text style={styles.summaryLabel}>Terverifikasi</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryVal, { color: ColorPalette.primary[600] }]}>100%</Text>
          <Text style={styles.summaryLabel}>Kepatuhan</Text>
        </View>
      </View>

      {/* List Kartu Riwayat */}
      <View style={styles.list}>
        {riwayatList.map((item) => {
          const badge = getStatusBadge(item.statusKehadiran);
          return (
            <View key={item.id} style={styles.recordCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                  {badge.icon}
                  <Text style={[styles.statusText, { color: badge.text }]}>
                    {badge.label}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => onDeleteRecord(item.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Trash2 size={16} color={ColorPalette.slate[400]} />
                </TouchableOpacity>
              </View>

              <Text style={styles.sessionTitle}>{item.judulSesi}</Text>

              <View style={styles.infoRow}>
                <Clock size={13} color={ColorPalette.slate[500]} />
                <Text style={styles.infoText}>{item.waktuScan}</Text>
              </View>

              <View style={styles.infoRow}>
                <MapPin size={13} color={ColorPalette.slate[500]} />
                <Text style={styles.infoText} numberOfLines={1}>
                  {item.lokasiNama} • Radius: {item.jarakMeter}m
                </Text>
              </View>

              {item.catatan && (
                <View style={styles.noteBox}>
                  <Text style={styles.noteText}>{item.catatan}</Text>
                </View>
              )}

              <View style={styles.cardFooter}>
                <Text style={styles.tokenText}>Token: {item.tokenQR}</Text>
                <View style={styles.metodeBadge}>
                  <Text style={styles.metodeText}>
                    {item.metode === 'qr_camera'
                      ? '📷 Kamera'
                      : item.metode === 'kode_manual'
                      ? '⌨️ Manual'
                      : '⚡ Demo'}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  summaryBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: ColorPalette.slate[200],
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryVal: {
    fontSize: 16,
    fontWeight: '800',
    color: ColorPalette.slate[900],
  },
  summaryLabel: {
    fontSize: 11,
    color: ColorPalette.slate[500],
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 24,
    backgroundColor: ColorPalette.slate[200],
  },
  list: {
    gap: 10,
  },
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: ColorPalette.slate[200],
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sessionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorPalette.slate[900],
    lineHeight: 19,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    color: ColorPalette.slate[600],
    flex: 1,
  },
  noteBox: {
    backgroundColor: ColorPalette.slate[50],
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ColorPalette.slate[100],
  },
  noteText: {
    fontSize: 11,
    color: ColorPalette.slate[600],
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: ColorPalette.slate[100],
  },
  tokenText: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: ColorPalette.slate[500],
  },
  metodeBadge: {
    backgroundColor: ColorPalette.slate[100],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  metodeText: {
    fontSize: 10,
    color: ColorPalette.slate[700],
    fontWeight: '600',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ColorPalette.slate[200],
    gap: 12,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: ColorPalette.slate[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ColorPalette.slate[800],
  },
  emptyDesc: {
    fontSize: 12,
    color: ColorPalette.slate[500],
    textAlign: 'center',
    lineHeight: 18,
  },
  emptyScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ColorPalette.primary[700],
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  emptyScanText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
