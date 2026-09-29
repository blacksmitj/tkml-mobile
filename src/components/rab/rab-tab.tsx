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
import { ItemRAB } from '@/types/tkml';
import { LpjNotaFormData } from '@/utils/validators';
import { ColorPalette } from '@/constants/colors';
import { RabItemCard } from '@/components/rab/rab-item-card';
import { RabItemFormModal } from '@/components/rab/rab-item-form-modal';
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
  PackagePlus,
  Info,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export const RabTab: React.FC = () => {
  const {
    user,
    rabList,
    addRabItem,
    updateRabItem,
    deleteRabItem,
    lpjList,
    addLpjNota,
    deleteLpjNota,
  } = useTKMLStore();

  const [activeSubTab, setActiveSubTab] = useState<'usulan' | 'realisasi'>('usulan');

  // Modals
  const [rabModalVisible, setRabModalVisible] = useState(false);
  const [selectedRabItem, setSelectedRabItem] = useState<ItemRAB | null>(null);

  const [lpjModalVisible, setLpjModalVisible] = useState(false);

  // Fullscreen Photo Preview
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState('');

  // Pagu Kemnaker & Perhitungan
  const paguKemnaker = user.paguBantuanKemnaker || 30000000;
  const totalUsulan = rabList.reduce((acc, item) => acc + item.subtotal, 0);
  const totalRealisasi = lpjList.reduce((acc, item) => acc + item.nominalRiil, 0);

  const sisaPaguUsulan = paguKemnaker - totalUsulan;
  const isOverPagu = sisaPaguUsulan < 0;

  const persentasePaguTerpakai = Math.min(100, Math.round((totalUsulan / paguKemnaker) * 100));
  const persentaseRealisasiLPJ =
    totalUsulan > 0 ? Math.min(100, Math.round((totalRealisasi / totalUsulan) * 100)) : 0;

  // Handler Usulan RAB
  const handleOpenAddRab = () => {
    setSelectedRabItem(null);
    setRabModalVisible(true);
  };

  const handleOpenEditRab = (item: ItemRAB) => {
    setSelectedRabItem(item);
    setRabModalVisible(true);
  };

  const handleDeleteRab = (id: string) => {
    Alert.alert(
      'Hapus Item Usulan RAB',
      'Apakah Anda yakin ingin menghapus item usulan anggaran ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Hapus',
          style: 'destructive',
          onPress: () => deleteRabItem(id),
        },
      ]
    );
  };

  const handleSubmitRabForm = (data: {
    namaBarang: string;
    spesifikasi: string;
    volume: number;
    satuan: string;
    hargaSatuan: number;
  }) => {
    if (selectedRabItem) {
      updateRabItem(selectedRabItem.id, data);
    } else {
      addRabItem(data);
    }
  };

  // Handler Realisasi LPJ
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

  const handleSubmitLpjForm = (data: LpjNotaFormData) => {
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
          Rencana Anggaran Belanja bantuan program Tenaga Kerja Mandiri Lanjutan.
        </Text>

        {/* Pagu Kemnaker & Progress Card */}
        <View style={styles.budgetCard}>
          <View style={styles.paguRow}>
            <View style={styles.paguHeaderLeft}>
              <ShieldCheck size={18} color={ColorPalette.primary[700]} />
              <Text style={styles.paguTitle}>Pagu Bantuan Kemnaker</Text>
            </View>
            <Text style={styles.paguValue}>{formatRupiah(paguKemnaker)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.budgetStatsRow}>
            <View>
              <Text style={styles.statLabel}>Total Usulan RAB</Text>
              <Text style={[styles.statValue, isOverPagu ? styles.textDanger : null]}>
                {formatRupiah(totalUsulan)}
              </Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.statLabel}>
                {isOverPagu ? 'Melebihi Pagu' : 'Sisa Pagu Belum Dialokasikan'}
              </Text>
              <Text
                style={[
                  styles.statValue,
                  isOverPagu ? styles.textDanger : { color: ColorPalette.emerald[700] },
                ]}>
                {isOverPagu ? `+${formatRupiah(Math.abs(sisaPaguUsulan))}` : formatRupiah(sisaPaguUsulan)}
              </Text>
            </View>
          </View>

          {/* Progress Bar Pagu Terpakai */}
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${persentasePaguTerpakai}%`,
                  backgroundColor: isOverPagu ? ColorPalette.rose[600] : ColorPalette.primary[600],
                },
              ]}
            />
          </View>

          <View style={styles.progressLabelRow}>
            <Text style={styles.progressPercentText}>
              Alokasi Pagu: {persentasePaguTerpakai}% ({rabList.length} Item)
            </Text>
            <Text style={styles.realisasiText}>
              Realisasi LPJ: {formatRupiah(totalRealisasi)} ({persentaseRealisasiLPJ}%)
            </Text>
          </View>

          {isOverPagu && (
            <View style={styles.overPaguAlert}>
              <AlertTriangle size={14} color={ColorPalette.rose[700]} />
              <Text style={styles.overPaguText}>
                Total usulan melebihi pagu bantuan Kemnaker ({formatRupiah(paguKemnaker)}). Mohon sesuaikan harga atau volume usulan.
              </Text>
            </View>
          )}
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
            <View style={styles.hintNoticeBox}>
              <Info size={16} color={ColorPalette.primary[700]} />
              <Text style={styles.hintNoticeText}>
                Pagu bantuan ditetapkan resmi oleh Kemnaker sebesar <Text style={{ fontWeight: '700' }}>{formatRupiah(paguKemnaker)}</Text>. Anda dapat menambah/mengedit item usulan sebelum diverifikasi admin.
              </Text>
            </View>

            {rabList.length === 0 ? (
              <View style={styles.emptyState}>
                <FileCheck2 size={48} color={ColorPalette.slate[300]} />
                <Text style={styles.emptyTitle}>Belum Ada Usulan Item RAB</Text>
                <Text style={styles.emptyDesc}>
                  Tekan tombol &quot;Tambah Usulan RAB&quot; di bawah untuk menyusun rincian rencana anggaran bantuan usaha Anda sesuai pagu Kemnaker.
                </Text>
              </View>
            ) : (
              rabList.map((item) => (
                <RabItemCard
                  key={item.id}
                  item={item}
                  onEdit={handleOpenEditRab}
                  onDelete={handleDeleteRab}
                />
              ))
            )}
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

      {/* Floating Action Buttons */}
      {activeSubTab === 'usulan' ? (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: ColorPalette.primary[700] }]}
          activeOpacity={0.85}
          onPress={handleOpenAddRab}>
          <PackagePlus size={22} color="#FFFFFF" />
          <Text style={styles.fabText}>Tambah Usulan RAB</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: ColorPalette.amber[600] }]}
          activeOpacity={0.85}
          onPress={() => setLpjModalVisible(true)}>
          <Plus size={22} color="#FFFFFF" strokeWidth={3} />
          <Text style={styles.fabText}>Input Nota Belanja</Text>
        </TouchableOpacity>
      )}

      {/* Modal Form Usulan RAB */}
      <RabItemFormModal
        visible={rabModalVisible}
        onClose={() => setRabModalVisible(false)}
        onSubmitItem={handleSubmitRabForm}
        initialData={selectedRabItem}
      />

      {/* Modal Form Realisasi LPJ */}
      <LpjNotaFormModal
        visible={lpjModalVisible}
        onClose={() => setLpjModalVisible(false)}
        onSubmitData={handleSubmitLpjForm}
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: ColorPalette.slate[200],
    gap: 10,
    shadowColor: ColorPalette.slate[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  paguRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paguHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  paguTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ColorPalette.primary[900],
  },
  paguValue: {
    fontSize: 16,
    fontWeight: '800',
    color: ColorPalette.primary[700],
  },
  divider: {
    height: 1,
    backgroundColor: ColorPalette.slate[100],
  },
  budgetStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 11,
    color: ColorPalette.slate[500],
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorPalette.slate[900],
    marginTop: 2,
  },
  textDanger: {
    color: ColorPalette.rose[600],
  },
  progressBarBg: {
    height: 8,
    backgroundColor: ColorPalette.slate[100],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
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
  realisasiText: {
    fontSize: 11,
    color: ColorPalette.slate[500],
  },
  overPaguAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ColorPalette.rose[50],
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ColorPalette.rose[200],
  },
  overPaguText: {
    fontSize: 11,
    color: ColorPalette.rose[900],
    flex: 1,
    lineHeight: 14,
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
  hintNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: ColorPalette.primary[50],
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ColorPalette.primary[200],
    marginBottom: 4,
  },
  hintNoticeText: {
    fontSize: 12,
    color: ColorPalette.primary[900],
    flex: 1,
    lineHeight: 16,
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
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
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
