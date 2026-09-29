import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTKMLStore } from '@/stores/tkml-store';
import { BizHubAd, BizHubMilestone, BizHubFilterState } from '@/types/tkml';
import { ColorPalette } from '@/constants/colors';
import { BizHubAdCard } from '@/components/bizhub/bizhub-ad-card';
import { BizHubMilestoneCard } from '@/components/bizhub/bizhub-milestone-card';
import { BizHubFilterModal } from '@/components/bizhub/bizhub-filter-modal';
import { PasangIklanModal } from '@/components/bizhub/pasang-iklan-modal';
import { BagikanKabarModal } from '@/components/bizhub/bagikan-kabar-modal';
import {
  Store,
  Plus,
  Search,
  SlidersHorizontal,
  MapPin,
  Sparkles,
  ShoppingBag,
  TrendingUp,
  Award,
  Layers,
  X,
  PlusCircle,
  Share2,
} from 'lucide-react-native';

type FeedTabType = 'semua' | 'produk' | 'kabar_usaha';

type CombinedFeedItem =
  | { type: 'ad'; data: BizHubAd; sortDate: string }
  | { type: 'milestone'; data: BizHubMilestone; sortDate: string };

export const BizHubTab: React.FC = () => {
  const {
    bizHubAds,
    bizHubMilestones,
    addBizHubAd,
    addBizHubMilestone,
    likeBizHubMilestone,
    user,
  } = useTKMLStore();

  const [activeTab, setActiveTab] = useState<FeedTabType>('semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter State
  const [filterState, setFilterState] = useState<BizHubFilterState>({
    sektorUsaha: 'semua',
    kategori: 'semua',
    radiusKm: 999,
    sortBy: 'terbaru',
  });

  // Modals
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [adModalVisible, setAdModalVisible] = useState(false);
  const [kabarModalVisible, setKabarModalVisible] = useState(false);
  const [actionMenuVisible, setActionMenuVisible] = useState(false);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterState.sektorUsaha !== 'semua') count++;
    if (filterState.kategori !== 'semua') count++;
    if (filterState.radiusKm < 999) count++;
    if (filterState.sortBy !== 'terbaru') count++;
    return count;
  }, [filterState]);

  // Filtered Ads
  const filteredAds = useMemo(() => {
    return bizHubAds.filter((ad) => {
      // Sektor Usaha
      if (
        filterState.sektorUsaha !== 'semua' &&
        ad.sektorUsaha &&
        ad.sektorUsaha.toLowerCase() !== filterState.sektorUsaha.toLowerCase()
      ) {
        return false;
      }
      // Kategori Produk
      if (filterState.kategori !== 'semua' && ad.kategori !== filterState.kategori) {
        return false;
      }
      // Radius Jarak
      if (filterState.radiusKm < 999 && ad.jarakKm > filterState.radiusKm) {
        return false;
      }
      // Search query (produk, usaha, sektor, deskripsi, lokasi)
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchTitle = ad.judulProduk.toLowerCase().includes(q);
        const matchBiz = ad.namaUsaha.toLowerCase().includes(q);
        const matchDesc = ad.deskripsi.toLowerCase().includes(q);
        const matchLoc = ad.lokasiDaerah.toLowerCase().includes(q);
        const matchSector = ad.sektorUsaha ? ad.sektorUsaha.toLowerCase().includes(q) : false;
        if (!matchTitle && !matchBiz && !matchDesc && !matchLoc && !matchSector) {
          return false;
        }
      }
      return true;
    });
  }, [bizHubAds, filterState, searchQuery]);

  // Filtered Milestones
  const filteredMilestones = useMemo(() => {
    return bizHubMilestones.filter((ms) => {
      // Sektor Usaha
      if (
        filterState.sektorUsaha !== 'semua' &&
        ms.sektorUsaha &&
        ms.sektorUsaha.toLowerCase() !== filterState.sektorUsaha.toLowerCase()
      ) {
        return false;
      }
      // Radius Jarak
      if (filterState.radiusKm < 999 && ms.jarakKm > filterState.radiusKm) {
        return false;
      }
      // Search query (judul, usaha, sektor, deskripsi, lokasi)
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchTitle = ms.judul.toLowerCase().includes(q);
        const matchBiz = ms.namaUsaha.toLowerCase().includes(q);
        const matchDesc = ms.deskripsi.toLowerCase().includes(q);
        const matchLoc = ms.lokasiDaerah.toLowerCase().includes(q);
        const matchSector = ms.sektorUsaha ? ms.sektorUsaha.toLowerCase().includes(q) : false;
        if (!matchTitle && !matchBiz && !matchDesc && !matchLoc && !matchSector) {
          return false;
        }
      }
      return true;
    });
  }, [bizHubMilestones, filterState, searchQuery]);

  // Unified Feed List
  const unifiedFeed = useMemo(() => {
    let items: CombinedFeedItem[] = [];

    if (activeTab === 'semua' || activeTab === 'produk') {
      items = items.concat(
        filteredAds.map((ad) => ({ type: 'ad', data: ad, sortDate: ad.createdAt }))
      );
    }

    if (activeTab === 'semua' || activeTab === 'kabar_usaha') {
      items = items.concat(
        filteredMilestones.map((ms) => ({
          type: 'milestone',
          data: ms,
          sortDate: ms.createdAt,
        }))
      );
    }

    // Sort items
    items.sort((a, b) => {
      if (filterState.sortBy === 'terdekat') {
        const distA = a.data.jarakKm || 0;
        const distB = b.data.jarakKm || 0;
        return distA - distB;
      }
      if (filterState.sortBy === 'omzet_tertinggi') {
        const omzetA = a.type === 'milestone' ? a.data.omzetBulanIni || 0 : a.data.harga || 0;
        const omzetB = b.type === 'milestone' ? b.data.omzetBulanIni || 0 : b.data.harga || 0;
        return omzetB - omzetA;
      }
      // Default: terbaru
      return new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime();
    });

    return items;
  }, [activeTab, filteredAds, filteredMilestones, filterState.sortBy]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View style={styles.titleWrap}>
            <View style={styles.logoRow}>
              <Store size={22} color={ColorPalette.primary[700]} />
              <Text style={styles.headerTitle}>Bisnis Hub (BizHub)</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Direktori produk, rantai pasok B2B & kabar capaian usaha TKML.
            </Text>
          </View>
        </View>

        {/* Location Badge */}
        <View style={styles.locationBadge}>
          <MapPin size={13} color={ColorPalette.primary[700]} />
          <Text style={styles.locationBadgeText}>
            Lokasi Sekitar: <Text style={{ fontWeight: '700' }}>{user.daerah || 'Kab. Bandung Barat'}</Text>
          </Text>
        </View>

        {/* Search Bar + Filter Button Row */}
        <View style={styles.searchRow}>
          <View style={styles.searchBarWrapper}>
            <Search size={16} color={ColorPalette.slate[400]} />
            <TextInput
              placeholder="Cari produk, usaha, sektor (kuliner, kriya)..."
              placeholderTextColor={ColorPalette.slate[400]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={16} color={ColorPalette.slate[400]} />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Trigger Button */}
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilterCount > 0 && styles.filterButtonActive,
            ]}
            onPress={() => setFilterModalVisible(true)}>
            <SlidersHorizontal
              size={18}
              color={activeFilterCount > 0 ? '#FFFFFF' : ColorPalette.slate[700]}
            />
            {activeFilterCount > 0 && (
              <View style={styles.filterCountBadge}>
                <Text style={styles.filterCountBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Active Filter Chips Bar (Quick Clear) */}
        {activeFilterCount > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.activeFiltersRow}>
            {filterState.sektorUsaha !== 'semua' && (
              <TouchableOpacity
                style={styles.activeFilterPill}
                onPress={() => setFilterState((prev) => ({ ...prev, sektorUsaha: 'semua' }))}>
                <Text style={styles.activeFilterPillText}>
                  Sektor: {filterState.sektorUsaha}
                </Text>
                <X size={12} color={ColorPalette.primary[800]} />
              </TouchableOpacity>
            )}
            {filterState.kategori !== 'semua' && (
              <TouchableOpacity
                style={styles.activeFilterPill}
                onPress={() => setFilterState((prev) => ({ ...prev, kategori: 'semua' }))}>
                <Text style={styles.activeFilterPillText}>
                  Kategori: {filterState.kategori}
                </Text>
                <X size={12} color={ColorPalette.primary[800]} />
              </TouchableOpacity>
            )}
            {filterState.radiusKm < 999 && (
              <TouchableOpacity
                style={styles.activeFilterPill}
                onPress={() => setFilterState((prev) => ({ ...prev, radiusKm: 999 }))}>
                <Text style={styles.activeFilterPillText}>
                  Radius: &lt; {filterState.radiusKm} km
                </Text>
                <X size={12} color={ColorPalette.primary[800]} />
              </TouchableOpacity>
            )}
            {filterState.sortBy !== 'terbaru' && (
              <TouchableOpacity
                style={styles.activeFilterPill}
                onPress={() => setFilterState((prev) => ({ ...prev, sortBy: 'terbaru' }))}>
                <Text style={styles.activeFilterPillText}>
                  Urut: {filterState.sortBy === 'terdekat' ? 'Terdekat' : 'Omzet Tertinggi'}
                </Text>
                <X size={12} color={ColorPalette.primary[800]} />
              </TouchableOpacity>
            )}
          </ScrollView>
        )}

        {/* Segmented Feed Tabs (Semua, Produk Terkini, Kabar Usaha) */}
        <View style={styles.segmentedTabsContainer}>
          <TouchableOpacity
            style={[
              styles.segmentedTab,
              activeTab === 'semua' && styles.segmentedTabActive,
            ]}
            onPress={() => setActiveTab('semua')}>
            <Sparkles
              size={14}
              color={activeTab === 'semua' ? ColorPalette.primary[800] : ColorPalette.slate[500]}
            />
            <Text
              style={[
                styles.segmentedTabText,
                activeTab === 'semua' && styles.segmentedTabTextActive,
              ]}>
              Semua
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentedTab,
              activeTab === 'produk' && styles.segmentedTabActive,
            ]}
            onPress={() => setActiveTab('produk')}>
            <ShoppingBag
              size={14}
              color={activeTab === 'produk' ? ColorPalette.primary[800] : ColorPalette.slate[500]}
            />
            <Text
              style={[
                styles.segmentedTabText,
                activeTab === 'produk' && styles.segmentedTabTextActive,
              ]}>
              Produk Terkini ({filteredAds.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentedTab,
              activeTab === 'kabar_usaha' && styles.segmentedTabActive,
            ]}
            onPress={() => setActiveTab('kabar_usaha')}>
            <TrendingUp
              size={14}
              color={
                activeTab === 'kabar_usaha'
                  ? ColorPalette.primary[800]
                  : ColorPalette.slate[500]
              }
            />
            <Text
              style={[
                styles.segmentedTabText,
                activeTab === 'kabar_usaha' && styles.segmentedTabTextActive,
              ]}>
              Kabar Usaha ({filteredMilestones.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Feed Content List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {unifiedFeed.length === 0 ? (
          <View style={styles.emptyState}>
            <ShoppingBag size={48} color={ColorPalette.slate[300]} />
            <Text style={styles.emptyTitle}>Tidak Ada Data Ditemukan</Text>
            <Text style={styles.emptyDesc}>
              {searchQuery || activeFilterCount > 0
                ? 'Tidak ada produk atau kabar usaha yang cocok dengan filter atau kata kunci Anda. Coba reset filter.'
                : 'Belum ada produk atau pembaruan usaha yang ditampilkan di feed ini.'}
            </Text>
            {activeFilterCount > 0 && (
              <TouchableOpacity
                style={styles.resetEmptyBtn}
                onPress={() => {
                  setSearchQuery('');
                  setFilterState({
                    sektorUsaha: 'semua',
                    kategori: 'semua',
                    radiusKm: 999,
                    sortBy: 'terbaru',
                  });
                }}>
                <Text style={styles.resetEmptyBtnText}>Reset Semua Filter</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          unifiedFeed.map((item) => {
            if (item.type === 'ad') {
              return <BizHubAdCard key={item.data.id} ad={item.data} />;
            }
            return (
              <BizHubMilestoneCard
                key={item.data.id}
                milestone={item.data}
                onLike={likeBizHubMilestone}
              />
            );
          })
        )}
      </ScrollView>

      {/* Floating Action Speed Dial / Modal Selector */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => setActionMenuVisible(true)}>
        <Plus size={24} color="#FFFFFF" strokeWidth={3} />
        <Text style={styles.fabText}>Posting ke BizHub</Text>
      </TouchableOpacity>

      {/* Action Selector Modal (Iklan Produk / Kabar Usaha) */}
      <Modal
        visible={actionMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setActionMenuVisible(false)}>
        <TouchableOpacity
          style={styles.actionMenuBackdrop}
          activeOpacity={1}
          onPress={() => setActionMenuVisible(false)}>
          <View style={styles.actionMenuCard}>
            <Text style={styles.actionMenuHeader}>Pilih Jenis Publikasi</Text>
            <TouchableOpacity
              style={styles.actionMenuItem}
              onPress={() => {
                setActionMenuVisible(false);
                setAdModalVisible(true);
              }}>
              <View style={[styles.actionIconBox, { backgroundColor: ColorPalette.primary[50] }]}>
                <PlusCircle size={22} color={ColorPalette.primary[700]} />
              </View>
              <View style={styles.actionMenuTextWrap}>
                <Text style={styles.actionMenuTitle}>Pasang Iklan Produk / Jasa</Text>
                <Text style={styles.actionMenuSubtitle}>
                  Tawarkan pasokan bahan baku, kemasan, atau produk retail/B2B.
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionMenuItem}
              onPress={() => {
                setActionMenuVisible(false);
                setKabarModalVisible(true);
              }}>
              <View style={[styles.actionIconBox, { backgroundColor: ColorPalette.emerald[50] }]}>
                <TrendingUp size={22} color={ColorPalette.emerald[700]} />
              </View>
              <View style={styles.actionMenuTextWrap}>
                <Text style={styles.actionMenuTitle}>Bagikan Kabar Capaian Usaha</Text>
                <Text style={styles.actionMenuSubtitle}>
                  Update omzet bulan ini, rekrutmen karyawan, atau ekspansi.
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Filter Bottom Sheet Modal */}
      <BizHubFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filterState={filterState}
        onApplyFilter={setFilterState}
        onResetFilter={() =>
          setFilterState({
            sektorUsaha: 'semua',
            kategori: 'semua',
            radiusKm: 999,
            sortBy: 'terbaru',
          })
        }
      />

      {/* Modal Pasang Iklan Produk */}
      <PasangIklanModal
        visible={adModalVisible}
        onClose={() => setAdModalVisible(false)}
        onSubmitAd={addBizHubAd}
        userNamaUsaha={user.namaUsaha}
        userNamaPemilik={user.namaLengkap}
        userIdTKML={user.idTKML}
        userSektorUsaha={user.sektorUsaha}
        userDaerah={user.daerah}
        userNoHp={user.noHp}
      />

      {/* Modal Bagikan Kabar Usaha */}
      <BagikanKabarModal
        visible={kabarModalVisible}
        onClose={() => setKabarModalVisible(false)}
        onSubmitMilestone={addBizHubMilestone}
        userNamaUsaha={user.namaUsaha}
        userNamaPemilik={user.namaLengkap}
        userIdTKML={user.idTKML}
        userSektorUsaha={user.sektorUsaha}
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
    paddingTop: 12,
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
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  locationBadgeText: {
    fontSize: 11,
    color: ColorPalette.primary[900],
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchBarWrapper: {
    flex: 1,
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
  filterButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: ColorPalette.slate[100],
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: ColorPalette.slate[200],
  },
  filterButtonActive: {
    backgroundColor: ColorPalette.primary[700],
    borderColor: ColorPalette.primary[800],
  },
  filterCountBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: ColorPalette.rose[600],
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  filterCountBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  activeFiltersRow: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
  },
  activeFilterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ColorPalette.primary[50],
    borderWidth: 1,
    borderColor: ColorPalette.primary[200],
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  activeFilterPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: ColorPalette.primary[800],
  },
  segmentedTabsContainer: {
    flexDirection: 'row',
    backgroundColor: ColorPalette.slate[100],
    borderRadius: 12,
    padding: 3,
    marginTop: 2,
  },
  segmentedTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 7,
    borderRadius: 9,
  },
  segmentedTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: ColorPalette.slate[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentedTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: ColorPalette.slate[600],
  },
  segmentedTabTextActive: {
    color: ColorPalette.primary[800],
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    backgroundColor: ColorPalette.slate[50],
    minHeight: '100%',
    paddingBottom: 110,
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
  resetEmptyBtn: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: ColorPalette.primary[700],
    borderRadius: 10,
  },
  resetEmptyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: ColorPalette.primary[700],
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 30,
    shadowColor: ColorPalette.primary[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionMenuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    padding: 16,
    paddingBottom: 36,
  },
  actionMenuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    gap: 12,
  },
  actionMenuHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: ColorPalette.slate[900],
    marginBottom: 4,
  },
  actionMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ColorPalette.slate[200],
    backgroundColor: ColorPalette.slate[50],
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionMenuTextWrap: {
    flex: 1,
  },
  actionMenuTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ColorPalette.slate[900],
  },
  actionMenuSubtitle: {
    fontSize: 11,
    color: ColorPalette.slate[500],
    marginTop: 2,
    lineHeight: 15,
  },
});
