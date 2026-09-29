import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ItemRAB } from '@/types/tkml';
import { ColorPalette } from '@/constants/colors';
import { Badge } from '@/components/ui/badge';
import { formatRupiah } from '@/utils/formatters';
import { PackageCheck, CheckCircle2, Clock, Edit2, Trash2, Lock } from 'lucide-react-native';

interface RabItemCardProps {
  item: ItemRAB;
  onEdit?: (item: ItemRAB) => void;
  onDelete?: (id: string) => void;
}

export const RabItemCard: React.FC<RabItemCardProps> = ({ item, onEdit, onDelete }) => {
  const isVerified = item.status === 'disetujui';

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconBox}>
          <PackageCheck
            size={20}
            color={isVerified ? ColorPalette.emerald[700] : ColorPalette.primary[700]}
          />
        </View>
        <View style={styles.titleWrap}>
          <Text style={styles.namaBarang}>{item.namaBarang}</Text>
          <Text style={styles.spekText}>{item.spesifikasi}</Text>
        </View>
      </View>

      <View style={styles.calcBox}>
        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>Volume & Satuan:</Text>
          <Text style={styles.calcValue}>
            {item.volume} {item.satuan}
          </Text>
        </View>

        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>Harga Satuan:</Text>
          <Text style={styles.calcValue}>{formatRupiah(item.hargaSatuan)}</Text>
        </View>

        <View style={[styles.calcRow, styles.subtotalRow]}>
          <Text style={styles.subtotalLabel}>Subtotal Usulan:</Text>
          <Text style={styles.subtotalValue}>{formatRupiah(item.subtotal)}</Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        <Badge
          label={
            isVerified
              ? 'Disetujui Tim Kemnaker'
              : item.status === 'ditolak'
              ? 'Ditolak / Perlu Revisi'
              : 'Menunggu Verifikasi (Draft)'
          }
          variant={isVerified ? 'success' : item.status === 'ditolak' ? 'danger' : 'warning'}
          icon={
            isVerified ? (
              <CheckCircle2 size={13} color={ColorPalette.emerald[700]} />
            ) : (
              <Clock size={13} color={ColorPalette.amber[700]} />
            )
          }
        />

        {/* Action Buttons: hanya muncul jika belum diverifikasi admin */}
        {!isVerified ? (
          <View style={styles.actionsBox}>
            {onDelete && (
              <TouchableOpacity
                style={styles.deleteBtn}
                activeOpacity={0.7}
                onPress={() => onDelete(item.id)}>
                <Trash2 size={14} color={ColorPalette.rose[600]} />
                <Text style={styles.deleteText}>Hapus</Text>
              </TouchableOpacity>
            )}

            {onEdit && (
              <TouchableOpacity
                style={styles.editBtn}
                activeOpacity={0.7}
                onPress={() => onEdit(item)}>
                <Edit2 size={14} color={ColorPalette.primary[700]} />
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.lockedBox}>
            <Lock size={12} color={ColorPalette.slate[400]} />
            <Text style={styles.lockedText}>Terkunci</Text>
          </View>
        )}
      </View>

      {item.catatan && <Text style={styles.catatanText}>{item.catatan}</Text>}
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
    gap: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: ColorPalette.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
  },
  namaBarang: {
    fontSize: 15,
    fontWeight: '700',
    color: ColorPalette.slate[900],
  },
  spekText: {
    fontSize: 12,
    color: ColorPalette.slate[500],
    marginTop: 2,
    lineHeight: 16,
  },
  calcBox: {
    backgroundColor: ColorPalette.slate[50],
    borderRadius: 10,
    padding: 10,
    gap: 6,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calcLabel: {
    fontSize: 12,
    color: ColorPalette.slate[600],
  },
  calcValue: {
    fontSize: 12,
    fontWeight: '600',
    color: ColorPalette.slate[800],
  },
  subtotalRow: {
    borderTopWidth: 1,
    borderTopColor: ColorPalette.slate[200],
    paddingTop: 6,
    marginTop: 2,
  },
  subtotalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: ColorPalette.slate[900],
  },
  subtotalValue: {
    fontSize: 14,
    fontWeight: '800',
    color: ColorPalette.primary[700],
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 4,
  },
  actionsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
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
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  editText: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorPalette.primary[700],
  },
  lockedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ColorPalette.slate[100],
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  lockedText: {
    fontSize: 11,
    color: ColorPalette.slate[500],
    fontWeight: '600',
  },
  catatanText: {
    fontSize: 11,
    color: ColorPalette.slate[500],
    fontStyle: 'italic',
  },
});
