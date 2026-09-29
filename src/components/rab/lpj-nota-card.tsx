import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { NotaLPJ, ItemRAB } from '@/types/tkml';
import { ColorPalette } from '@/constants/colors';
import { formatRupiah } from '@/utils/formatters';
import {
  Receipt,
  Store,
  Calendar,
  Image as ImageIcon,
  Trash2,
  Package,
} from 'lucide-react-native';

interface LpjNotaCardProps {
  nota: NotaLPJ;
  rabItem?: ItemRAB;
  onDelete: (id: string) => void;
  onPreviewImage: (uri: string, title: string) => void;
}

export const LpjNotaCard: React.FC<LpjNotaCardProps> = ({
  nota,
  rabItem,
  onDelete,
  onPreviewImage,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconBox}>
          <Receipt size={20} color={ColorPalette.amber[700]} />
        </View>
        <View style={styles.titleWrap}>
          <Text style={styles.nominalText}>{formatRupiah(nota.nominalRiil)}</Text>
          <View style={styles.storeRow}>
            <Store size={12} color={ColorPalette.slate[400]} />
            <Text style={styles.storeText}>{nota.namaToko}</Text>
          </View>
        </View>
      </View>

      {/* Linked RAB Item */}
      {rabItem && (
        <View style={styles.linkedRabBox}>
          <Package size={14} color={ColorPalette.primary[700]} />
          <Text style={styles.linkedRabText} numberOfLines={1}>
            Dialokasikan untuk: <Text style={styles.boldText}>{rabItem.namaBarang}</Text>
          </Text>
        </View>
      )}

      {/* 2 Bukti Foto: Nota dan Fisik Barang */}
      <View style={styles.photoSection}>
        <Text style={styles.photoSectionTitle}>Bukti Dokumentasi Belanja:</Text>
        <View style={styles.photosRow}>
          {/* Foto Nota */}
          <TouchableOpacity
            style={styles.photoBox}
            activeOpacity={0.8}
            onPress={() => onPreviewImage(nota.fotoNotaUri, 'Foto Nota / Kuitansi Belanja')}>
            <Image source={{ uri: nota.fotoNotaUri }} style={styles.thumbImage} />
            <View style={styles.photoLabelBar}>
              <Text style={styles.photoLabelText}>Foto Nota</Text>
            </View>
          </TouchableOpacity>

          {/* Foto Fisik Barang */}
          <TouchableOpacity
            style={styles.photoBox}
            activeOpacity={0.8}
            onPress={() => onPreviewImage(nota.fotoBarangUri, 'Foto Fisik Barang / Peralatan')}>
            <Image source={{ uri: nota.fotoBarangUri }} style={styles.thumbImage} />
            <View style={styles.photoLabelBar}>
              <Text style={styles.photoLabelText}>Fisik Barang</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {nota.catatan && (
        <Text style={styles.catatanText}>Catatan: {nota.catatan}</Text>
      )}

      <View style={styles.footerRow}>
        <View style={styles.dateRow}>
          <Calendar size={12} color={ColorPalette.slate[400]} />
          <Text style={styles.dateText}>Tanggal: {nota.tanggalTransaksi}</Text>
        </View>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => onDelete(nota.id)}>
          <Trash2 size={14} color={ColorPalette.rose[600]} />
          <Text style={styles.deleteText}>Hapus Nota</Text>
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
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: ColorPalette.amber[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
  },
  nominalText: {
    fontSize: 17,
    fontWeight: '800',
    color: ColorPalette.slate[900],
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  storeText: {
    fontSize: 13,
    color: ColorPalette.slate[600],
    fontWeight: '600',
  },
  linkedRabBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ColorPalette.primary[50],
    padding: 8,
    borderRadius: 8,
  },
  linkedRabText: {
    fontSize: 12,
    color: ColorPalette.primary[800],
    flex: 1,
  },
  boldText: {
    fontWeight: '700',
  },
  photoSection: {
    gap: 6,
  },
  photoSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: ColorPalette.slate[700],
  },
  photosRow: {
    flexDirection: 'row',
    gap: 10,
  },
  photoBox: {
    flex: 1,
    height: 90,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: ColorPalette.slate[200],
    backgroundColor: ColorPalette.slate[100],
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  photoLabelBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingVertical: 3,
    alignItems: 'center',
  },
  photoLabelText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  catatanText: {
    fontSize: 12,
    color: ColorPalette.slate[600],
    fontStyle: 'italic',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: ColorPalette.slate[100],
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    color: ColorPalette.slate[500],
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deleteText: {
    fontSize: 11,
    fontWeight: '600',
    color: ColorPalette.rose[600],
  },
});
