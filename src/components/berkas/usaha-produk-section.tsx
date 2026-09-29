import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useTKMLStore } from '@/stores/tkml-store';
import { ColorPalette } from '@/constants/colors';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Building2, ShoppingBag, Plus, Save } from 'lucide-react-native';
import { formatRupiah } from '@/utils/formatters';

export const UsahaProdukSection: React.FC = () => {
  const { user, updateProfile, produkList, updateProduk } = useTKMLStore();

  const [namaUsaha, setNamaUsaha] = useState(user.namaUsaha);
  const [kbli, setKbli] = useState(user.kbli || '');
  const [sektorUsaha, setSektorUsaha] = useState(user.sektorUsaha || '');
  const [alamatKtp, setAlamatKtp] = useState(user.alamatKtp || '');
  const [alamatUsaha, setAlamatUsaha] = useState(user.alamatUsaha || '');
  const [bankName, setBankName] = useState(user.bankName || '');
  const [bankAccountNo, setBankAccountNo] = useState(user.bankAccountNo || '');
  const [bankKcp, setBankKcp] = useState(user.bankKcp || '');

  const handleSaveProfile = () => {
    updateProfile({
      namaUsaha,
      kbli,
      sektorUsaha,
      alamatKtp,
      alamatUsaha,
      bankName,
      bankAccountNo,
      bankKcp,
    });
  };

  return (
    <View style={styles.container}>
      {/* Profil Usaha Card */}
      <Card style={styles.cardSpacing}>
        <CardHeader>
          <View style={styles.sectionHeader}>
            <Building2 size={20} color={ColorPalette.primary[700]} />
            <Text style={styles.sectionTitle}>Profil Usaha & Rekening</Text>
          </View>
        </CardHeader>
        <CardContent>
          <Input
            label="Nama Usaha"
            value={namaUsaha}
            onChangeText={setNamaUsaha}
            placeholder="Contoh: UD. Kopi Barokah"
            required
          />
          <Input
            label="Klasifikasi Baku Lapangan Usaha (KBLI)"
            value={kbli}
            onChangeText={setKbli}
            placeholder="10761 - Industri Pengolahan Kopi"
            required
          />
          <Input
            label="Sektor Usaha"
            value={sektorUsaha}
            onChangeText={setSektorUsaha}
            placeholder="Kuliner & Pengolahan Pangan"
            required
          />
          <Input
            label="Alamat KTP Pemilik Usaha"
            value={alamatKtp}
            onChangeText={setAlamatKtp}
            multiline
            numberOfLines={2}
            placeholder="Alamat lengkap sesuai KTP"
            required
          />
          <Input
            label="Alamat Fisik Lokasi Usaha"
            value={alamatUsaha}
            onChangeText={setAlamatUsaha}
            multiline
            numberOfLines={2}
            placeholder="Alamat tempat operasional usaha"
            required
          />

          <View style={styles.bankHeaderRow}>
            <Text style={styles.subSectionTitle}>Data Rekening Bank Penyaluran</Text>
          </View>

          <Input
            label="Nama Bank"
            value={bankName}
            onChangeText={setBankName}
            placeholder="Bank Mandiri / BNI / BRI / BCA"
            required
          />
          <Input
            label="Nomor Rekening"
            value={bankAccountNo}
            onChangeText={setBankAccountNo}
            keyboardType="number-pad"
            placeholder="Nomor rekening tanpa spasi/tanda hubung"
            required
          />
          <Input
            label="Kantor Cabang Pembantu (KCP)"
            value={bankKcp}
            onChangeText={setBankKcp}
            placeholder="KCP Lembang Bandung Barat"
            required
          />

          <Button
            title="Simpan Perubahan Profil"
            variant="primary"
            icon={<Save size={16} color="#FFFFFF" />}
            onPress={handleSaveProfile}
            style={{ marginTop: 12 }}
          />
        </CardContent>
      </Card>

      {/* Katalog Produk Utama Card */}
      <Card style={styles.cardSpacing}>
        <CardHeader>
          <View style={styles.sectionHeader}>
            <ShoppingBag size={20} color={ColorPalette.teal[600]} />
            <Text style={styles.sectionTitle}>Katalog Produk Utama</Text>
          </View>
        </CardHeader>
        <CardContent>
          {produkList.map((produk) => (
            <View key={produk.id} style={styles.produkCard}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoRow}>
                {produk.fotoUris.map((uri, idx) => (
                  <Image key={idx} source={{ uri }} style={styles.productImage} />
                ))}
              </ScrollView>

              <View style={styles.productDetails}>
                <Text style={styles.productName}>{produk.namaProduk}</Text>
                <Text style={styles.productCategory}>{produk.kategori}</Text>
                <Text style={styles.productDesc}>{produk.deskripsiKeunggulan}</Text>

                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Harga Jual:</Text>
                  <Text style={styles.priceValue}>{formatRupiah(produk.hargaJual)}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Kapasitas Produksi:</Text>
                  <Text style={styles.capacityValue}>{produk.kapasitasProduksi}</Text>
                </View>
              </View>
            </View>
          ))}
        </CardContent>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  cardSpacing: {
    marginVertical: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ColorPalette.slate[900],
  },
  bankHeaderRow: {
    marginTop: 10,
    marginBottom: 2,
    borderTopWidth: 1,
    borderTopColor: ColorPalette.slate[200],
    paddingTop: 12,
  },
  subSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ColorPalette.slate[700],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  produkCard: {
    backgroundColor: ColorPalette.slate[50],
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: ColorPalette.slate[200],
    gap: 12,
  },
  photoRow: {
    flexDirection: 'row',
    gap: 8,
  },
  productImage: {
    width: 140,
    height: 100,
    borderRadius: 10,
    marginRight: 8,
  },
  productDetails: {
    gap: 4,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: ColorPalette.slate[900],
  },
  productCategory: {
    fontSize: 12,
    color: ColorPalette.teal[600],
    fontWeight: '600',
  },
  productDesc: {
    fontSize: 12,
    color: ColorPalette.slate[600],
    marginTop: 2,
    lineHeight: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  priceLabel: {
    fontSize: 12,
    color: ColorPalette.slate[500],
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorPalette.primary[700],
  },
  capacityValue: {
    fontSize: 12,
    fontWeight: '600',
    color: ColorPalette.slate[800],
  },
});
