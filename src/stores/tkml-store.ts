import { create } from 'zustand';
import {
  UserProfile,
  BerkasItem,
  Karyawan,
  ItemRAB,
  NotaLPJ,
  ProdukUsaha,
  StatusBerkas,
  BizHubAd,
  BizHubMilestone,
  SesiPresensi,
  RiwayatPresensi,
  MetodePresensi,
} from '@/types/tkml';
import {
  INITIAL_USER,
  INITIAL_BERKAS,
  INITIAL_KARYAWAN,
  INITIAL_RAB,
  INITIAL_LPJ,
  INITIAL_PRODUK,
  INITIAL_BIZHUB_ADS,
  INITIAL_BIZHUB_MILESTONES,
  INITIAL_SESI_PRESENSI,
  INITIAL_RIWAYAT_PRESENSI,
} from '@/data/mock-data';
import { calculateDistanceMeters } from '@/utils/geo';

interface TKMLState {
  // Auth & Profile
  isAuthenticated: boolean;
  user: UserProfile;
  login: () => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;

  // Berkas
  berkasList: BerkasItem[];
  uploadBerkas: (id: string, fileUri: string, sizeFormatted?: string) => void;
  updateBerkasStatus: (id: string, status: StatusBerkas, catatanAdmin?: string) => void;

  // Karyawan
  karyawanList: Karyawan[];
  addKaryawan: (karyawan: Omit<Karyawan, 'id' | 'createdAt'>) => void;
  updateKaryawan: (id: string, karyawan: Partial<Karyawan>) => void;
  deleteKaryawan: (id: string) => void;

  // RAB & LPJ
  rabList: ItemRAB[];
  addRabItem: (item: Omit<ItemRAB, 'id' | 'status' | 'subtotal'>) => void;
  updateRabItem: (id: string, item: Partial<ItemRAB>) => void;
  deleteRabItem: (id: string) => void;

  lpjList: NotaLPJ[];
  addLpjNota: (nota: Omit<NotaLPJ, 'id' | 'createdAt'>) => void;
  deleteLpjNota: (id: string) => void;

  // Produk Usaha
  produkList: ProdukUsaha[];
  updateProduk: (id: string, produk: Partial<ProdukUsaha>) => void;
  addProduk: (produk: Omit<ProdukUsaha, 'id'>) => void;

  // BizHub Ads & Network
  bizHubAds: BizHubAd[];
  addBizHubAd: (ad: Omit<BizHubAd, 'id' | 'createdAt' | 'isVerifiedTKML'>) => void;
  deleteBizHubAd: (id: string) => void;

  // BizHub Milestones & Business Updates
  bizHubMilestones: BizHubMilestone[];
  addBizHubMilestone: (
    milestone: Omit<BizHubMilestone, 'id' | 'createdAt' | 'likesCount' | 'isVerifiedTKML'>
  ) => void;
  likeBizHubMilestone: (id: string) => void;
  deleteBizHubMilestone: (id: string) => void;

  // Presensi Kehadiran QR
  sesiPresensiList: SesiPresensi[];
  riwayatPresensiList: RiwayatPresensi[];
  submitPresensiQR: (
    tokenQR: string,
    userLat?: number,
    userLng?: number,
    metode?: MetodePresensi
  ) => { success: boolean; message: string; record?: RiwayatPresensi };
  deleteRiwayatPresensi: (id: string) => void;

  // Toast / Notification
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info';
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useTKMLStore = create<TKMLState>((set, get) => ({
  isAuthenticated: true,
  user: INITIAL_USER,
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
  updateProfile: (profile) =>
    set((state) => ({
      user: { ...state.user, ...profile },
    })),

  berkasList: INITIAL_BERKAS,
  uploadBerkas: (id, fileUri, sizeFormatted = '320 KB') => {
    set((state) => ({
      berkasList: state.berkasList.map((item) =>
        item.id === id
          ? {
              ...item,
              fileUri,
              fileSizeFormatted: sizeFormatted,
              status: 'menunggu',
              catatanAdmin: undefined,
              uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            }
          : item
      ),
    }));
    get().showToast('Berkas berhasil diunggah dan sedang ditinjau.', 'success');
  },
  updateBerkasStatus: (id, status, catatanAdmin) =>
    set((state) => ({
      berkasList: state.berkasList.map((item) =>
        item.id === id ? { ...item, status, catatanAdmin } : item
      ),
    })),

  karyawanList: INITIAL_KARYAWAN,
  addKaryawan: (karyawanData) => {
    const newKaryawan: Karyawan = {
      ...karyawanData,
      id: `k-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    set((state) => ({
      karyawanList: [newKaryawan, ...state.karyawanList],
    }));
    get().showToast('Data tenaga kerja berhasil ditambahkan.', 'success');
  },
  updateKaryawan: (id, updated) => {
    set((state) => ({
      karyawanList: state.karyawanList.map((item) =>
        item.id === id ? { ...item, ...updated } : item
      ),
    }));
    get().showToast('Data tenaga kerja berhasil diperbarui.', 'success');
  },
  deleteKaryawan: (id) => {
    set((state) => ({
      karyawanList: state.karyawanList.filter((item) => item.id !== id),
    }));
    get().showToast('Data tenaga kerja berhasil dihapus.', 'info');
  },

  rabList: INITIAL_RAB,
  addRabItem: (itemData) => {
    const subtotal = itemData.volume * itemData.hargaSatuan;
    const newItem: ItemRAB = {
      ...itemData,
      id: `rab-${Date.now()}`,
      subtotal,
      status: 'menunggu',
      catatan: 'Menunggu peninjauan & verifikasi tim Kemnaker',
    };
    set((state) => ({
      rabList: [...state.rabList, newItem],
    }));
    get().showToast('Item usulan RAB berhasil diajukan.', 'success');
  },
  updateRabItem: (id, updatedData) => {
    set((state) => ({
      rabList: state.rabList.map((item) => {
        if (item.id === id) {
          const volume = updatedData.volume !== undefined ? updatedData.volume : item.volume;
          const hargaSatuan =
            updatedData.hargaSatuan !== undefined ? updatedData.hargaSatuan : item.hargaSatuan;
          const subtotal = volume * hargaSatuan;
          return {
            ...item,
            ...updatedData,
            subtotal,
            status: 'menunggu', // Reset ke menunggu verifikasi jika diedit peserta
          };
        }
        return item;
      }),
    }));
    get().showToast('Item usulan RAB berhasil diperbarui.', 'success');
  },
  deleteRabItem: (id) => {
    set((state) => ({
      rabList: state.rabList.filter((item) => item.id !== id),
    }));
    get().showToast('Item usulan RAB berhasil dihapus.', 'info');
  },

  lpjList: INITIAL_LPJ,
  addLpjNota: (notaData) => {
    const newNota: NotaLPJ = {
      ...notaData,
      id: `lpj-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    set((state) => ({
      lpjList: [newNota, ...state.lpjList],
    }));
    get().showToast('Realisasi nota belanja LPJ berhasil disimpan.', 'success');
  },
  deleteLpjNota: (id) => {
    set((state) => ({
      lpjList: state.lpjList.filter((item) => item.id !== id),
    }));
    get().showToast('Nota belanja berhasil dihapus.', 'info');
  },

  produkList: INITIAL_PRODUK,
  updateProduk: (id, produkUpdate) => {
    set((state) => ({
      produkList: state.produkList.map((item) =>
        item.id === id ? { ...item, ...produkUpdate } : item
      ),
    }));
    get().showToast('Katalog produk berhasil diperbarui.', 'success');
  },
  addProduk: (produkData) => {
    const newProduk: ProdukUsaha = {
      ...produkData,
      id: `p-${Date.now()}`,
    };
    set((state) => ({
      produkList: [newProduk, ...state.produkList],
    }));
    get().showToast('Produk baru berhasil ditambahkan.', 'success');
  },

  // BizHub Ads
  bizHubAds: INITIAL_BIZHUB_ADS,
  addBizHubAd: (adData) => {
    const newAd: BizHubAd = {
      ...adData,
      id: `biz-${Date.now()}`,
      isVerifiedTKML: true,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    set((state) => ({
      bizHubAds: [newAd, ...state.bizHubAds],
    }));
    get().showToast('Iklan produk berhasil ditayangkan di BizHub.', 'success');
  },
  deleteBizHubAd: (id) => {
    set((state) => ({
      bizHubAds: state.bizHubAds.filter((ad) => ad.id !== id),
    }));
    get().showToast('Iklan berhasil dihapus dari BizHub.', 'info');
  },

  // BizHub Milestones & Business Updates
  bizHubMilestones: INITIAL_BIZHUB_MILESTONES,
  addBizHubMilestone: (milestoneData) => {
    const newMilestone: BizHubMilestone = {
      ...milestoneData,
      id: `ms-${Date.now()}`,
      isVerifiedTKML: true,
      likesCount: 0,
      isLiked: false,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    set((state) => ({
      bizHubMilestones: [newMilestone, ...state.bizHubMilestones],
    }));
    get().showToast('Kabar capaian usaha berhasil dibagikan ke BizHub.', 'success');
  },
  likeBizHubMilestone: (id) => {
    set((state) => ({
      bizHubMilestones: state.bizHubMilestones.map((ms) => {
        if (ms.id === id) {
          const isLiked = !ms.isLiked;
          return {
            ...ms,
            isLiked,
            likesCount: isLiked ? ms.likesCount + 1 : Math.max(0, ms.likesCount - 1),
          };
        }
        return ms;
      }),
    }));
  },
  deleteBizHubMilestone: (id) => {
    set((state) => ({
      bizHubMilestones: state.bizHubMilestones.filter((ms) => ms.id !== id),
    }));
    get().showToast('Kabar usaha berhasil dihapus.', 'info');
  },

  // Presensi Kehadiran QR
  sesiPresensiList: INITIAL_SESI_PRESENSI,
  riwayatPresensiList: INITIAL_RIWAYAT_PRESENSI,

  submitPresensiQR: (tokenQR, userLat, userLng, metode = 'qr_camera') => {
    const cleanToken = tokenQR.trim();
    const currentSessions = get().sesiPresensiList;
    const currentRecords = get().riwayatPresensiList;

    // 1. Cari sesi yang cocok dengan token QR
    const targetSesi = currentSessions.find(
      (s) => s.tokenQR.toLowerCase() === cleanToken.toLowerCase() || s.id === cleanToken
    );

    if (!targetSesi) {
      get().showToast('Token QR Code tidak valid atau sesi tidak terdaftar di sistem.', 'error');
      return {
        success: false,
        message: 'QR Code tidak valid atau sesi tidak ditemukan.',
      };
    }

    // 2. Cek apakah peserta sudah pernah presensi di sesi ini
    const alreadyPresent = currentRecords.some((r) => r.sesiId === targetSesi.id);
    if (alreadyPresent) {
      get().showToast(`Anda sudah melakukan presensi pada sesi "${targetSesi.judulSesi}".`, 'info');
      return {
        success: false,
        message: 'Anda sudah tercatat hadir pada sesi ini sebelumnya.',
      };
    }

    // 3. Validasi status sesi
    if (targetSesi.status === 'selesai') {
      get().showToast('Sesi pelatihan ini sudah berakhir.', 'error');
      return {
        success: false,
        message: 'Sesi pelatihan ini sudah ditutup dan selesai.',
      };
    }

    // 4. Perhitungan Jarak GPS (Geofencing)
    let calculatedDistance = 25; // Default simulasi jarak dekat
    let statusKehadiran: 'hadir_tepat_waktu' | 'hadir_terlambat' | 'di_luar_radius' = 'hadir_tepat_waktu';

    if (userLat !== undefined && userLng !== undefined) {
      calculatedDistance = calculateDistanceMeters(
        userLat,
        userLng,
        targetSesi.latitude,
        targetSesi.longitude
      );
    } else if (metode === 'demo_simulasi') {
      calculatedDistance = Math.floor(Math.random() * 45) + 15;
    }

    // Cek radius geofence
    const isWithinRadius = calculatedDistance <= targetSesi.radiusMeter;
    if (!isWithinRadius) {
      statusKehadiran = 'di_luar_radius';
    }

    const now = new Date();
    const timeFormatted = `${now.toISOString().slice(0, 10)} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

    const newRecord: RiwayatPresensi = {
      id: `pres-${Date.now()}`,
      sesiId: targetSesi.id,
      judulSesi: targetSesi.judulSesi,
      kategoriSesi: targetSesi.kategori,
      lokasiNama: targetSesi.lokasiNama,
      waktuScan: timeFormatted,
      statusKehadiran,
      jarakMeter: calculatedDistance,
      latitude: userLat,
      longitude: userLng,
      metode,
      tokenQR: cleanToken,
      catatan: isWithinRadius
        ? `Presensi sukses dalam radius ${calculatedDistance}m dari lokasi acara (${targetSesi.lokasiNama}).`
        : `Presensi tercatat di luar radius (${calculatedDistance}m dari batas ${targetSesi.radiusMeter}m). Mohon konfirmasi panitia.`,
    };

    set((state) => ({
      riwayatPresensiList: [newRecord, ...state.riwayatPresensiList],
      sesiPresensiList: state.sesiPresensiList.map((s) =>
        s.id === targetSesi.id ? { ...s, totalPesertaHadir: s.totalPesertaHadir + 1 } : s
      ),
    }));

    if (isWithinRadius) {
      get().showToast(`Presensi Berhasil! Terverifikasi pada sesi: ${targetSesi.judulSesi}`, 'success');
    } else {
      get().showToast(
        `Presensi Tercatat (Peringatan): Anda berada di luar radius lokasi (${calculatedDistance}m)`,
        'info'
      );
    }

    return {
      success: true,
      message: isWithinRadius ? 'Presensi berhasil diverifikasi!' : 'Presensi tercatat di luar radius.',
      record: newRecord,
    };
  },

  deleteRiwayatPresensi: (id) => {
    set((state) => ({
      riwayatPresensiList: state.riwayatPresensiList.filter((r) => r.id !== id),
    }));
    get().showToast('Riwayat presensi dihapus.', 'info');
  },

  toastMessage: null,
  toastType: 'info',
  showToast: (message, type = 'info') => {
    set({ toastMessage: message, toastType: type });
    setTimeout(() => {
      set({ toastMessage: null });
    }, 3500);
  },
  hideToast: () => set({ toastMessage: null }),
}));
