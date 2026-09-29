import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTKMLStore } from '@/stores/tkml-store';
import { KategoriBizHub, BizHubAd } from '@/types/tkml';
import { ColorPalette } from '@/constants/colors';
import { BizHubAdCard } from '@/components/bizhub/bizhub-ad-card';
import { PasangIklanModal } from '@/components/bizhub/pasang-iklan-modal';
import {
  Store,
  Plus,
  Search,
  SlidersHorizontal,
  MapPin,
  Sparkles,
  ShoppingBag,
} from 'lucide-react-native';

const KATEGORI_TABS: { label: string; value: KategoriBizHub }[] = [
  { label: 'Semua Kategori', value: 'semua' },
  { label: 'Bahan Baku', value: 'bahan_baku' },
  { label: 'Kemasan & Pack', value: 'kemasan' },
  { label: 'Mesin & Alat', value: 'mesin_alat' },
  { label: 'Jasa & Maklon', value: 'jasa_maklon' },
  { label: 'Produk Jadi', value: 'produk_jadi' },
];

const RADIUS_OPTIONS = [
  { label: 'Semua Radius', value: 999 },
  { label: '< 3 km', value: 3 },
  { label: '< 5 km', value: 5 },
  { label: '< 10 km', value: 10 },
];

export const BizHubTab: React.FC = () => {
  const { bizHubAds, addBizHubAd, user } = useTKMLStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<KategoriBizHub>('semua');
  const [selectedRadius, setSelectedRadius] = useState<number>(999);
  const [modalVisible, setModalVisible] = useState(false);

  const filteredAds = useMemo(() => {
    return bizHubAds.filter((ad) => {
      // Filter Kategori
      if (selectedCategory !== 'semua' && ad.kategori !== selectedCategory) {
        return false;
      }
      // Filter Radius Jarak
      if (selectedRadius < 999 && ad.jarakKm > selectedRadius) {
        return false;
      }
      // Filter Search Query
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchTitle = ad.judulProduk.toLowerCase().includes(q);
        const matchBiz = ad.namaUsaha.toLowerCase().includes(q);
        const matchDesc = ad.deskripsi.toLowerCase().includes(q);
        const matchLoc = ad.lokasiDaerah.toLowerCase().includes(q);
        if (!matchTitle && !matchBiz && !matchDesc && !matchLoc) {
          return false;
        }
      }
      return true;
    });
  }, [bizHubAds, selectedCategory, selectedRadius, searchQuery]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View style={styles.titleWrap}>
            <View style={styles.logoRow}>
              <Store size={22} color={ColorPalette.primary[700]} />
              <Text style={styles.headerTitle}>Bisnis Hub (BizHub)</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Direktori produk & rantai pasok sesama pelaku usaha TKML sekitar.
            </Text>
          </View>
        </View>

        {/* Current Location Badge */}
        <View style={styles.locationBadge}>
          <MapPin size={13} color={ColorPalette.primary[700]} />
          <Text style={styles.locationBadgeText}>
            Lokasi Anda: <Text style={{ fontWeight: '700' }}>{user.daerah || 'Kab. Bandung Barat'}</Text>
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBarWrapper}>
          <Search size={16} color={ColorPalette.slate[400]} />
          <TextInput
            placeholder="Cari pasokan kopi, botol kemasan, mesin, dsb..."
            placeholderTextColor={ColorPalette.slate[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>

        {/* Radius Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.radiusRow}>
          <Text style={styles.filterLabel}>Radius:</Text>
          {RADIUS_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.radiusPill,
                selectedRadius === opt.value && styles.radiusPillActive,
              ]}
              onPress={() => setSelectedRadius(opt.value)}>
              <Text
                style={[
                  styles.radiusPillText,
                  selectedRadius === opt.value && styles.radiusPillTextActive,
                ]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Category Horizontal Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}>
          {KATEGORI_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.value}
              style={[
                styles.categoryTab,
                selectedCategory === tab.value && styles.categoryTabActive,
              ]}
              onPress={() => setSelectedCategory(tab.value)}>
              <Text
                style={[
                  styles.categoryTabText,
                  selectedCategory === tab.value && styles.categoryTabTextActive,
                ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Ads Feed List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {filteredAds.length === 0 ? (
          <View style={styles.emptyState}>
            <ShoppingBag size={48} color={ColorPalette.slate[300]} />
            <Text style={styles.emptyTitle}>Tidak Ada Produk Ditemukan</Text>
            <Text style={styles.emptyDesc}>
              Coba sesuaikan kata kunci pencarian, kategori, atau perbesar radius jarak sekitar.
            </Text>
          </View>
        ) : (
          filteredAds.map((ad) => <BizHubAdCard key={ad.id} ad={ad} />)
        )}
      </ScrollView>

      {/* FAB Pasang Iklan */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => setModalVisible(true)}>
        <Plus size={22} color="#FFFFFF" strokeWidth={3} />
        <Text style={styles.fabText}>Pasang Iklan Produk</Text>
      </TouchableOpacity>

      {/* Modal Form Pasang Iklan */}
      <PasangIklanModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmitAd={addBizHubAd}
        userNamaUsaha={user.namaUsaha}
        userNamaPemilik={user.namaLengkap}
        userIdTKML={user.idTKML}
        userDaerah={user.daerah}
        userNoHp={user.noHp}
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
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: ColorPalette.slate[200],
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleWrap: {
    gap: 2,
    flex: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: ColorPalette.slate[900],
  },
  headerSubtitle: {
    fontSize: 12,
    color: ColorPalette.slate[500],
    lineHeight: 16,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ColorPalette.primary[50],
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  locationBadgeText: {
    fontSize: 11,
    color: ColorPalette.primary[900],
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorPalette.slate[100],
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: ColorPalette.slate[900],
  },
  radiusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 2,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: ColorPalette.slate[500],
    marginRight: 4,
  },
  radiusPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: ColorPalette.slate[100],
  },
  radiusPillActive: {
    backgroundColor: ColorPalette.primary[700],
  },
  radiusPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: ColorPalette.slate[600],
  },
  radiusPillTextActive: {
    color: '#FFFFFF',
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 4,
  },
  categoryTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ColorPalette.slate[200],
    backgroundColor: '#FFFFFF',
  },
  categoryTabActive: {
    borderColor: ColorPalette.primary[700],
    backgroundColor: ColorPalette.primary[50],
  },
  categoryTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: ColorPalette.slate[600],
  },
  categoryTabTextActive: {
    color: ColorPalette.primary[800],
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    backgroundColor: ColorPalette.slate[50],
    minHeight: '100%',
    paddingBottom: 100,
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
