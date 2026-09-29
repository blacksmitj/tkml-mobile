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
  KategoriBizHub,
} from '@/types/tkml';
import {
  INITIAL_USER,
  INITIAL_BERKAS,
  INITIAL_KARYAWAN,
  INITIAL_RAB,
  INITIAL_LPJ,
  INITIAL_PRODUK,
  INITIAL_BIZHUB_ADS,
} from '@/data/mock-data';

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
