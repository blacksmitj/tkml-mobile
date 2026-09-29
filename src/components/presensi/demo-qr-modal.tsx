import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SesiPresensi } from '@/types/tkml';
import { ColorPalette } from '@/constants/colors';
import {
  QrCode,
  X,
  MapPin,
  Clock,
  User,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react-native';

interface DemoQRModalProps {
  visible: boolean;
  onClose: () => void;
  sesiList: SesiPresensi[];
  onSelectToken: (token: string, sesi: SesiPresensi) => void;
}

export const DemoQRModal: React.FC<DemoQRModalProps> = ({
  visible,
  onClose,
  sesiList,
  onSelectToken,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={styles.iconCircle}>
                <Sparkles size={20} color={ColorPalette.primary[600]} />
              </View>
              <View>
                <Text style={styles.modalTitle}>Simulator / Demo QR Code</Text>
                <Text style={styles.modalSubtitle}>
                  Pilih sesi untuk menguji scan tanpa kamera fisik
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X size={20} color={ColorPalette.slate[600]} />
            </TouchableOpacity>
          </View>

          {/* List Sesi */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}>
            {sesiList.map((sesi) => (
              <View key={sesi.id} style={styles.sesiCard}>
                <View style={styles.cardTop}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>
                      {sesi.kategori.toUpperCase().replace('_', ' ')}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          sesi.status === 'aktif'
                            ? ColorPalette.emerald[100]
                            : ColorPalette.slate[100],
                      },
                    ]}>
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            sesi.status === 'aktif'
                              ? ColorPalette.emerald[800]
                              : ColorPalette.slate[700],
                        },
                      ]}>
                      {sesi.status === 'aktif' ? 'SESI AKTIF HARI INI' : 'AKAN DATANG'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.sesiTitle}>{sesi.judulSesi}</Text>

                <View style={styles.metaRow}>
                  <User size={14} color={ColorPalette.slate[500]} />
                  <Text style={styles.metaText}>{sesi.namaFasilitator}</Text>
                </View>

                <View style={styles.metaRow}>
                  <Clock size={14} color={ColorPalette.slate[500]} />
                  <Text style={styles.metaText}>
                    {sesi.tanggal} • {sesi.jamMulai} - {sesi.jamSelesai} WIB
                  </Text>
                </View>

                <View style={styles.metaRow}>
                  <MapPin size={14} color={ColorPalette.slate[500]} />
                  <Text style={styles.metaText} numberOfLines={1}>
                    {sesi.lokasiNama} (Radius Max: {sesi.radiusMeter}m)
                  </Text>
                </View>

                {/* Token Box */}
                <View style={styles.tokenBox}>
                  <QrCode size={16} color={ColorPalette.primary[700]} />
                  <Text style={styles.tokenCode} numberOfLines={1}>
                    {sesi.tokenQR}
                  </Text>
                </View>

                {/* Tombol Simulasikan Scan */}
                <TouchableOpacity
                  style={styles.simulateBtn}
                  activeOpacity={0.8}
                  onPress={() => {
                    onSelectToken(sesi.tokenQR, sesi);
                    onClose();
                  }}>
                  <Zap size={16} color="#FFFFFF" />
                  <Text style={styles.simulateBtnText}>Simulasikan Scan Sesi Ini</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '82%',
    paddingTop: 20,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: ColorPalette.slate[100],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ColorPalette.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: ColorPalette.slate[900],
  },
  modalSubtitle: {
    fontSize: 12,
    color: ColorPalette.slate[500],
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: ColorPalette.slate[100],
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 14,
  },
  sesiCard: {
    backgroundColor: ColorPalette.slate[50],
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorPalette.slate[200],
    gap: 8,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    backgroundColor: ColorPalette.blue[100],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
    color: ColorPalette.blue[800],
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  sesiTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorPalette.slate[900],
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: ColorPalette.slate[600],
    flex: 1,
  },
  tokenBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorPalette.primary[50],
    borderWidth: 1,
    borderColor: ColorPalette.primary[200],
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 8,
    marginTop: 4,
  },
  tokenCode: {
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: ColorPalette.primary[900],
    flex: 1,
  },
  simulateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ColorPalette.primary[700],
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
    marginTop: 6,
  },
  simulateBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
