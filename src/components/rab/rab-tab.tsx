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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTKMLStore } from '@/stores/tkml-store';
import { LpjNotaFormData } from '@/utils/validators';
import { ColorPalette } from '@/constants/colors';
import { RabItemCard } from '@/components/rab/rab-item-card';
import { LpjNotaCard } from '@/components/rab/lpj-nota-card';
import { LpjNotaFormModal } from '@/components/rab/lpj-nota-form-modal';
import { formatRupiah } from '@/utils/formatters';
import {
  ReceiptText,
  FileCheck2,
  Plus,
  Coins,
  TrendingUp,
  X,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export const RabTab: React.FC = () => {
  const { rabList, lpjList, addLpjNota, deleteLpjNota } = useTKMLStore();
  const [activeSubTab, setActiveSubTab] = useState<'usulan' | 'realisasi'>('usulan');

  // Modal Form State
  const [formModalVisible, setFormModalVisible] = useState(false);

  // Fullscreen Photo Preview
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState('');

  const totalUsulan = rabList.reduce((acc, item) => acc + item.subtotal, 0);
  const totalRealisasi = lpjList.reduce((acc, item) => acc + item.nominalRiil, 0);
  const persentaseRealisasi = totalUsulan > 0 ? Math.min(100, Math.round((totalRealisasi / totalUsulan) * 100)) : 0;

  const handleDeleteNota = (id: string) => {
    Alert.alert(
      'Hapus Nota Realisasi',
      'Apakah Anda yakin ingin menghapus catatan nota belanja ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Hapus',
          style: 'destructive',
          onPress: () => deleteLpjNota(id),
        },
      ]
    );
  };

  const handleFormSubmit = (data: LpjNotaFormData) => {
    addLpjNota(data);
  };

  const handleOpenPhotoPreview = (uri: string, title: string) => {
    setPreviewUri(uri);
    setPreviewTitle(title);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header & Anggaran Summary Card */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RAB & Pelaporan LPJ</Text>
        <Text style={styles.headerSubtitle}>
          Kelola usulan rincian anggaran belanja & laporkan realisasi kuitansi belanja.
        </Text>

        {/* Budget Progress Summary Box */}
        <View style={styles.budgetCard}>
          <View style={styles.budgetRow}>
            <View>
              <Text style={styles.budgetLabel}>Total Usulan Disetujui</Text>
              <Text style={styles.budgetValue}>{formatRupiah(totalUsulan)}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.budgetLabel}>Total Realisasi LPJ</Text>
              <Text style={[styles.budgetValue, { color: ColorPalette.emerald[700] }]}>
                {formatRupiah(totalRealisasi)}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${persentaseRealisasi}%` }]} />
          </View>

          <View style={styles.progressLabelRow}>
            <Text style={styles.progressPercentText}>
              Penyerapan: {persentaseRealisasi}% dari pagu anggaran
            </Text>
            <Text style={styles.sisaText}>
              Sisa: {formatRupiah(Math.max(0, totalUsulan - totalRealisasi))}
            </Text>
          </View>
        </View>

        {/* Sub-tab Toggle */}
        <View style={styles.tabToggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, activeSubTab === 'usulan' && styles.toggleBtnActive]}
            onPress={() => setActiveSubTab('usulan')}>
            <FileCheck2
              size={16}
              color={activeSubTab === 'usulan' ? ColorPalette.primary[700] : ColorPalette.slate[500]}
            />
            <Text
              style={[
                styles.toggleText,
                activeSubTab === 'usulan' && styles.toggleTextActive,
              ]}>
              1. Usulan RAB ({rabList.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleBtn, activeSubTab === 'realisasi' && styles.toggleBtnActive]}
            onPress={() => setActiveSubTab('realisasi')}>
            <ReceiptText
              size={16}
              color={activeSubTab === 'realisasi' ? ColorPalette.amber[700] : ColorPalette.slate[500]}
            />
            <Text
              style={[
                styles.toggleText,
                activeSubTab === 'realisasi' && styles.toggleTextActive,
              ]}>
              2. Realisasi LPJ ({lpjList.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main List ScrollView */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {activeSubTab === 'usulan' ? (
          <View style={styles.itemsList}>
            {rabList.map((item) => (
              <RabItemCard key={item.id} item={item} />
            ))}
          </View>
        ) : (
          <View style={styles.itemsList}>
            {lpjList.length === 0 ? (
              <View style={styles.emptyState}>
                <ReceiptText size={48} color={ColorPalette.slate[300]} />
                <Text style={styles.emptyTitle}>Belum Ada Bukti Realisasi</Text>
                <Text style={styles.emptyDesc}>
                  Tekan tombol &quot;Input Nota Belanja&quot; di bawah untuk mulai melaporkan kuitansi belanja.
                </Text>
              </View>
            ) : (
              lpjList.map((nota) => {
                const linkedRab = rabList.find((r) => r.id === nota.rabItemId);
                return (
                  <LpjNotaCard
                    key={nota.id}
                    nota={nota}
                    rabItem={linkedRab}
                    onDelete={handleDeleteNota}
                    onPreviewImage={handleOpenPhotoPreview}
                  />
                );
              })
            )}
          </View>
        )}
      </ScrollView>

      {/* FAB Tambah Nota Realisasi LPJ */}
      {activeSubTab === 'realisasi' && (
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={() => setFormModalVisible(true)}>
          <Plus size={22} color="#FFFFFF" strokeWidth={3} />
          <Text style={styles.fabText}>Input Nota Belanja</Text>
        </TouchableOpacity>
      )}

      {/* Form Input Modal */}
      <LpjNotaFormModal
        visible={formModalVisible}
        onClose={() => setFormModalVisible(false)}
        onSubmitData={handleFormSubmit}
        rabItems={rabList}
      />

      {/* Photo Fullscreen Viewer */}
      <Modal
        visible={!!previewUri}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewUri(null)}>
        <View style={styles.previewBackdrop}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle} numberOfLines={1}>
              {previewTitle}
            </Text>
            <TouchableOpacity
              onPress={() => setPreviewUri(null)}
              style={styles.previewCloseBtn}>
              <X size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {previewUri && (
            <Image
              source={{ uri: previewUri }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          )}
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
    gap: 10,
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
  budgetCard: {
    backgroundColor: ColorPalette.slate[50],
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: ColorPalette.slate[200],
    gap: 8,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetLabel: {
    fontSize: 11,
    color: ColorPalette.slate[500],
  },
  budgetValue: {
    fontSize: 15,
    fontWeight: '800',
    color: ColorPalette.slate[900],
    marginTop: 2,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: ColorPalette.slate[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: ColorPalette.emerald[500],
    borderRadius: 4,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressPercentText: {
    fontSize: 11,
    fontWeight: '600',
    color: ColorPalette.slate[700],
  },
  sisaText: {
    fontSize: 11,
    color: ColorPalette.slate[500],
  },
  tabToggle: {
    flexDirection: 'row',
    backgroundColor: ColorPalette.slate[100],
    borderRadius: 12,
    padding: 4,
    marginTop: 4,
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
    color: ColorPalette.primary[800],
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    backgroundColor: ColorPalette.slate[50],
    minHeight: '100%',
    paddingBottom: 100,
  },
  itemsList: {
    gap: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ColorPalette.slate[800],
    marginTop: 8,
  },
  emptyDesc: {
    fontSize: 13,
    color: ColorPalette.slate[500],
    textAlign: 'center',
    lineHeight: 18,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: ColorPalette.amber[600],
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: ColorPalette.amber[800],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  previewBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
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
    height: width * 1.2,
    borderRadius: 12,
    alignSelf: 'center',
  },
});
