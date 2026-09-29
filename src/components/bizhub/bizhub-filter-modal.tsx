import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { KategoriBizHub, BizHubFilterState } from '@/types/tkml';
import { ColorPalette } from '@/constants/colors';
import { Button } from '@/components/ui/button';
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  Check,
  Building,
  Layers,
  MapPin,
  ArrowDownUp,
} from 'lucide-react-native';

interface BizHubFilterModalProps {
  visible: boolean;
  onClose: () => void;
  filterState: BizHubFilterState;
  onApplyFilter: (newFilter: BizHubFilterState) => void;
  onResetFilter: () => void;
}

const SEKTOR_OPTIONS = [
  'Semua Sektor',
  'Kuliner & Pengolahan Pangan',
  'Pertanian & Agribisnis',
  'Kemasan & Percetakan',
  'Fashion & Tekstil',
  'Kriya & Kerajinan',
  'Jasa & Manufaktur',
];

const KATEGORI_OPTIONS: { label: string; value: KategoriBizHub }[] = [
  { label: 'Semua Kategori', value: 'semua' },
  { label: 'Bahan Baku', value: 'bahan_baku' },
  { label: 'Kemasan & Pack', value: 'kemasan' },
  { label: 'Mesin & Alat', value: 'mesin_alat' },
  { label: 'Jasa & Maklon', value: 'jasa_maklon' },
  { label: 'Produk Jadi', value: 'produk_jadi' },
];

const RADIUS_OPTIONS = [
  { label: 'Semua Jarak', value: 999 },
  { label: '< 3 km (Sangat Dekat)', value: 3 },
  { label: '< 5 km', value: 5 },
  { label: '< 10 km', value: 10 },
  { label: '< 25 km', value: 25 },
];

const SORT_OPTIONS: { label: string; value: BizHubFilterState['sortBy'] }[] = [
  { label: 'Paling Baru Ditambahkan', value: 'terbaru' },
  { label: 'Jarak Paling Dekat', value: 'terdekat' },
  { label: 'Omzet / Skala Tertinggi', value: 'omzet_tertinggi' },
];

export const BizHubFilterModal: React.FC<BizHubFilterModalProps> = ({
  visible,
  onClose,
  filterState,
  onApplyFilter,
  onResetFilter,
}) => {
  const [selectedSektor, setSelectedSektor] = useState(filterState.sektorUsaha);
  const [selectedCategory, setSelectedCategory] = useState<KategoriBizHub>(
    filterState.kategori
  );
  const [selectedRadius, setSelectedRadius] = useState<number>(filterState.radiusKm);
  const [selectedSort, setSelectedSort] = useState<BizHubFilterState['sortBy']>(
    filterState.sortBy
  );

  useEffect(() => {
    if (visible) {
      setSelectedSektor(filterState.sektorUsaha);
      setSelectedCategory(filterState.kategori);
      setSelectedRadius(filterState.radiusKm);
      setSelectedSort(filterState.sortBy);
    }
  }, [visible, filterState]);

  const handleApply = () => {
    onApplyFilter({
      sektorUsaha: selectedSektor,
      kategori: selectedCategory,
      radiusKm: selectedRadius,
      sortBy: selectedSort,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedSektor('semua');
    setSelectedCategory('semua');
    setSelectedRadius(999);
    setSelectedSort('terbaru');
    onResetFilter();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                  <SlidersHorizontal size={20} color={ColorPalette.primary[700]} />
                  <Text style={styles.title}>Filter & Urutan BizHub</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <X size={18} color={ColorPalette.slate[500]} />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}>
                {/* 1. Sektor Usaha */}
                <View style={styles.section}>
                  <View style={styles.sectionTitleRow}>
                    <Building size={15} color={ColorPalette.slate[700]} />
                    <Text style={styles.sectionTitle}>Sektor Bidang Usaha</Text>
                  </View>
                  <View style={styles.chipsWrap}>
                    {SEKTOR_OPTIONS.map((sektor) => {
                      const isSelected =
                        (sektor === 'Semua Sektor' &&
                          (selectedSektor === 'semua' || selectedSektor === 'Semua Sektor')) ||
                        selectedSektor === sektor;
                      return (
                        <TouchableOpacity
                          key={sektor}
                          style={[styles.chip, isSelected && styles.chipActive]}
                          onPress={() =>
                            setSelectedSektor(sektor === 'Semua Sektor' ? 'semua' : sektor)
                          }>
                          {isSelected && (
                            <Check size={13} color={ColorPalette.primary[700]} />
                          )}
                          <Text
                            style={[
                              styles.chipText,
                              isSelected && styles.chipTextActive,
                            ]}>
                            {sektor}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 2. Kategori Produk */}
                <View style={styles.section}>
                  <View style={styles.sectionTitleRow}>
                    <Layers size={15} color={ColorPalette.slate[700]} />
                    <Text style={styles.sectionTitle}>Kategori Pasokan / Produk</Text>
                  </View>
                  <View style={styles.chipsWrap}>
                    {KATEGORI_OPTIONS.map((cat) => {
                      const isSelected = selectedCategory === cat.value;
                      return (
                        <TouchableOpacity
                          key={cat.value}
                          style={[styles.chip, isSelected && styles.chipActive]}
                          onPress={() => setSelectedCategory(cat.value)}>
                          {isSelected && (
                            <Check size={13} color={ColorPalette.primary[700]} />
                          )}
                          <Text
                            style={[
                              styles.chipText,
                              isSelected && styles.chipTextActive,
                            ]}>
                            {cat.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 3. Radius Jarak Sekitar */}
                <View style={styles.section}>
                  <View style={styles.sectionTitleRow}>
                    <MapPin size={15} color={ColorPalette.slate[700]} />
                    <Text style={styles.sectionTitle}>Radius Jarak Lokasi</Text>
                  </View>
                  <View style={styles.chipsWrap}>
                    {RADIUS_OPTIONS.map((rad) => {
                      const isSelected = selectedRadius === rad.value;
                      return (
                        <TouchableOpacity
                          key={rad.value}
                          style={[styles.chip, isSelected && styles.chipActive]}
                          onPress={() => setSelectedRadius(rad.value)}>
                          {isSelected && (
                            <Check size={13} color={ColorPalette.primary[700]} />
                          )}
                          <Text
                            style={[
                              styles.chipText,
                              isSelected && styles.chipTextActive,
                            ]}>
                            {rad.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 4. Urutkan Berdasarkan */}
                <View style={styles.section}>
                  <View style={styles.sectionTitleRow}>
                    <ArrowDownUp size={15} color={ColorPalette.slate[700]} />
                    <Text style={styles.sectionTitle}>Urutkan Feed Berdasarkan</Text>
                  </View>
                  <View style={styles.chipsWrap}>
                    {SORT_OPTIONS.map((sort) => {
                      const isSelected = selectedSort === sort.value;
                      return (
                        <TouchableOpacity
                          key={sort.value}
                          style={[styles.chip, isSelected && styles.chipActive]}
                          onPress={() => setSelectedSort(sort.value)}>
                          {isSelected && (
                            <Check size={13} color={ColorPalette.primary[700]} />
                          )}
                          <Text
                            style={[
                              styles.chipText,
                              isSelected && styles.chipTextActive,
                            ]}>
                            {sort.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </ScrollView>

              {/* Bottom Actions */}
              <View style={styles.footer}>
                <Button
                  title="Reset Filter"
                  variant="outline"
                  size="md"
                  icon={<RotateCcw size={16} color={ColorPalette.slate[700]} />}
                  onPress={handleReset}
                  style={styles.footerButtonReset}
                />
                <Button
                  title="Terapkan Filter"
                  variant="primary"
                  size="md"
                  icon={<Check size={16} color="#FFFFFF" />}
                  onPress={handleApply}
                  style={styles.footerButtonApply}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: ColorPalette.slate[200],
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: ColorPalette.slate[900],
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: ColorPalette.slate[100],
  },
  content: {
    paddingVertical: 14,
    gap: 16,
  },
  section: {
    gap: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ColorPalette.slate[800],
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ColorPalette.slate[200],
    backgroundColor: ColorPalette.slate[50],
  },
  chipActive: {
    borderColor: ColorPalette.primary[600],
    backgroundColor: ColorPalette.primary[50],
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: ColorPalette.slate[600],
  },
  chipTextActive: {
    color: ColorPalette.primary[800],
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: ColorPalette.slate[200],
  },
  footerButtonReset: {
    flex: 1,
  },
  footerButtonApply: {
    flex: 2,
  },
});
