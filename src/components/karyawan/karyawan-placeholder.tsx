import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ColorPalette } from '@/constants/colors';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, AlertCircle } from 'lucide-react-native';

export const KaryawanPlaceholderTab: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manajemen Tenaga Kerja</Text>
        <Text style={styles.headerSubtitle}>
          Daftar karyawan reguler & penyandang disabilitas yang diberdayakan.
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card>
          <CardHeader>
            <View style={styles.cardHeaderRow}>
              <Users size={20} color={ColorPalette.teal[600]} />
              <Text style={styles.cardTitle}>Data Karyawan TKML</Text>
            </View>
          </CardHeader>
          <CardContent>
            <Text style={styles.descText}>
              Modul form input lengkap NIK 16 digit, date picker, dan radio status disabilitas akan hadir lengkap di Fase 3.
            </Text>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: ColorPalette.slate[200],
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: ColorPalette.slate[900],
  },
  headerSubtitle: {
    fontSize: 13,
    color: ColorPalette.slate[500],
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    backgroundColor: ColorPalette.slate[50],
    minHeight: '100%',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ColorPalette.slate[900],
  },
  descText: {
    fontSize: 13,
    color: ColorPalette.slate[600],
    lineHeight: 18,
  },
});
