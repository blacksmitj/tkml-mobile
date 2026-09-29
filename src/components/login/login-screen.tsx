import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTKMLStore } from '@/stores/tkml-store';
import { ColorPalette } from '@/constants/colors';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShieldCheck, HelpCircle, ExternalLink, Sparkles } from 'lucide-react-native';

interface LoginScreenProps {
  onSuccessLogin?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccessLogin }) => {
  const { login } = useTKMLStore();
  const [loading, setLoading] = useState(false);

  const handleSsoLogin = () => {
    setLoading(true);
    // Simulasi OAuth2 PKCE SSO SIAPkerja Browser flow
    setTimeout(() => {
      login();
      setLoading(false);
      if (onSuccessLogin) onSuccessLogin();
    }, 1200);
  };

  const handleOpenHelp = () => {
    Linking.openURL('https://siapkerja.kemnaker.go.id');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Branding Section */}
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <ShieldCheck size={36} color={ColorPalette.primary[700]} />
          </View>
          <Text style={styles.appTitle}>TKML Mobile</Text>
          <Text style={styles.appSubtitle}>
            Tenaga Kerja Mandiri Lanjutan
          </Text>
          <Text style={styles.kemnakerText}>Kementerian Ketenagakerjaan RI</Text>
        </View>

        {/* Feature Highlights Card */}
        <Card style={styles.infoCard}>
          <View style={styles.cardHeaderRow}>
            <Sparkles size={20} color={ColorPalette.amber[500]} />
            <Text style={styles.infoCardTitle}>Aplikasi Resmi Peserta</Text>
          </View>
          <Text style={styles.infoCardDesc}>
            Pantau progres verifikasi berkas, kelola tenaga kerja disabilitas & reguler, serta laporkan realisasi belanja RAB & LPJ secara transparan.
          </Text>
        </Card>

        {/* Login SSO Action */}
        <View style={styles.actionContainer}>
          <Button
            title="Masuk dengan Akun SIAPkerja"
            size="lg"
            variant="primary"
            loading={loading}
            icon={<ShieldCheck size={20} color="#FFFFFF" />}
            onPress={handleSsoLogin}
            style={styles.ssoButton}
          />

          <TouchableOpacity
            style={styles.helpLinkRow}
            activeOpacity={0.7}
            onPress={handleOpenHelp}>
            <HelpCircle size={16} color={ColorPalette.primary[700]} />
            <Text style={styles.helpLinkText}>Belum punya akun SIAPkerja Kemnaker?</Text>
            <ExternalLink size={14} color={ColorPalette.primary[700]} />
          </TouchableOpacity>
        </View>

        <View style={styles.footerNote}>
          <Text style={styles.footerText}>
            Single Sign-On (SSO) terintegrasi secara aman dengan ekosistem SIAPkerja Kemnaker RI.
          </Text>
        </View>
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
    paddingHorizontal: 24,
    paddingVertical: 36,
    justifyContent: 'center',
    minHeight: '100%',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBadge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: ColorPalette.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: ColorPalette.primary[300],
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: ColorPalette.primary[900],
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorPalette.primary[700],
    marginTop: 4,
  },
  kemnakerText: {
    fontSize: 13,
    color: ColorPalette.slate[500],
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 28,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ColorPalette.slate[900],
  },
  infoCardDesc: {
    fontSize: 13,
    color: ColorPalette.slate[600],
    lineHeight: 20,
  },
  actionContainer: {
    gap: 16,
    width: '100%',
  },
  ssoButton: {
    borderRadius: 14,
    backgroundColor: ColorPalette.primary[700],
  },
  helpLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  helpLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: ColorPalette.primary[700],
  },
  footerNote: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: ColorPalette.slate[400],
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 280,
  },
});
