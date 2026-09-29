import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { BizHubAd } from '@/types/tkml';
import { ColorPalette } from '@/constants/colors';
import { Badge } from '@/components/ui/badge';
import { formatRupiah } from '@/utils/formatters';
import {
  MapPin,
  MessageCircle,
  ShieldCheck,
  Building,
  Store,
  Tag,
} from 'lucide-react-native';

interface BizHubAdCardProps {
  ad: BizHubAd;
}

export const BizHubAdCard: React.FC<BizHubAdCardProps> = ({ ad }) => {
  const handleChatWhatsapp = () => {
    const text = encodeURIComponent(
      `Halo *${ad.namaPemilik}* (${ad.namaUsaha} - Peserta TKML),\nsaya tertarik dengan produk *${ad.judulProduk}* yang Anda iklankan di BizHub TKML Mobile.`
    );
    Linking.openURL(`https://wa.me/${ad.noWhatsapp}?text=${text}`);
  };

  const getCategoryLabel = () => {
    switch (ad.kategori) {
      case 'bahan_baku':
        return 'Bahan Baku';
      case 'kemasan':
        return 'Kemasan & Packaging';
      case 'jasa_maklon':
        return 'Jasa / Maklon';
      case 'mesin_alat':
        return 'Mesin & Peralatan';
      case 'produk_jadi':
      default:
        return 'Produk Jadi';
    }
  };

  return (
    <View style={styles.card}>
      {/* Product Image with Distance & Category Badge */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: ad.fotoProdukUri }} style={styles.productImage} />
        <View style={styles.imageOverlayTop}>
          <View style={styles.distanceBadge}>
            <MapPin size={11} color="#FFFFFF" />
            <Text style={styles.distanceText}>{ad.jarakKm} km di sekitar Anda</Text>
          </View>
          <Badge label={getCategoryLabel()} variant="primary" style={styles.catBadge} />
        </View>
      </View>

      {/* Product Info */}
      <View style={styles.content}>
        <View style={styles.sellerRow}>
          <View style={styles.sellerInfo}>
            <Text style={styles.businessName} numberOfLines={1}>
              {ad.namaUsaha}
            </Text>
            <Text style={styles.ownerName}>
              {ad.namaPemilik} • <Text style={styles.sectorHighlight}>{ad.sektorUsaha || 'TKML Mandiri'}</Text>
            </Text>
          </View>
          {ad.isVerifiedTKML && (
            <View style={styles.verifiedChip}>
              <ShieldCheck size={12} color={ColorPalette.emerald[700]} />
              <Text style={styles.verifiedText}>TKML Terverifikasi</Text>
            </View>
          )}
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {ad.judulProduk}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {ad.deskripsi}
        </Text>

        <View style={styles.priceRow}>
          <View>
            <Text style={styles.priceLabel}>Harga Penawaran:</Text>
            <View style={styles.priceValueRow}>
              <Text style={styles.priceValue}>{formatRupiah(ad.harga)}</Text>
              <Text style={styles.unitText}> / {ad.satuanHarga}</Text>
            </View>
          </View>

          {ad.b2bReady && (
            <View style={styles.b2bTag}>
              <Text style={styles.b2bText}>B2B Ready</Text>
            </View>
          )}
        </View>

        <View style={styles.locationRow}>
          <MapPin size={13} color={ColorPalette.slate[400]} />
          <Text style={styles.locationText} numberOfLines={1}>
            {ad.lokasiDaerah}
          </Text>
        </View>

        {/* WhatsApp Contact Action */}
        <TouchableOpacity
          style={styles.chatButton}
          activeOpacity={0.8}
          onPress={handleChatWhatsapp}>
          <MessageCircle size={17} color="#FFFFFF" />
          <Text style={styles.chatButtonText}>Hubungi via WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: ColorPalette.slate[200],
    shadowColor: ColorPalette.slate[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    marginVertical: 6,
  },
  imageWrapper: {
    width: '100%',
    height: 160,
    backgroundColor: ColorPalette.slate[100],
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlayTop: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  distanceText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  catBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  content: {
    padding: 14,
    gap: 8,
  },
  sellerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  sellerInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 13,
    fontWeight: '700',
    color: ColorPalette.slate[800],
  },
  ownerName: {
    fontSize: 11,
    color: ColorPalette.slate[400],
    marginTop: 1,
  },
  sectorHighlight: {
    color: ColorPalette.primary[700],
    fontWeight: '600',
  },
  verifiedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: ColorPalette.emerald[50],
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: ColorPalette.emerald[200],
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: ColorPalette.emerald[800],
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: ColorPalette.slate[900],
    lineHeight: 20,
  },
  description: {
    fontSize: 12,
    color: ColorPalette.slate[600],
    lineHeight: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: ColorPalette.slate[50],
    padding: 10,
    borderRadius: 10,
  },
  priceLabel: {
    fontSize: 10,
    color: ColorPalette.slate[400],
  },
  priceValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '800',
    color: ColorPalette.primary[700],
  },
  unitText: {
    fontSize: 11,
    color: ColorPalette.slate[500],
    fontWeight: '500',
  },
  b2bTag: {
    backgroundColor: ColorPalette.amber[100],
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  b2bText: {
    fontSize: 10,
    fontWeight: '700',
    color: ColorPalette.amber[800],
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 11,
    color: ColorPalette.slate[500],
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#25D366', // WhatsApp Green
    borderRadius: 12,
    paddingVertical: 11,
    marginTop: 4,
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  chatButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
