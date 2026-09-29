import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { ColorPalette } from '@/constants/colors';
import {
  QrCode,
  Flashlight,
  FlashlightOff,
  SwitchCamera,
  Keyboard,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  X,
  Navigation,
} from 'lucide-react-native';
import { SesiPresensi, RiwayatPresensi } from '@/types/tkml';

interface QRCameraScannerProps {
  onScanSuccess: (
    token: string,
    coords?: { latitude: number; longitude: number },
    metode?: 'qr_camera' | 'kode_manual' | 'demo_simulasi'
  ) => { success: boolean; message: string; record?: RiwayatPresensi };
  onOpenDemo: () => void;
  activeSession?: SesiPresensi;
}

export const QRCameraScanner: React.FC<QRCameraScannerProps> = ({
  onScanSuccess,
  onOpenDemo,
  activeSession,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [scanned, setScanned] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>('Memeriksa GPS...');

  // Manual Input Modal
  const [manualModalVisible, setManualModalVisible] = useState(false);
  const [manualInputCode, setManualInputCode] = useState('');

  // Result Feedback Modal
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    record?: RiwayatPresensi;
  } | null>(null);

  // Laser Animation
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(200, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const laserAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  // Fetch GPS Coordinates
  const fetchLocation = async () => {
    try {
      setLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationStatus('Izin GPS ditolak (simulasi aktif)');
        // Fallback default coordinates (Padalarang/Bandung)
        setUserLocation({ latitude: -6.8406, longitude: 107.4914 });
        setLoadingLocation(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setUserLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      setLocationStatus('GPS Akurat');
    } catch (e) {
      // Fallback
      setUserLocation({ latitude: -6.8406, longitude: 107.4914 });
      setLocationStatus('GPS Tersedia (Akurasi Terbatas)');
    } finally {
      setLoadingLocation(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    const result = onScanSuccess(
      data,
      userLocation || undefined,
      'qr_camera'
    );

    setScanResult(result);
    setResultModalVisible(true);
  };

  const handleManualSubmit = () => {
    if (!manualInputCode.trim()) return;
    setManualModalVisible(false);

    const result = onScanSuccess(
      manualInputCode.trim(),
      userLocation || undefined,
      'kode_manual'
    );

    setManualInputCode('');
    setScanResult(result);
    setResultModalVisible(true);
  };

  const resetScanner = () => {
    setScanned(false);
    setResultModalVisible(false);
    setScanResult(null);
  };

  return (
    <View style={styles.container}>
      {/* Target Sesi Info Header */}
      {activeSession && (
        <View style={styles.activeSesiBanner}>
          <View style={styles.activeSesiLeft}>
            <View style={styles.liveDot} />
            <View style={{ flex: 1 }}>
              <Text style={styles.activeSesiLabel}>SESI PRESENSI AKTIF HARI INI</Text>
              <Text style={styles.activeSesiTitle} numberOfLines={1}>
                {activeSession.judulSesi}
              </Text>
              <Text style={styles.activeSesiLoc} numberOfLines={1}>
                📍 {activeSession.lokasiNama} (Max {activeSession.radiusMeter}m)
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Viewfinder Camera Area */}
      <View style={styles.scannerWrapper}>
        {permission?.granted ? (
          <CameraView
            style={styles.camera}
            facing={facing}
            enableTorch={torch}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}>
            <View style={styles.overlay}>
              {/* Target Scan Box */}
              <View style={styles.targetFrame}>
                {/* Corner Accents */}
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />

                {/* Animated Laser Line */}
                {!scanned && (
                  <Animated.View style={[styles.laserLine, laserAnimatedStyle]} />
                )}

                {scanned && (
                  <View style={styles.scannedBackdrop}>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                    <Text style={styles.scannedText}>Memproses Presensi...</Text>
                  </View>
                )}
              </View>
            </View>
          </CameraView>
        ) : (
          <View style={styles.permissionFallback}>
            <QrCode size={56} color={ColorPalette.slate[400]} />
            <Text style={styles.permissionTitle}>Izin Kamera Diperlukan</Text>
            <Text style={styles.permissionDesc}>
              Aplikasi memerlukan izin akses kamera untuk memindai QR Code kehadiran.
            </Text>
            <TouchableOpacity
              style={styles.permissionBtn}
              activeOpacity={0.8}
              onPress={requestPermission}>
              <Text style={styles.permissionBtnText}>Izinkan Akses Kamera</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Floating Top Controls */}
        <View style={styles.topControlBar}>
          <TouchableOpacity
            style={[styles.glassBtn, torch && styles.glassBtnActive]}
            activeOpacity={0.7}
            onPress={() => setTorch(!torch)}>
            {torch ? (
              <Flashlight size={18} color="#FFFFFF" />
            ) : (
              <FlashlightOff size={18} color="#FFFFFF" />
            )}
            <Text style={styles.glassBtnText}>{torch ? 'Flash ON' : 'Flash'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.glassBtn}
            activeOpacity={0.7}
            onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
            <SwitchCamera size={18} color="#FFFFFF" />
            <Text style={styles.glassBtnText}>Putar</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Floating GPS Status */}
        <View style={styles.gpsIndicatorBar}>
          <View style={styles.gpsRow}>
            <Navigation size={13} color={ColorPalette.emerald[400]} />
            <Text style={styles.gpsText}>
              {loadingLocation ? 'Mencari titik koordinat...' : locationStatus}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons Row */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.manualInputBtn}
          activeOpacity={0.8}
          onPress={() => setManualModalVisible(true)}>
          <Keyboard size={18} color={ColorPalette.slate[700]} />
          <Text style={styles.manualInputText}>Input Kode Manual</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.demoTriggerBtn}
          activeOpacity={0.8}
          onPress={onOpenDemo}>
          <Sparkles size={18} color="#FFFFFF" />
          <Text style={styles.demoTriggerText}>Demo / Test QR</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Input Kode Manual */}
      <Modal
        visible={manualModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setManualModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.manualDialog}>
            <View style={styles.dialogHeader}>
              <Text style={styles.dialogTitle}>Input Kode Sesi Presensi</Text>
              <TouchableOpacity onPress={() => setManualModalVisible(false)}>
                <X size={20} color={ColorPalette.slate[500]} />
              </TouchableOpacity>
            </View>

            <Text style={styles.dialogSubtitle}>
              Masukkan kode token QR yang diberikan oleh fasilitator / panitia TKML:
            </Text>

            <TextInput
              style={styles.tokenInput}
              placeholder="Contoh: TKML-BIMTEK-PRODUK-20260929"
              placeholderTextColor={ColorPalette.slate[400]}
              value={manualInputCode}
              onChangeText={setManualInputCode}
              autoCapitalize="characters"
            />

            <View style={styles.dialogActions}>
              <TouchableOpacity
                style={styles.cancelDialogBtn}
                onPress={() => setManualModalVisible(false)}>
                <Text style={styles.cancelDialogText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.submitDialogBtn,
                  !manualInputCode.trim() && { opacity: 0.5 },
                ]}
                disabled={!manualInputCode.trim()}
                onPress={handleManualSubmit}>
                <Text style={styles.submitDialogText}>Kirim Presensi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Hasil Presensi */}
      <Modal
        visible={resultModalVisible}
        transparent
        animationType="slide"
        onRequestClose={resetScanner}>
        <View style={styles.modalOverlay}>
          <View style={styles.resultDialog}>
            <View
              style={[
                styles.resultIconWrap,
                {
                  backgroundColor: scanResult?.success
                    ? scanResult.record?.statusKehadiran === 'di_luar_radius'
                      ? ColorPalette.amber[100]
                      : ColorPalette.emerald[100]
                    : ColorPalette.rose[100],
                },
              ]}>
              {scanResult?.success ? (
                scanResult.record?.statusKehadiran === 'di_luar_radius' ? (
                  <AlertTriangle size={36} color={ColorPalette.amber[600]} />
                ) : (
                  <CheckCircle2 size={36} color={ColorPalette.emerald[600]} />
                )
              ) : (
                <X size={36} color={ColorPalette.rose[600]} />
              )}
            </View>

            <Text style={styles.resultTitle}>
              {scanResult?.success
                ? scanResult.record?.statusKehadiran === 'di_luar_radius'
                  ? 'Presensi Di Luar Radius'
                  : 'Presensi Berhasil Terverifikasi!'
                : 'Presensi Gagal'}
            </Text>

            <Text style={styles.resultMessage}>{scanResult?.message}</Text>

            {scanResult?.record && (
              <View style={styles.recordDetailBox}>
                <View style={styles.recordRow}>
                  <Text style={styles.recordLabel}>Sesi:</Text>
                  <Text style={styles.recordVal} numberOfLines={1}>
                    {scanResult.record.judulSesi}
                  </Text>
                </View>

                <View style={styles.recordRow}>
                  <Text style={styles.recordLabel}>Waktu:</Text>
                  <Text style={styles.recordVal}>{scanResult.record.waktuScan}</Text>
                </View>

                <View style={styles.recordRow}>
                  <Text style={styles.recordLabel}>Jarak Lokasi:</Text>
                  <Text
                    style={[
                      styles.recordVal,
                      {
                        fontWeight: '700',
                        color:
                          scanResult.record.statusKehadiran === 'di_luar_radius'
                            ? ColorPalette.rose[600]
                            : ColorPalette.emerald[600],
                      },
                    ]}>
                    {scanResult.record.jarakMeter} meter dari titik sesi
                  </Text>
                </View>

                <View style={styles.recordRow}>
                  <Text style={styles.recordLabel}>Metode:</Text>
                  <Text style={styles.recordVal}>
                    {scanResult.record.metode === 'qr_camera'
                      ? 'Scan Kamera'
                      : scanResult.record.metode === 'kode_manual'
                      ? 'Kode Manual'
                      : 'Demo Simulasi'}
                  </Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.doneBtn}
              activeOpacity={0.8}
              onPress={resetScanner}>
              <Text style={styles.doneBtnText}>Tutup & Selesai</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  activeSesiBanner: {
    backgroundColor: ColorPalette.primary[50],
    borderWidth: 1,
    borderColor: ColorPalette.primary[200],
    borderRadius: 14,
    padding: 12,
  },
  activeSesiLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ColorPalette.emerald[500],
    marginTop: 4,
  },
  activeSesiLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: ColorPalette.primary[800],
    letterSpacing: 0.5,
  },
  activeSesiTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ColorPalette.slate[900],
    marginTop: 2,
  },
  activeSesiLoc: {
    fontSize: 11,
    color: ColorPalette.slate[600],
    marginTop: 2,
  },
  scannerWrapper: {
    height: 320,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetFrame: {
    width: 220,
    height: 220,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#38BDF8',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 10,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 10,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 10,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 10,
  },
  laserLine: {
    position: 'absolute',
    top: 0,
    left: 10,
    right: 10,
    height: 3,
    backgroundColor: '#38BDF8',
    borderRadius: 2,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 6,
  },
  scannedBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  scannedText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  permissionFallback: {
    flex: 1,
    backgroundColor: ColorPalette.slate[900],
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  permissionDesc: {
    fontSize: 12,
    color: ColorPalette.slate[400],
    textAlign: 'center',
    lineHeight: 18,
  },
  permissionBtn: {
    backgroundColor: ColorPalette.primary[600],
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 6,
  },
  permissionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  topControlBar: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  glassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  glassBtnActive: {
    backgroundColor: ColorPalette.amber[600],
    borderColor: ColorPalette.amber[400],
  },
  glassBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  gpsIndicatorBar: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gpsText: {
    fontSize: 11,
    fontWeight: '600',
    color: ColorPalette.emerald[300],
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  manualInputBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: ColorPalette.slate[300],
    paddingVertical: 12,
    borderRadius: 12,
  },
  manualInputText: {
    fontSize: 13,
    fontWeight: '700',
    color: ColorPalette.slate[800],
  },
  demoTriggerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: ColorPalette.primary[700],
    paddingVertical: 12,
    borderRadius: 12,
  },
  demoTriggerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  manualDialog: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  dialogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dialogTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ColorPalette.slate[900],
  },
  dialogSubtitle: {
    fontSize: 12,
    color: ColorPalette.slate[600],
    lineHeight: 18,
  },
  tokenInput: {
    backgroundColor: ColorPalette.slate[50],
    borderWidth: 1,
    borderColor: ColorPalette.slate[300],
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: '700',
    color: ColorPalette.slate[900],
  },
  dialogActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  cancelDialogBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: ColorPalette.slate[100],
    alignItems: 'center',
  },
  cancelDialogText: {
    fontSize: 13,
    fontWeight: '600',
    color: ColorPalette.slate[700],
  },
  submitDialogBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: ColorPalette.primary[700],
    alignItems: 'center',
  },
  submitDialogText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resultDialog: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  resultIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: ColorPalette.slate[900],
    textAlign: 'center',
  },
  resultMessage: {
    fontSize: 13,
    color: ColorPalette.slate[600],
    textAlign: 'center',
    lineHeight: 18,
  },
  recordDetailBox: {
    width: '100%',
    backgroundColor: ColorPalette.slate[50],
    borderRadius: 12,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: ColorPalette.slate[200],
    marginVertical: 4,
  },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  recordLabel: {
    fontSize: 12,
    color: ColorPalette.slate[500],
    width: 80,
  },
  recordVal: {
    fontSize: 12,
    fontWeight: '600',
    color: ColorPalette.slate[800],
    flex: 1,
    textAlign: 'right',
  },
  doneBtn: {
    width: '100%',
    backgroundColor: ColorPalette.slate[900],
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  doneBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
