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
import { Badge } from '@/components/ui/badge';
import {
  Phone,
  Mail,
  HelpCircle,
  FileQuestion,
  LogOut,
  Shield,
  ChevronRight,
  FolderArchive,
  Building2,
  MapPin,
  FileText,
  CreditCard,
  Landmark,
  Package,
} from 'lucide-react-native';

interface AkunTabProps {
  onOpenBerkas: () => void;
  onOpenProfilUsaha: () => void;
  onOpenAlamat: () => void;
  onOpenNib: () => void;
  onOpenNpwp: () => void;
  onOpenRekening: () => void;
  onOpenProduk: () => void;
  onLogout?: () => void;
}

export const AkunTab: React.FC<AkunTabProps> = ({
  onOpenBerkas,
  onOpenProfilUsaha,
  onOpenAlamat,
  onOpenNib,
  onOpenNpwp,
  onOpenRekening,
  onOpenProduk,
  onLogout,
}) => {
  const { user, berkasList, produkList, logout } = useTKMLStore();

  const handleLogout = () => {
    logout();
    if (onLogout) onLogout();
  };

  const berkasRevisiCount = berkasList.filter((b) => b.status === 'perlu_revisi').length;
  const isProfilNeedsAttention =
    user.statusProfilUsaha === 'perlu_revisi' || user.statusProfilUsaha === 'belum_lengkap';
  const isAlamatNeedsAttention =
    user.statusAlamat === 'perlu_revisi' || user.statusAlamat === 'belum_lengkap';
  
  const isNibNeedsAttention =
    user.nib.status === 'perlu_revisi' || user.nib.status === 'belum_lengkap';
  const isNpwpNeedsAttention =
    user.npwp.status === 'perlu_revisi' || user.npwp.status === 'belum_lengkap';
  const isRekeningNeedsAttention =
    user.rekeningBank.status === 'perlu_revisi' || user.rekeningBank.status === 'belum_lengkap';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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

        {/* ================= SECTION 1: LEGALITAS & KEUANGAN MANDIRI ================= */}
        <Card style={styles.cardSpacing}>
          <CardHeader>
            <Text style={styles.cardTitle}>Legalitas & Keuangan Usaha</Text>
          </CardHeader>
          <CardContent style={{ gap: 0 }}>
            {/* Menu: NIB OSS */}
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={onOpenNib}>
              <View style={styles.menuLeft}>
                <View style={[styles.menuIconBox, { backgroundColor: ColorPalette.primary[50] }]}>
                  <FileText size={18} color={ColorPalette.primary[700]} />
                </View>
                <View style={styles.menuTextWrap}>
                  <View style={styles.menuTitleRow}>
                    <Text style={styles.menuTitle}>Nomor Induk Berusaha (NIB)</Text>
                    {isNibNeedsAttention && (
                      <Badge
                        label={user.nib.status === 'perlu_revisi' ? 'Revisi' : 'Belum Lengkap'}
                        variant={user.nib.status === 'perlu_revisi' ? 'danger' : 'warning'}
                      />
                    )}
                    {user.nib.status === 'lengkap' && <Badge label="Lengkap" variant="success" />}
                  </View>
                  <Text style={styles.menuSubtitle}>NIB OSS 13 Digit & Upload Scan Dokumen</Text>
                </View>
              </View>
              <ChevronRight size={18} color={ColorPalette.slate[400]} />
            </TouchableOpacity>

            {/* Menu: NPWP */}
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={onOpenNpwp}>
              <View style={styles.menuLeft}>
                <View style={[styles.menuIconBox, { backgroundColor: ColorPalette.blue[50] }]}>
                  <CreditCard size={18} color={ColorPalette.blue[700]} />
                </View>
                <View style={styles.menuTextWrap}>
                  <View style={styles.menuTitleRow}>
                    <Text style={styles.menuTitle}>NPWP Usaha / Pemilik</Text>
                    {isNpwpNeedsAttention && (
                      <Badge
                        label={user.npwp.status === 'perlu_revisi' ? 'Revisi' : 'Belum Lengkap'}
                        variant={user.npwp.status === 'perlu_revisi' ? 'danger' : 'warning'}
                      />
                    )}
                    {user.npwp.status === 'lengkap' && <Badge label="Lengkap" variant="success" />}
                  </View>
                  <Text style={styles.menuSubtitle}>NPWP 15/16 Digit & Upload Foto Kartu</Text>
                </View>
              </View>
              <ChevronRight size={18} color={ColorPalette.slate[400]} />
            </TouchableOpacity>

            {/* Menu: Rekening Bank */}
            <TouchableOpacity
              style={[styles.menuItem, { borderBottomWidth: 0 }]}
              activeOpacity={0.7}
              onPress={onOpenRekening}>
              <View style={styles.menuLeft}>
                <View style={[styles.menuIconBox, { backgroundColor: ColorPalette.teal[50] }]}>
                  <Landmark size={18} color={ColorPalette.teal[700]} />
                </View>
                <View style={styles.menuTextWrap}>
                  <View style={styles.menuTitleRow}>
                    <Text style={styles.menuTitle}>Rekening Bank Penyaluran</Text>
                    {isRekeningNeedsAttention && (
                      <Badge
                        label={user.rekeningBank.status === 'perlu_revisi' ? 'Revisi' : 'Belum Lengkap'}
                        variant={user.rekeningBank.status === 'perlu_revisi' ? 'danger' : 'warning'}
                      />
                    )}
                    {user.rekeningBank.status === 'lengkap' && (
                      <Badge label="Lengkap" variant="success" />
                    )}
                  </View>
                  <Text style={styles.menuSubtitle}>Buku Tabungan & Nomor Rekening Aktif</Text>
                </View>
              </View>
              <ChevronRight size={18} color={ColorPalette.slate[400]} />
            </TouchableOpacity>
          </CardContent>
        </Card>

        {/* ================= SECTION 2: PROFIL, PRODUK & ALAMAT ================= */}
        <Card style={styles.cardSpacing}>
          <CardHeader>
            <Text style={styles.cardTitle}>Profil Usaha, Produk & Alamat</Text>
          </CardHeader>
          <CardContent style={{ gap: 0 }}>
            {/* Menu: Katalog Produk */}
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={onOpenProduk}>
              <View style={styles.menuLeft}>
                <View style={[styles.menuIconBox, { backgroundColor: ColorPalette.amber[50] }]}>
                  <Package size={18} color={ColorPalette.amber[700]} />
                </View>
                <View style={styles.menuTextWrap}>
                  <View style={styles.menuTitleRow}>
                    <Text style={styles.menuTitle}>Katalog Produk Usaha</Text>
                    <Badge label={`${produkList.length} Produk`} variant="primary" />
                  </View>
                  <Text style={styles.menuSubtitle}>Kelola Foto, Harga & Kapasitas Produk</Text>
                </View>
              </View>
              <ChevronRight size={18} color={ColorPalette.slate[400]} />
            </TouchableOpacity>

            {/* Menu: Profil Usaha */}
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={onOpenProfilUsaha}>
              <View style={styles.menuLeft}>
                <View style={[styles.menuIconBox, { backgroundColor: ColorPalette.primary[50] }]}>
                  <Building2 size={18} color={ColorPalette.primary[700]} />
                </View>
                <View style={styles.menuTextWrap}>
                  <View style={styles.menuTitleRow}>
                    <Text style={styles.menuTitle}>Profil Identitas Usaha</Text>
                    {isProfilNeedsAttention && (
                      <Badge
                        label={user.statusProfilUsaha === 'perlu_revisi' ? 'Revisi' : 'Belum Lengkap'}
                        variant={user.statusProfilUsaha === 'perlu_revisi' ? 'danger' : 'warning'}
                      />
                    )}
                    {user.statusProfilUsaha === 'lengkap' && <Badge label="Lengkap" variant="success" />}
                  </View>
                  <Text style={styles.menuSubtitle}>KBLI, Sektor Usaha & Deskripsi Kegiatan</Text>
                </View>
              </View>
              <ChevronRight size={18} color={ColorPalette.slate[400]} />
            </TouchableOpacity>

            {/* Menu: 3 Alamat Terstruktur */}
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={onOpenAlamat}>
              <View style={styles.menuLeft}>
                <View style={[styles.menuIconBox, { backgroundColor: ColorPalette.teal[50] }]}>
                  <MapPin size={18} color={ColorPalette.teal[700]} />
                </View>
                <View style={styles.menuTextWrap}>
                  <View style={styles.menuTitleRow}>
                    <Text style={styles.menuTitle}>Alamat (KTP, Usaha, Domisili)</Text>
                    {isAlamatNeedsAttention && (
                      <Badge
                        label={user.statusAlamat === 'perlu_revisi' ? 'Revisi' : 'Belum Lengkap'}
                        variant={user.statusAlamat === 'perlu_revisi' ? 'danger' : 'warning'}
                      />
                    )}
                    {user.statusAlamat === 'lengkap' && <Badge label="Lengkap" variant="success" />}
                  </View>
                  <Text style={styles.menuSubtitle}>3 Kategori Alamat Lengkap & Kode Pos</Text>
                </View>
              </View>
              <ChevronRight size={18} color={ColorPalette.slate[400]} />
            </TouchableOpacity>

            {/* Menu: Dokumen Berkas Persyaratan */}
            <TouchableOpacity
              style={[styles.menuItem, { borderBottomWidth: 0 }]}
              activeOpacity={0.7}
              onPress={onOpenBerkas}>
              <View style={styles.menuLeft}>
                <View style={[styles.menuIconBox, { backgroundColor: ColorPalette.slate[100] }]}>
                  <FolderArchive size={18} color={ColorPalette.slate[700]} />
                </View>
                <View style={styles.menuTextWrap}>
                  <View style={styles.menuTitleRow}>
                    <Text style={styles.menuTitle}>Dokumen Berkas Persyaratan</Text>
                    {berkasRevisiCount > 0 && (
                      <Badge label={`${berkasRevisiCount} Revisi`} variant="danger" />
                    )}
                  </View>
                  <Text style={styles.menuSubtitle}>Upload Berkas KTP, KK & Proposal</Text>
                </View>
              </View>
              <ChevronRight size={18} color={ColorPalette.slate[400]} />
            </TouchableOpacity>
          </CardContent>
        </Card>

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

        {/* Bantuan & Panduan Menu */}
        <Card style={styles.cardSpacing}>
          <CardHeader>
            <Text style={styles.cardTitle}>Pusat Bantuan & Panduan</Text>
          </CardHeader>
          <CardContent style={{ gap: 0 }}>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuLeft}>
                <HelpCircle size={18} color={ColorPalette.primary[700]} />
                <Text style={styles.plainMenuTitle}>Panduan Program TKML</Text>
              </View>
              <ChevronRight size={18} color={ColorPalette.slate[400]} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuLeft}>
                <FileQuestion size={18} color={ColorPalette.teal[600]} />
                <Text style={styles.plainMenuTitle}>Format Pelaporan Belanja RAB / LPJ</Text>
              </View>
              <ChevronRight size={18} color={ColorPalette.slate[400]} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, { borderBottomWidth: 0 }]}
              activeOpacity={0.7}>
              <View style={styles.menuLeft}>
                <Shield size={18} color={ColorPalette.amber[600]} />
                <Text style={styles.plainMenuTitle}>Syarat & Ketentuan Program</Text>
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

        <Text style={styles.versionText}>TKML Mobile Apps • Versi 1.1.0 (Expo SDK 57)</Text>
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
    gap: 14,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: ColorPalette.primary[700],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: ColorPalette.slate[900],
    marginBottom: 2,
  },
  userRole: {
    fontSize: 13,
    color: ColorPalette.slate[500],
    marginBottom: 6,
  },
  idBadge: {
    backgroundColor: ColorPalette.primary[50],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ColorPalette.primary[200],
  },
  idBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorPalette.primary[700],
  },
  cardSpacing: {
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorPalette.slate[900],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: ColorPalette.slate[100],
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextWrap: {
    flex: 1,
  },
  menuTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: ColorPalette.slate[900],
  },
  menuSubtitle: {
    fontSize: 12,
    color: ColorPalette.slate[500],
  },
  plainMenuTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: ColorPalette.slate[700],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  infoTextWrapper: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: ColorPalette.slate[400],
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: ColorPalette.slate[800],
    fontWeight: '500',
  },
  logoutBtn: {
    marginTop: 8,
    borderColor: ColorPalette.rose[200],
    backgroundColor: ColorPalette.rose[50],
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: ColorPalette.slate[400],
    marginTop: 8,
  },
});
