import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ItemRAB } from '@/types/tkml';
import { ColorPalette } from '@/constants/colors';
import { Badge } from '@/components/ui/badge';
import { formatRupiah } from '@/utils/formatters';
import { PackageCheck, CheckCircle2 } from 'lucide-react-native';

interface RabItemCardProps {
  item: ItemRAB;
}

export const RabItemCard: React.FC<RabItemCardProps> = ({ item }) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconBox}>
          <PackageCheck size={20} color={ColorPalette.primary[700]} />
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
          label={item.status === 'disetujui' ? 'Disetujui Tim Kemnaker' : 'Sedang Ditinjau'}
          variant={item.status === 'disetujui' ? 'success' : 'warning'}
          icon={<CheckCircle2 size={13} color={ColorPalette.emerald[700]} />}
        />
        {item.catatan && <Text style={styles.catatanText}>{item.catatan}</Text>}
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
  },
  catatanText: {
    fontSize: 11,
    color: ColorPalette.slate[500],
    fontStyle: 'italic',
  },
});
