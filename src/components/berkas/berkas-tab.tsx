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
import { UsahaProdukSection } from '@/components/berkas/usaha-produk-section';
import { FileText, Building2, X } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export const BerkasTab: React.FC = () => {
  const { berkasList, uploadBerkas } = useTKMLStore();
  const [activeSubTab, setActiveSubTab] = useState<'berkas' | 'usaha'>('berkas');

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

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Tab Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Berkas & Profil Usaha</Text>
        <Text style={styles.headerSubtitle}>
          Lengkapi identitas, dokumen legalitas, dan katalog produk usaha Anda.
        </Text>

        {/* Sub-tab Toggle Pill */}
        <View style={styles.tabToggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, activeSubTab === 'berkas' && styles.toggleBtnActive]}
            onPress={() => setActiveSubTab('berkas')}>
            <FileText
              size={16}
              color={activeSubTab === 'berkas' ? ColorPalette.primary[700] : ColorPalette.slate[500]}
            />
            <Text
              style={[
                styles.toggleText,
                activeSubTab === 'berkas' && styles.toggleTextActive,
              ]}>
              Dokumen Persyaratan ({berkasList.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleBtn, activeSubTab === 'usaha' && styles.toggleBtnActive]}
            onPress={() => setActiveSubTab('usaha')}>
            <Building2
              size={16}
              color={activeSubTab === 'usaha' ? ColorPalette.primary[700] : ColorPalette.slate[500]}
            />
            <Text
              style={[
                styles.toggleText,
                activeSubTab === 'usaha' && styles.toggleTextActive,
              ]}>
              Profil Usaha & Produk
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {activeSubTab === 'berkas' ? (
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
        ) : (
          <UsahaProdukSection />
        )}
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
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: ColorPalette.slate[200],
    backgroundColor: '#FFFFFF',
    gap: 6,
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
  tabToggle: {
    flexDirection: 'row',
    backgroundColor: ColorPalette.slate[100],
    borderRadius: 12,
    padding: 4,
    marginTop: 10,
    gap: 4,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  toggleBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: ColorPalette.slate[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: ColorPalette.slate[600],
  },
  toggleTextActive: {
    color: ColorPalette.primary[700],
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    backgroundColor: ColorPalette.slate[50],
    minHeight: '100%',
    paddingBottom: 40,
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
