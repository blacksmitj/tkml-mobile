import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { BizHubMilestone } from '@/types/tkml';
import { ColorPalette } from '@/constants/colors';
import { formatRupiah } from '@/utils/formatters';
import {
  TrendingUp,
  Users,
  Rocket,
  Award,
  Heart,
  MessageCircle,
  MapPin,
  ShieldCheck,
  Building2,
  Calendar,
} from 'lucide-react-native';

interface BizHubMilestoneCardProps {
  milestone: BizHubMilestone;
  onLike: (id: string) => void;
}

export const BizHubMilestoneCard: React.FC<BizHubMilestoneCardProps> = ({
  milestone,
  onLike,
}) => {
  const handleCongratulateWhatsApp = () => {
    const text = encodeURIComponent(
      `Selamat atas pencapaian usahanya kak *${milestone.namaPemilik}* (${milestone.namaUsaha})! Semoga semakin maju dan menginspirasi sesama peserta TKML Kemnaker.`
    );
    const phone = milestone.noWhatsapp || '6281234567890';
    Linking.openURL(`https://wa.me/${phone}?text=${text}`);
  };

  const getBadgeTypeConfig = () => {
    switch (milestone.tipeUpdate) {
      case 'omzet':
        return {
          label: 'Capaian Omzet',
          icon: <TrendingUp size={13} color={ColorPalette.emerald[700]} />,
          bgColor: ColorPalette.emerald[50],
          borderColor: ColorPalette.emerald[300],
          textColor: ColorPalette.emerald[800],
        };
      case 'karyawan':
        return {
          label: 'Penyerapan Tenaga Kerja',
          icon: <Users size={13} color={ColorPalette.teal[700]} />,
          bgColor: ColorPalette.teal[50],
          borderColor: ColorPalette.teal[300],
          textColor: ColorPalette.teal[800],
        };
      case 'ekspansi':
        return {
          label: 'Ekspansi Usaha',
          icon: <Rocket size={13} color={ColorPalette.amber[700]} />,
          bgColor: ColorPalette.amber[50],
          borderColor: ColorPalette.amber[300],
          textColor: ColorPalette.amber[800],
        };
      case 'omzet_dan_karyawan':
      default:
        return {
          label: 'Milestone Usaha & Karyawan',
          icon: <Award size={13} color={ColorPalette.primary[700]} />,
          bgColor: ColorPalette.primary[50],
          borderColor: ColorPalette.primary[300],
          textColor: ColorPalette.primary[800],
        };
    }
  };

  const badgeConfig = getBadgeTypeConfig();

  return (
    <View style={styles.card}>
      {/* Header Profile & Badge */}
      <View style={styles.header}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Building2 size={20} color={ColorPalette.primary[700]} />
          </View>
          <View style={styles.businessTextWrap}>
            <View style={styles.nameVerifiedRow}>
              <Text style={styles.businessName} numberOfLines={1}>
                {milestone.namaUsaha}
              </Text>
              {milestone.isVerifiedTKML && (
                <ShieldCheck size={14} color={ColorPalette.emerald[600]} />
              )}
            </View>
            <Text style={styles.ownerSubtitle}>
              {milestone.namaPemilik} • <Text style={styles.sectorText}>{milestone.sektorUsaha}</Text>
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.typeBadge,
            { backgroundColor: badgeConfig.bgColor, borderColor: badgeConfig.borderColor },
          ]}>
          {badgeConfig.icon}
          <Text style={[styles.typeBadgeText, { color: badgeConfig.textColor }]}>
            {badgeConfig.label}
          </Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>{milestone.judul}</Text>

      {/* Metrics Highlights (Omzet & Tenaga Kerja) */}
      <View style={styles.metricsContainer}>
        {milestone.omzetBulanIni !== undefined && (
          <View style={styles.metricBox}>
            <View style={styles.metricHeaderRow}>
              <TrendingUp size={14} color={ColorPalette.emerald[600]} />
              <Text style={styles.metricLabel}>Omzet Bulan Ini</Text>
            </View>
            <Text style={styles.metricValue}>{formatRupiah(milestone.omzetBulanIni)}</Text>
            {milestone.kenaikanOmzetPersen && (
              <View style={styles.growthBadge}>
                <Text style={styles.growthBadgeText}>
                  +{milestone.kenaikanOmzetPersen}% vs bln lalu
                </Text>
              </View>
            )}
          </View>
        )}

        {milestone.penambahanKaryawan !== undefined && (
          <View style={[styles.metricBox, styles.metricBoxSecondary]}>
            <View style={styles.metricHeaderRow}>
              <Users size={14} color={ColorPalette.teal[600]} />
              <Text style={styles.metricLabel}>Tenaga Kerja Baru</Text>
            </View>
            <Text style={styles.metricValueSecondary}>
              +{milestone.penambahanKaryawan} Orang
            </Text>
            {milestone.totalKaryawanSekarang && (
              <Text style={styles.metricSubInfo}>
                Total: {milestone.totalKaryawanSekarang} karyawan
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Story / Description */}
      <Text style={styles.description}>{milestone.deskripsi}</Text>

      {/* Optional Photo */}
      {milestone.fotoUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: milestone.fotoUri }} style={styles.photo} resizeMode="cover" />
        </View>
      )}

      {/* Footer Details: Location, Date */}
      <View style={styles.footerInfoRow}>
        <View style={styles.footerInfoItem}>
          <MapPin size={12} color={ColorPalette.slate[400]} />
          <Text style={styles.footerInfoText}>{milestone.lokasiDaerah}</Text>
        </View>
        <View style={styles.footerInfoItem}>
          <Calendar size={12} color={ColorPalette.slate[400]} />
          <Text style={styles.footerInfoText}>{milestone.createdAt}</Text>
        </View>
      </View>

      {/* Action Buttons: Like & WhatsApp Congratulate */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.likeButton, milestone.isLiked && styles.likeButtonActive]}
          activeOpacity={0.7}
          onPress={() => onLike(milestone.id)}>
          <Heart
            size={16}
            color={milestone.isLiked ? ColorPalette.rose[600] : ColorPalette.slate[500]}
            fill={milestone.isLiked ? ColorPalette.rose[600] : 'none'}
          />
          <Text
            style={[styles.likeText, milestone.isLiked && styles.likeTextActive]}>
            {milestone.likesCount} Mengapresiasi
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.congratulateButton}
          activeOpacity={0.8}
          onPress={handleCongratulateWhatsApp}>
          <MessageCircle size={15} color={ColorPalette.primary[700]} />
          <Text style={styles.congratulateText}>Beri Ucapan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: ColorPalette.slate[200],
    padding: 16,
    marginVertical: 6,
    shadowColor: ColorPalette.slate[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: ColorPalette.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ColorPalette.primary[200],
  },
  businessTextWrap: {
    flex: 1,
  },
  nameVerifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  businessName: {
    fontSize: 13,
    fontWeight: '700',
    color: ColorPalette.slate[900],
  },
  ownerSubtitle: {
    fontSize: 11,
    color: ColorPalette.slate[500],
    marginTop: 1,
  },
  sectorText: {
    fontWeight: '600',
    color: ColorPalette.primary[700],
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: ColorPalette.slate[900],
    lineHeight: 20,
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  metricBox: {
    flex: 1,
    backgroundColor: ColorPalette.emerald[50],
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: ColorPalette.emerald[200],
    gap: 3,
  },
  metricBoxSecondary: {
    backgroundColor: ColorPalette.teal[50],
    borderColor: ColorPalette.teal[200],
  },
  metricHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: ColorPalette.slate[600],
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '800',
    color: ColorPalette.emerald[800],
  },
  metricValueSecondary: {
    fontSize: 14,
    fontWeight: '800',
    color: ColorPalette.teal[800],
  },
  growthBadge: {
    alignSelf: 'flex-start',
    backgroundColor: ColorPalette.emerald[600],
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginTop: 2,
  },
  growthBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  metricSubInfo: {
    fontSize: 10,
    fontWeight: '600',
    color: ColorPalette.teal[700],
    marginTop: 2,
  },
  description: {
    fontSize: 13,
    color: ColorPalette.slate[600],
    lineHeight: 18,
  },
  imageContainer: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: ColorPalette.slate[100],
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  footerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: ColorPalette.slate[100],
  },
  footerInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerInfoText: {
    fontSize: 11,
    color: ColorPalette.slate[400],
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ColorPalette.slate[100],
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  likeButtonActive: {
    backgroundColor: ColorPalette.rose[50],
  },
  likeText: {
    fontSize: 12,
    fontWeight: '600',
    color: ColorPalette.slate[600],
  },
  likeTextActive: {
    color: ColorPalette.rose[700],
    fontWeight: '700',
  },
  congratulateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ColorPalette.primary[50],
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ColorPalette.primary[200],
  },
  congratulateText: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorPalette.primary[800],
  },
});
