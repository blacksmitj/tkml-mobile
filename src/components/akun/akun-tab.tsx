import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTKMLStore } from '@/stores/tkml-store';
import { ColorPalette } from '@/constants/colors';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  User,
  Phone,
  Mail,
  HelpCircle,
  FileQuestion,
  LogOut,
  Shield,
  ChevronRight,
} from 'lucide-react-native';

interface AkunTabProps {
  onLogout?: () => void;
}

export const AkunTab: React.FC<AkunTabProps> = ({ onLogout }) => {
  const { user, logout } = useTKMLStore();

  const handleLogout = () => {
    logout();
    if (onLogout) onLogout();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {user.namaLengkap
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </Text>
          </View>
          <Text style={styles.userName}>{user.namaLengkap}</Text>
          <Text style={styles.userRole}>Peserta Program TKML Kemnaker</Text>
          <View style={styles.idBadge}>
            <Text style={styles.idBadgeText}>ID: {user.idTKML}</Text>
          </View>
        </View>

        {/* Data Akun SIAPkerja */}
        <Card style={styles.cardSpacing}>
          <CardHeader>
            <Text style={styles.cardTitle}>Informasi Akun SIAPkerja</Text>
          </CardHeader>
          <CardContent>
            <View style={styles.infoRow}>
              <Mail size={16} color={ColorPalette.slate[400]} />
              <View style={styles.infoTextWrapper}>
                <Text style={styles.infoLabel}>Email Terdaftar</Text>
                <Text style={styles.infoValue}>{user.email || 'budi.setiawan@example.com'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Phone size={16} color={ColorPalette.slate[400]} />
              <View style={styles.infoTextWrapper}>
                <Text style={styles.infoLabel}>Nomor WhatsApp / HP</Text>
                <Text style={styles.infoValue}>{user.noHp || '081234567890'}</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Bantuan & Regulasi Menu */}
        <Card style={styles.cardSpacing}>
          <CardHeader>
            <Text style={styles.cardTitle}>Pusat Bantuan & Panduan</Text>
          </CardHeader>
          <CardContent style={{ gap: 0 }}>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuLeft}>
                <HelpCircle size={18} color={ColorPalette.primary[700]} />
                <Text style={styles.menuTitle}>Panduan Upload Berkas TKML</Text>
              </View>
              <ChevronRight size={18} color={ColorPalette.slate[400]} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuLeft}>
                <FileQuestion size={18} color={ColorPalette.teal[600]} />
                <Text style={styles.menuTitle}>Format Pelaporan Belanja RAB / LPJ</Text>
              </View>
              <ChevronRight size={18} color={ColorPalette.slate[400]} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, { borderBottomWidth: 0 }]}
              activeOpacity={0.7}>
              <View style={styles.menuLeft}>
                <Shield size={18} color={ColorPalette.amber[600]} />
                <Text style={styles.menuTitle}>Syarat & Ketentuan Program</Text>
              </View>
              <ChevronRight size={18} color={ColorPalette.slate[400]} />
            </TouchableOpacity>
          </CardContent>
        </Card>

        {/* Logout Action */}
        <Button
          title="Keluar dari Aplikasi"
          variant="outline"
          size="lg"
          icon={<LogOut size={18} color={ColorPalette.rose[600]} />}
          onPress={handleLogout}
          style={styles.logoutBtn}
          textStyle={{ color: ColorPalette.rose[600] }}
        />

        <Text style={styles.versionText}>TKML Mobile Apps • Versi 1.0.0 (Expo SDK 57)</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ColorPalette.slate[50],
  },
  scrollContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: ColorPalette.primary[700],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: ColorPalette.slate[900],
  },
  userRole: {
    fontSize: 13,
    color: ColorPalette.slate[500],
    marginTop: 2,
  },
  idBadge: {
    backgroundColor: ColorPalette.primary[50],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  idBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorPalette.primary[800],
  },
  cardSpacing: {
    marginVertical: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorPalette.slate[900],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  infoTextWrapper: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: ColorPalette.slate[400],
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: ColorPalette.slate[800],
    marginTop: 1,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: ColorPalette.slate[100],
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: ColorPalette.slate[800],
  },
  logoutBtn: {
    borderColor: ColorPalette.rose[300],
    marginTop: 10,
  },
  versionText: {
    fontSize: 11,
    color: ColorPalette.slate[400],
    textAlign: 'center',
    marginTop: 12,
  },
});
