import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ColorPalette } from '@/constants/colors';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ReceiptText } from 'lucide-react-native';

export const RabPlaceholderTab: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RAB & Pelaporan LPJ</Text>
        <Text style={styles.headerSubtitle}>
          Rincian usulan anggaran disetujui & upload nota bukti belanja.
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card>
          <CardHeader>
            <View style={styles.cardHeaderRow}>
              <ReceiptText size={20} color={ColorPalette.amber[600]} />
              <Text style={styles.cardTitle}>Anggaran Usulan vs Realisasi</Text>
            </View>
          </CardHeader>
          <CardContent>
            <Text style={styles.descText}>
              Modul tab Usulan RAB dan form pelaporan nota realisasi belanja dengan 2 upload foto akan hadir lengkap di Fase 3.
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
