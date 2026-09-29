import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ColorPalette } from '@/constants/colors';
import { Camera, Image as ImageIcon, X } from 'lucide-react-native';

interface UploadModalProps {
  visible: boolean;
  onClose: () => void;
  berkasNama: string;
  onImageSelected: (uri: string, sizeFormatted: string) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  visible,
  onClose,
  berkasNama,
  onImageSelected,
}) => {
  const [compressing, setCompressing] = useState(false);

  const handlePickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Izin akses kamera diperlukan untuk mengambil foto berkas.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.6, // Kompresi otomatis ke ~300-600 KB
    });

    if (!result.canceled && result.assets[0]) {
      processSelectedImage(result.assets[0].uri);
    }
  };

  const handlePickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.6,
    });

    if (!result.canceled && result.assets[0]) {
      processSelectedImage(result.assets[0].uri);
    }
  };

  const processSelectedImage = (uri: string) => {
    setCompressing(true);
    // Simulasi visual progress kompresi HP sebelum upload
    setTimeout(() => {
      setCompressing(false);
      onImageSelected(uri, '380 KB');
      onClose();
    }, 700);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              <View style={styles.handleBar} />

              <View style={styles.header}>
                <View>
                  <Text style={styles.title}>Unggah Dokumen</Text>
                  <Text style={styles.subtitle} numberOfLines={1}>
                    {berkasNama}
                  </Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <X size={20} color={ColorPalette.slate[500]} />
                </TouchableOpacity>
              </View>

              {compressing ? (
                <View style={styles.compressingBox}>
                  <Text style={styles.compressingTitle}>Mengompres Gambar...</Text>
                  <Text style={styles.compressingSubtitle}>
                    Mengurangi ukuran dari ~3.8 MB menjadi &lt; 500 KB agar upload cepat & hemat kuota.
                  </Text>
                </View>
              ) : (
                <View style={styles.optionsContainer}>
                  <TouchableOpacity
                    style={styles.optionCard}
                    activeOpacity={0.8}
                    onPress={handlePickFromCamera}>
                    <View style={[styles.iconBox, { backgroundColor: ColorPalette.primary[50] }]}>
                      <Camera size={26} color={ColorPalette.primary[700]} />
                    </View>
                    <View style={styles.optionInfo}>
                      <Text style={styles.optionTitle}>Buka Kamera</Text>
                      <Text style={styles.optionDesc}>
                        Ambil foto dokumen langsung dengan kamera HP
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.optionCard}
                    activeOpacity={0.8}
                    onPress={handlePickFromGallery}>
                    <View style={[styles.iconBox, { backgroundColor: ColorPalette.teal[50] }]}>
                      <ImageIcon size={26} color={ColorPalette.teal[600]} />
                    </View>
                    <View style={styles.optionInfo}>
                      <Text style={styles.optionTitle}>Pilih dari Galeri</Text>
                      <Text style={styles.optionDesc}>
                        Pilih foto atau scan berkas yang sudah tersimpan
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 12,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: ColorPalette.slate[300],
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: ColorPalette.slate[900],
  },
  subtitle: {
    fontSize: 13,
    color: ColorPalette.slate[500],
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: ColorPalette.slate[100],
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: ColorPalette.slate[50],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: ColorPalette.slate[200],
    gap: 14,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ColorPalette.slate[900],
  },
  optionDesc: {
    fontSize: 12,
    color: ColorPalette.slate[500],
    marginTop: 2,
  },
  compressingBox: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: ColorPalette.primary[50],
    borderRadius: 16,
    gap: 8,
  },
  compressingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ColorPalette.primary[800],
  },
  compressingSubtitle: {
    fontSize: 12,
    color: ColorPalette.primary[600],
    textAlign: 'center',
    lineHeight: 16,
  },
});
