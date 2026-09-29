import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useTKMLStore } from '@/stores/tkml-store';
import { ColorPalette } from '@/constants/colors';
import { ProdukUsaha } from '@/types/tkml';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRupiah } from '@/utils/formatters';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  Sparkles,
} from 'lucide-react-native';

const KATEGORI_PRODUK_OPTIONS = [
  'Makanan & Minuman Olahan',
  'Kopi & Minuman Herbal',
  'Kerajinan Tangan & Kriya',
  'Fashion & Tekstil',
  'Pertanian & Peternakan',
  'Jasa & Percetakan',
  'Lainnya',
];

export const ProdukScreen: React.FC = () => {
  const { produkList, addProduk, updateProduk, showToast } = useTKMLStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [namaProduk, setNamaProduk] = useState('');
  const [kategori, setKategori] = useState(KATEGORI_PRODUK_OPTIONS[0]);
  const [deskripsiKeunggulan, setDeskripsiKeunggulan] = useState('');
  const [hargaJual, setHargaJual] = useState('');
  const [kapasitasProduksi, setKapasitasProduksi] = useState('');
  const [fotoUris, setFotoUris] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpenAdd = () => {
    setEditingId(null);
    setNamaProduk('');
    setKategori(KATEGORI_PRODUK_OPTIONS[0]);
    setDeskripsiKeunggulan('');
    setHargaJual('');
    setKapasitasProduksi('');
    setFotoUris([]);
    setErrors({});
    setModalVisible(true);
  };

  const handleOpenEdit = (item: ProdukUsaha) => {
    setEditingId(item.id);
    setNamaProduk(item.namaProduk);
    setKategori(item.kategori);
    setDeskripsiKeunggulan(item.deskripsiKeunggulan);
    setHargaJual(item.hargaJual.toString());
    setKapasitasProduksi(item.kapasitasProduksi);
    setFotoUris(item.fotoUris || []);
    setErrors({});
    setModalVisible(true);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 4,
      quality: 0.6,
    });

    if (!result.canceled && result.assets) {
      const newUris = result.assets.map((asset) => asset.uri);
      setFotoUris((prev) => [...prev, ...newUris].slice(0, 5));
    }
  };

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert('Izin kamera diperlukan untuk mengambil foto produk');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.6,
    });

    if (!result.canceled && result.assets[0]) {
      setFotoUris((prev) => [...prev, result.assets[0].uri].slice(0, 5));
    }
  };

  const handleRemovePhoto = (index: number) => {
    setFotoUris((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!namaProduk.trim()) errs.namaProduk = 'Nama produk wajib diisi';
    if (!hargaJual || isNaN(Number(hargaJual)) || Number(hargaJual) <= 0) {
      errs.hargaJual = 'Harga jual harus berupa angka valid di atas 0';
    }
    if (!kapasitasProduksi.trim()) {
      errs.kapasitasProduksi = 'Kapasitas produksi bulanan/harian wajib diisi';
    }
    if (!deskripsiKeunggulan.trim()) {
      errs.deskripsiKeunggulan = 'Deskripsi keunggulan produk wajib diisi';
    }
    if (fotoUris.length === 0) {
      errs.fotoUris = 'Wajib menambahkan minimal 1 foto produk';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveModal = () => {
    if (!validate()) return;

    if (editingId) {
      updateProduk(editingId, {
        namaProduk,
        kategori,
        deskripsiKeunggulan,
        hargaJual: Number(hargaJual),
        kapasitasProduksi,
        fotoUris,
      });
      showToast('Data produk berhasil diperbarui.', 'success');
    } else {
      addProduk({
        namaProduk,
        kategori,
        deskripsiKeunggulan,
        hargaJual: Number(hargaJual),
        kapasitasProduksi,
        fotoUris,
        isPrimary: produkList.length === 0,
      });
      showToast('Produk baru berhasil ditambahkan.', 'success');
    }
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Title */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.headerTitle}>Katalog Produk Usaha</Text>
            <Badge label={`${produkList.length} Produk`} variant="primary" />
          </View>
          <Text style={styles.headerSubtitle}>
            Kelola foto, harga, dan spesifikasi produk unggulan yang didukung modal program TKML Kemnaker.
          </Text>
        </View>

        {/* Action Button: Tambah Produk */}
        <TouchableOpacity
          style={styles.addBtn}
          activeOpacity={0.8}
          onPress={handleOpenAdd}>
          <Plus size={18} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Tambah Produk Baru</Text>
        </TouchableOpacity>

        {/* List Produk Cards */}
        {produkList.length === 0 ? (
          <View style={styles.emptyState}>
            <Package size={48} color={ColorPalette.slate[300]} />
            <Text style={styles.emptyTitle}>Belum Ada Produk Ditambahkan</Text>
            <Text style={styles.emptySubtitle}>
              Tambahkan produk unggulan usaha Anda agar dapat diverifikasi oleh Kemnaker dan dipromosikan di BizHub.
            </Text>
          </View>
        ) : (
          <View style={styles.productsList}>
            {produkList.map((item) => (
              <Card key={item.id} style={styles.productCard}>
                <View style={styles.productCardInner}>
                  {/* Foto Produk Thumbnail */}
                  <Image
                    source={{
                      uri:
                        item.fotoUris && item.fotoUris[0]
                          ? item.fotoUris[0]
                          : 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop&q=60',
                    }}
                    style={styles.productThumb}
                    resizeMode="cover"
                  />

                  {/* Informasi Produk */}
                  <View style={styles.productInfo}>
                    <View style={styles.badgeRow}>
                      <Badge label={item.kategori} variant="primary" />
                      {item.isPrimary && <Badge label="Utama" variant="success" />}
                    </View>

                    <Text style={styles.productName}>{item.namaProduk}</Text>
                    <Text style={styles.productPrice}>{formatRupiah(item.hargaJual)}</Text>
                    <Text style={styles.productCapacity} numberOfLines={1}>
                      Kapasitas: {item.kapasitasProduksi}
                    </Text>

                    <Text style={styles.productDesc} numberOfLines={2}>
                      {item.deskripsiKeunggulan}
                    </Text>

                    {/* Action Edit */}
                    <View style={styles.cardActionRow}>
                      <TouchableOpacity
                        style={styles.actionBtnEdit}
                        onPress={() => handleOpenEdit(item)}>
                        <Edit2 size={14} color={ColorPalette.primary[700]} />
                        <Text style={styles.actionBtnEditText}>Edit Produk</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Modal Form Tambah / Edit Produk */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeaderBar}>
              <Text style={styles.modalHeaderTitle}>
                {editingId ? 'Edit Produk Usaha' : 'Tambah Produk Baru'}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseBtn}>
                <X size={20} color={ColorPalette.slate[600]} />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.modalFormScroll}
              showsVerticalScrollIndicator={false}>
              {/* Nama & Kategori */}
              <Input
                label="Nama Produk / Barang"
                value={namaProduk}
                onChangeText={setNamaProduk}
                placeholder="Contoh: Kopi Robusta Puntang 250gr"
                error={errors.namaProduk}
                required
              />

              {/* Kategori Selector */}
              <Text style={styles.inputLabel}>Kategori Produk *</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}>
                {KATEGORI_PRODUK_OPTIONS.map((cat) => {
                  const isSelected = kategori === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.catPill,
                        isSelected && styles.catPillActive,
                      ]}
                      onPress={() => setKategori(cat)}>
                      <Text
                        style={[
                          styles.catPillText,
                          isSelected && styles.catPillTextActive,
                        ]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Harga & Kapasitas */}
              <Input
                label="Harga Jual Satuan (Rp)"
                value={hargaJual}
                onChangeText={setHargaJual}
                keyboardType="number-pad"
                placeholder="Contoh: 45000"
                error={errors.hargaJual}
                required
              />

              <Input
                label="Kapasitas Produksi"
                value={kapasitasProduksi}
                onChangeText={setKapasitasProduksi}
                placeholder="Contoh: 150 kg/bulan atau 50 pcs/hari"
                error={errors.kapasitasProduksi}
                hint="Menunjukkan kesiapan suplai bila ada pesanan B2B/konsumen."
                required
              />

              <Input
                label="Deskripsi & Keunggulan Produk"
                value={deskripsiKeunggulan}
                onChangeText={setDeskripsiKeunggulan}
                multiline
                numberOfLines={3}
                placeholder="Jelaskan kualitas, bahan baku, sertifikasi (Halal/PIRT), atau keunikan rasa/desain..."
                error={errors.deskripsiKeunggulan}
                required
              />

              {/* Upload Foto-foto Produk */}
              <Text style={styles.inputLabel}>Foto Galeri Produk (Maks 5 Foto) *</Text>
              <View style={styles.photoUploadRow}>
                <TouchableOpacity
                  style={styles.addPhotoBox}
                  onPress={handlePickImage}>
                  <ImageIcon size={20} color={ColorPalette.primary[600]} />
                  <Text style={styles.addPhotoText}>Galeri</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.addPhotoBox}
                  onPress={handleTakePhoto}>
                  <Camera size={20} color={ColorPalette.primary[600]} />
                  <Text style={styles.addPhotoText}>Kamera</Text>
                </TouchableOpacity>

                {fotoUris.map((uri, idx) => (
                  <View key={idx} style={styles.thumbWrap}>
                    <Image source={{ uri }} style={styles.thumbImage} />
                    <TouchableOpacity
                      style={styles.removeThumbBtn}
                      onPress={() => handleRemovePhoto(idx)}>
                      <X size={12} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              {errors.fotoUris ? (
                <Text style={styles.errorText}>{errors.fotoUris}</Text>
              ) : null}

              {/* Action Buttons */}
              <View style={styles.modalActionButtons}>
                <Button
                  title={editingId ? 'Simpan Perubahan' : 'Tambahkan ke Katalog'}
                  onPress={handleSaveModal}
                  variant="primary"
                />
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ColorPalette.background.main,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: ColorPalette.slate[900],
  },
  headerSubtitle: {
    fontSize: 13,
    color: ColorPalette.slate[600],
    lineHeight: 18,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ColorPalette.primary[700],
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 16,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: ColorPalette.slate[200],
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ColorPalette.slate[800],
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: ColorPalette.slate[500],
    textAlign: 'center',
    lineHeight: 18,
  },
  productsList: {
    gap: 12,
  },
  productCard: {
    marginBottom: 4,
  },
  productCardInner: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  productThumb: {
    width: 95,
    height: 110,
    borderRadius: 8,
    backgroundColor: ColorPalette.slate[100],
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: ColorPalette.slate[900],
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorPalette.teal[700],
    marginBottom: 2,
  },
  productCapacity: {
    fontSize: 11,
    color: ColorPalette.slate[500],
    marginBottom: 4,
  },
  productDesc: {
    fontSize: 12,
    color: ColorPalette.slate[600],
    lineHeight: 16,
  },
  cardActionRow: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'flex-end',
  },
  actionBtnEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: ColorPalette.primary[50],
    borderRadius: 6,
  },
  actionBtnEditText: {
    fontSize: 11,
    fontWeight: '600',
    color: ColorPalette.primary[700],
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
  },
  modalHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: ColorPalette.slate[200],
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ColorPalette.slate[900],
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalFormScroll: {
    padding: 16,
    paddingBottom: 32,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: ColorPalette.slate[700],
    marginBottom: 6,
  },
  categoryScroll: {
    gap: 8,
    paddingBottom: 14,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: ColorPalette.slate[100],
    borderWidth: 1,
    borderColor: ColorPalette.slate[200],
  },
  catPillActive: {
    backgroundColor: ColorPalette.primary[700],
    borderColor: ColorPalette.primary[800],
  },
  catPillText: {
    fontSize: 12,
    fontWeight: '500',
    color: ColorPalette.slate[700],
  },
  catPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  photoUploadRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  addPhotoBox: {
    width: 65,
    height: 65,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: ColorPalette.primary[200],
    borderStyle: 'dashed',
    backgroundColor: ColorPalette.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addPhotoText: {
    fontSize: 10,
    fontWeight: '600',
    color: ColorPalette.primary[700],
  },
  thumbWrap: {
    position: 'relative',
    width: 65,
    height: 65,
  },
  thumbImage: {
    width: 65,
    height: 65,
    borderRadius: 8,
  },
  removeThumbBtn: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: ColorPalette.rose[600],
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: ColorPalette.rose[600],
    fontSize: 12,
    marginBottom: 10,
  },
  modalActionButtons: {
    marginTop: 16,
  },
});
