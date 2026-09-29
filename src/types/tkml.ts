export type TahapanProgram = 'registrasi' | 'review_berkas' | 'tahap_rab' | 'tahap_lpj';

export type DetailAlamat = {
  jalan: string;
  rtRw: string;
  kelurahanDesa: string;
  kecamatan: string;
  kotaKabupaten: string;
  provinsi: string;
  kodePos: string;
  isComplete: boolean;
};

export type LegalitasItem = {
  nomor: string;
  namaTerdaftar: string;
  fileUri?: string;
  fileSizeFormatted?: string;
  uploadedAt?: string;
  status: 'lengkap' | 'belum_lengkap' | 'perlu_revisi';
  catatanRevisi?: string;
};

export type RekeningBankItem = {
  bankName: string;
  bankAccountNo: string;
  bankAccountName: string;
  bankKcp: string;
  bukuTabunganUri?: string;
  fileSizeFormatted?: string;
  uploadedAt?: string;
  status: 'lengkap' | 'belum_lengkap' | 'perlu_revisi';
  catatanRevisi?: string;
};

export type UserProfile = {
  id: string;
  namaLengkap: string;
  namaUsaha: string;
  idTKML: string;
  tahapanProgram: TahapanProgram;
  paguBantuanKemnaker: number;
  fotoUrl?: string;
  email?: string;
  noHp?: string;
  
  // Profil Usaha Dasar
  kbli?: string;
  sektorUsaha?: string;
  deskripsiUsaha?: string;
  tahunMulaiUsaha?: string;
  daerah?: string;

  // Modul Khusus: NIB, NPWP, Rekening
  nib: LegalitasItem;
  npwp: LegalitasItem;
  rekeningBank: RekeningBankItem;

  // 3 Detail Alamat Terstruktur
  alamatKtp: DetailAlamat;
  alamatUsaha: DetailAlamat;
  alamatDomisili: DetailAlamat;

  // Flag Status Kelengkapan & Revisi Global
  statusProfilUsaha: 'lengkap' | 'belum_lengkap' | 'perlu_revisi';
  statusAlamat: 'lengkap' | 'belum_lengkap' | 'perlu_revisi';
  catatanRevisiProfil?: string;
  catatanRevisiAlamat?: string;
};

export type StatusBerkas = 'belum_diunggah' | 'menunggu' | 'diverifikasi' | 'perlu_revisi';

export type BerkasItem = {
  id: string;
  key: string;
  nama: string;
  deskripsi?: string;
  status: StatusBerkas;
  catatanAdmin?: string;
  fileUri?: string;
  fileSizeFormatted?: string;
  uploadedAt?: string;
  required: boolean;
};

export type JenisDisabilitas =
  | 'tidak_ada'
  | 'fisik'
  | 'sensorik_netra'
  | 'sensorik_rungu_wicara'
  | 'intelektual'
  | 'mental';

export type JenisKelamin = 'L' | 'P';
export type StatusHubunganKerja = 'penuh_waktu' | 'paruh_waktu' | 'borongan' | 'musiman';

export type Karyawan = {
  id: string;
  nik: string;
  namaLengkap: string;
  jenisKelamin: JenisKelamin;
  tanggalLahir: string;
  noHp: string;
  disabilitas: JenisDisabilitas;
  posisi: string;
  statusKerja: StatusHubunganKerja;
  createdAt?: string;
};

export type ItemRAB = {
  id: string;
  namaBarang: string;
  spesifikasi: string;
  volume: number;
  satuan: string;
  hargaSatuan: number;
  subtotal: number;
  status: 'disetujui' | 'ditolak' | 'menunggu';
  catatan?: string;
};

export type NotaLPJ = {
  id: string;
  rabItemId: string;
  namaToko: string;
  nominalRiil: number;
  tanggalTransaksi: string;
  fotoNotaUri: string;
  fotoBarangUri: string;
  catatan?: string;
  createdAt: string;
};

export type ProdukUsaha = {
  id: string;
  namaProduk: string;
  kategori: string;
  deskripsiKeunggulan: string;
  hargaJual: number;
  kapasitasProduksi: string;
  fotoUris: string[];
  isPrimary?: boolean;
};

export type KategoriBizHub =
  | 'semua'
  | 'bahan_baku'
  | 'kemasan'
  | 'mesin_alat'
  | 'jasa_maklon'
  | 'produk_jadi';

export type SektorUsahaBizHub =
  | 'semua'
  | 'Kuliner & Pengolahan Pangan'
  | 'Pertanian & Agribisnis'
  | 'Kemasan & Percetakan'
  | 'Fashion & Tekstil'
  | 'Kriya & Kerajinan'
  | 'Jasa & Manufaktur';

export type BizHubAd = {
  id: string;
  namaUsaha: string;
  namaPemilik: string;
  idTKML: string;
  judulProduk: string;
  kategori: KategoriBizHub;
  sektorUsaha: string;
  deskripsi: string;
  harga: number;
  satuanHarga: string;
  lokasiDaerah: string;
  jarakKm: number;
  noWhatsapp: string;
  fotoProdukUri: string;
  isVerifiedTKML: boolean;
  b2bReady: boolean;
  createdAt: string;
};

export type TipeMilestoneBizHub = 'omzet' | 'karyawan' | 'omzet_dan_karyawan' | 'ekspansi';

export type BizHubMilestone = {
  id: string;
  idTKML: string;
  namaUsaha: string;
  namaPemilik: string;
  sektorUsaha: string;
  lokasiDaerah: string;
  jarakKm: number;
  tipeUpdate: TipeMilestoneBizHub;
  judul: string;
  deskripsi: string;
  omzetBulanIni?: number;
  kenaikanOmzetPersen?: number;
  penambahanKaryawan?: number;
  totalKaryawanSekarang?: number;
  fotoUri?: string;
  isVerifiedTKML: boolean;
  noWhatsapp?: string;
  likesCount: number;
  isLiked?: boolean;
  createdAt: string;
};

export type BizHubFilterState = {
  sektorUsaha: string;
  kategori: KategoriBizHub;
  radiusKm: number;
  sortBy: 'terbaru' | 'terdekat' | 'omzet_tertinggi';
};

// ==========================================
// Fitur Presensi Kehadiran QR Code TKML
// ==========================================

export type StatusKehadiran = 'hadir_tepat_waktu' | 'hadir_terlambat' | 'di_luar_radius';
export type MetodePresensi = 'qr_camera' | 'kode_manual' | 'demo_simulasi';
export type KategoriSesiPresensi = 'bimtek' | 'pendampingan' | 'evaluasi' | 'verifikasi_lapangan';
export type StatusSesi = 'aktif' | 'selesai' | 'akan_datang';

export type SesiPresensi = {
  id: string;
  judulSesi: string;
  namaFasilitator: string;
  instansi: string;
  lokasiNama: string;
  alamatLokasi: string;
  latitude: number;
  longitude: number;
  radiusMeter: number;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  tokenQR: string;
  kategori: KategoriSesiPresensi;
  status: StatusSesi;
  deskripsi: string;
  totalPesertaHadir: number;
  kuotaPeserta: number;
};

export type RiwayatPresensi = {
  id: string;
  sesiId: string;
  judulSesi: string;
  kategoriSesi: KategoriSesiPresensi;
  lokasiNama: string;
  waktuScan: string;
  statusKehadiran: StatusKehadiran;
  jarakMeter: number;
  latitude?: number;
  longitude?: number;
  metode: MetodePresensi;
  tokenQR: string;
  catatan?: string;
};
