import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserProfile } from '@/types/tkml';
import { ColorPalette } from '@/constants/colors';
import { Badge } from '@/components/ui/badge';
import { Building2, Award } from 'lucide-react-native';

interface UserHeaderProps {
  user: UserProfile;
}

export const UserHeader: React.FC<UserHeaderProps> = ({ user }) => {
  const getTahapLabel = () => {
    switch (user.tahapanProgram) {
      case 'registrasi':
        return 'Tahap 1: Registrasi';
      case 'review_berkas':
        return 'Tahap 2: Review Berkas';
      case 'tahap_rab':
        return 'Tahap 3: Usulan RAB';
      case 'tahap_lpj':
        return 'Tahap 4: Pelaporan LPJ';
      default:
        return 'Peserta TKML';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.greetingWrapper}>
          <Text style={styles.sapaan}>Selamat Datang,</Text>
          <Text style={styles.namaLengkap} numberOfLines={1}>
            {user.namaLengkap}
          </Text>
        </View>

        <Badge
          label={getTahapLabel()}
          variant="primary"
          icon={<Award size={13} color={ColorPalette.primary[700]} />}
        />
      </View>

      <View style={styles.usahaCard}>
        <View style={styles.usahaIconBox}>
          <Building2 size={20} color={ColorPalette.primary[700]} />
        </View>
        <View style={styles.usahaInfo}>
          <Text style={styles.namaUsaha} numberOfLines={1}>
            {user.namaUsaha}
          </Text>
          <Text style={styles.idTkml}>ID Program: {user.idTKML}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorPalette.primary[700],
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 22,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingWrapper: {
    flex: 1,
    marginRight: 10,
  },
  sapaan: {
    fontSize: 13,
    color: ColorPalette.primary[200],
    fontWeight: '500',
  },
  namaLengkap: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  usahaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 14,
    padding: 12,
    gap: 12,
  },
  usahaIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: ColorPalette.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  usahaInfo: {
    flex: 1,
  },
  namaUsaha: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorPalette.slate[900],
  },
  idTkml: {
    fontSize: 12,
    color: ColorPalette.slate[600],
    marginTop: 2,
  },
});
