import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTKMLStore } from '@/stores/tkml-store';
import { Karyawan } from '@/types/tkml';
import { KaryawanFormData } from '@/utils/validators';
import { ColorPalette } from '@/constants/colors';
import { KaryawanCard } from '@/components/karyawan/karyawan-card';
import { KaryawanFormModal } from '@/components/karyawan/karyawan-form-modal';
import { Users, UserPlus, Accessibility, CheckCircle2 } from 'lucide-react-native';

export const KaryawanTab: React.FC = () => {
  const { karyawanList, addKaryawan, updateKaryawan, deleteKaryawan } = useTKMLStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedKaryawan, setSelectedKaryawan] = useState<Karyawan | null>(null);

  const disabilitasCount = karyawanList.filter((k) => k.disabilitas !== 'tidak_ada').length;

  const handleOpenAdd = () => {
    setSelectedKaryawan(null);
    setModalVisible(true);
  };

  const handleOpenEdit = (karyawan: Karyawan) => {
    setSelectedKaryawan(karyawan);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Hapus Tenaga Kerja',
      'Apakah Anda yakin ingin menghapus data tenaga kerja ini dari daftar TKML?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Hapus',
          style: 'destructive',
          onPress: () => deleteKaryawan(id),
        },
      ]
    );
  };

  const handleFormSubmit = (data: KaryawanFormData) => {
    if (selectedKaryawan) {
      updateKaryawan(selectedKaryawan.id, data);
    } else {
      addKaryawan(data);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Manajemen Tenaga Kerja</Text>
          <Text style={styles.headerSubtitle}>
            Data karyawan yang diberdayakan dalam kegiatan usaha TKML.
          </Text>
        </View>

        {/* Counter Summary */}
        <View style={styles.summaryBar}>
          <View style={styles.summaryBox}>
            <Users size={16} color={ColorPalette.primary[700]} />
            <Text style={styles.summaryText}>
              Total: <Text style={styles.boldNum}>{karyawanList.length}</Text> Orang
            </Text>
          </View>
          <View style={[styles.summaryBox, { backgroundColor: ColorPalette.amber[50] }]}>
            <Accessibility size={16} color={ColorPalette.amber[700]} />
            <Text style={[styles.summaryText, { color: ColorPalette.amber[800] }]}>
              Disabilitas: <Text style={styles.boldNum}>{disabilitasCount}</Text> Orang
            </Text>
          </View>
        </View>
      </View>

      {/* List Karyawan */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {karyawanList.length === 0 ? (
          <View style={styles.emptyState}>
            <Users size={48} color={ColorPalette.slate[300]} />
            <Text style={styles.emptyTitle}>Belum Ada Data Karyawan</Text>
            <Text style={styles.emptyDesc}>
              Silakan tambahkan data tenaga kerja lokal atau penyandang disabilitas yang Anda pekerjakan.
            </Text>
          </View>
        ) : (
          karyawanList.map((karyawan) => (
            <KaryawanCard
              key={karyawan.id}
              karyawan={karyawan}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={handleOpenAdd}>
        <UserPlus size={22} color="#FFFFFF" />
        <Text style={styles.fabText}>Tambah Tenaga Kerja</Text>
      </TouchableOpacity>

      {/* Modal Form Karyawan */}
      <KaryawanFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmitData={handleFormSubmit}
        initialData={selectedKaryawan}
      />
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
    gap: 12,
  },
  headerTextWrap: {
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
  summaryBar: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ColorPalette.primary[50],
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  summaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: ColorPalette.primary[800],
  },
  boldNum: {
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    backgroundColor: ColorPalette.slate[50],
    minHeight: '100%',
    paddingBottom: 100, // Space for FAB
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
    backgroundColor: ColorPalette.primary[700],
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: ColorPalette.primary[900],
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
});
