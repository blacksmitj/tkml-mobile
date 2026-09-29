import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTKMLStore } from '@/stores/tkml-store';
import { BerkasItem } from '@/types/tkml';
import { ColorPalette } from '@/constants/colors';
import { BerkasCard } from '@/components/berkas/berkas-card';
import { UploadModal } from '@/components/berkas/upload-modal';
import { FileText, X, AlertCircle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export const BerkasTab: React.FC = () => {
  const { berkasList, uploadBerkas } = useTKMLStore();

  // Modal State
  const [selectedBerkas, setSelectedBerkas] = useState<BerkasItem | null>(null);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);

  const handleOpenUpload = (item: BerkasItem) => {
    setSelectedBerkas(item);
    setUploadModalVisible(true);
  };

  const handleOpenPreview = (item: BerkasItem) => {
    setSelectedBerkas(item);
    setPreviewModalVisible(true);
  };

  const handleImageUploaded = (uri: string, sizeFormatted: string) => {
    if (selectedBerkas) {
      uploadBerkas(selectedBerkas.id, uri, sizeFormatted);
    }
  };

  const berkasRevisiCount = berkasList.filter((b) => b.status === 'perlu_revisi').length;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dokumen Berkas Persyaratan</Text>
        <Text style={styles.headerSubtitle}>
          Unggah foto e-KTP, Kartu Keluarga, NPWP, NIB, dan Rekening Bank resmi untuk verifikasi program TKML.
        </Text>
      </View>

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {berkasRevisiCount > 0 && (
          <View style={styles.revisiBanner}>
            <AlertCircle size={18} color={ColorPalette.rose[700]} />
            <Text style={styles.revisiBannerText}>
              Ada {berkasRevisiCount} berkas yang memerlukan perbaikan/unggah ulang sesuai catatan verifikator Kemnaker.
            </Text>
          </View>
        )}

        <View style={styles.berkasList}>
          {berkasList.map((item) => (
            <BerkasCard
              key={item.id}
              item={item}
              onPressUpload={handleOpenUpload}
              onPressPreview={handleOpenPreview}
            />
          ))}
        </View>
      </ScrollView>

      {/* Upload Bottom Sheet Modal */}
      <UploadModal
        visible={uploadModalVisible}
        berkasNama={selectedBerkas?.nama || ''}
        onClose={() => setUploadModalVisible(false)}
        onImageSelected={handleImageUploaded}
      />

      {/* Image Preview Modal */}
      <Modal
        visible={previewModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewModalVisible(false)}>
        <View style={styles.previewBackdrop}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle} numberOfLines={1}>
              {selectedBerkas?.nama}
            </Text>
            <TouchableOpacity
              onPress={() => setPreviewModalVisible(false)}
              style={styles.previewCloseBtn}>
              <X size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {selectedBerkas?.fileUri && (
            <Image
              source={{ uri: selectedBerkas.fileUri }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          )}

          <View style={styles.previewFooter}>
            <Text style={styles.previewFooterText}>
              Ukuran: {selectedBerkas?.fileSizeFormatted || '-'} • Diunggah:{' '}
              {selectedBerkas?.uploadedAt || '-'}
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: ColorPalette.slate[200],
    backgroundColor: '#FFFFFF',
    gap: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: ColorPalette.slate[900],
  },
  headerSubtitle: {
    fontSize: 13,
    color: ColorPalette.slate[500],
    lineHeight: 18,
  },
  scrollContent: {
    padding: 16,
    backgroundColor: ColorPalette.slate[50],
    minHeight: '100%',
    paddingBottom: 40,
    gap: 10,
  },
  revisiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: ColorPalette.rose[50],
    borderWidth: 1,
    borderColor: ColorPalette.rose[300],
    padding: 12,
    borderRadius: 12,
  },
  revisiBannerText: {
    fontSize: 12,
    color: ColorPalette.rose[900],
    fontWeight: '600',
    flex: 1,
    lineHeight: 16,
  },
  berkasList: {
    gap: 8,
  },
  previewBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  previewCloseBtn: {
    padding: 8,
  },
  previewImage: {
    width: width - 40,
    height: width * 1.1,
    borderRadius: 12,
    alignSelf: 'center',
  },
  previewFooter: {
    alignItems: 'center',
  },
  previewFooterText: {
    fontSize: 12,
    color: ColorPalette.slate[300],
  },
});
