import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { BerkasItem } from '@/types/tkml';
import { ColorPalette } from '@/constants/colors';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Camera, AlertCircle, CheckCircle2, Clock } from 'lucide-react-native';

interface BerkasCardProps {
  item: BerkasItem;
  onPressUpload: (item: BerkasItem) => void;
  onPressPreview?: (item: BerkasItem) => void;
}

export const BerkasCard: React.FC<BerkasCardProps> = ({
  item,
  onPressUpload,
  onPressPreview,
}) => {
  const getStatusIcon = () => {
    switch (item.status) {
      case 'diverifikasi':
        return <CheckCircle2 size={16} color={ColorPalette.emerald[600]} />;
      case 'menunggu':
        return <Clock size={16} color={ColorPalette.amber[600]} />;
      case 'perlu_revisi':
        return <AlertCircle size={16} color={ColorPalette.rose[600]} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconBox}>
          <FileText size={22} color={ColorPalette.primary[700]} />
        </View>

        <View style={styles.infoWrapper}>
          <View style={styles.titleRow}>
            <Text style={styles.namaBerkas}>{item.nama}</Text>
            {item.required && <Text style={styles.requiredTag}>Wajib</Text>}
          </View>
          {item.deskripsi ? (
            <Text style={styles.deskripsi}>{item.deskripsi}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.statusRow}>
        <Badge
          label={
            item.status === 'diverifikasi'
              ? 'Diverifikasi'
              : item.status === 'menunggu'
              ? 'Menunggu Review'
              : item.status === 'perlu_revisi'
              ? 'Perlu Revisi'
              : 'Belum Diunggah'
          }
          status={item.status}
          icon={getStatusIcon()}
        />

        {item.fileSizeFormatted && (
          <Text style={styles.sizeText}>Ukuran: {item.fileSizeFormatted}</Text>
        )}
      </View>

      {/* Catatan Admin jika Revisi */}
      {item.status === 'perlu_revisi' && item.catatanAdmin && (
        <View style={styles.catatanBox}>
          <AlertCircle size={15} color={ColorPalette.rose[600]} />
          <Text style={styles.catatanText}>{item.catatanAdmin}</Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        {item.fileUri && (
          <TouchableOpacity
            style={styles.previewBtn}
            onPress={() => onPressPreview && onPressPreview(item)}>
            <Text style={styles.previewText}>Lihat Foto</Text>
          </TouchableOpacity>
        )}

        <Button
          title={
            item.status === 'perlu_revisi'
              ? 'Unggah Ulang'
              : item.status === 'diverifikasi'
              ? 'Ganti Dokumen'
              : 'Unggah Berkas'
          }
          size="sm"
          variant={item.status === 'perlu_revisi' ? 'danger' : 'primary'}
          icon={<Camera size={14} color="#FFFFFF" />}
          onPress={() => onPressUpload(item)}
        />
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
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: ColorPalette.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoWrapper: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  namaBerkas: {
    fontSize: 15,
    fontWeight: '700',
    color: ColorPalette.slate[900],
    flex: 1,
  },
  requiredTag: {
    fontSize: 10,
    color: ColorPalette.rose[600],
    fontWeight: '700',
    backgroundColor: ColorPalette.rose[50],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  deskripsi: {
    fontSize: 12,
    color: ColorPalette.slate[500],
    marginTop: 2,
    lineHeight: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sizeText: {
    fontSize: 11,
    color: ColorPalette.slate[400],
  },
  catatanBox: {
    flexDirection: 'row',
    backgroundColor: ColorPalette.rose[50],
    borderRadius: 8,
    padding: 10,
    gap: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ColorPalette.rose[200],
  },
  catatanText: {
    fontSize: 12,
    color: ColorPalette.rose[900],
    flex: 1,
    lineHeight: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: ColorPalette.slate[100],
  },
  previewBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  previewText: {
    fontSize: 13,
    color: ColorPalette.primary[700],
    fontWeight: '600',
  },
});
