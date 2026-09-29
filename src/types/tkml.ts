export type TahapanProgram = 'registrasi' | 'review_berkas' | 'tahap_rab' | 'tahap_lpj';

export type UserProfile = {
  id: string;
  namaLengkap: string;
  namaUsaha: string;
  idTKML: string;
  tahapanProgram: TahapanProgram;
  fotoUrl?: string;
  email?: string;
  noHp?: string;
  kbli?: string;
  sektorUsaha?: string;
  alamatKtp?: string;
  alamatUsaha?: string;
  bankName?: string;
  bankAccountNo?: string;
  bankAccountName?: string;
  bankKcp?: string;
  daerah?: string; // e.g., 'Kab. Bandung Barat'
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
};

export type KategoriBizHub =
  | 'semua'
  | 'bahan_baku'
  | 'kemasan'
  | 'mesin_alat'
  | 'jasa_maklon'
  | 'produk_jadi';

export type BizHubAd = {
  id: string;
  namaUsaha: string;
  namaPemilik: string;
  idTKML: string;
  judulProduk: string;
  kategori: KategoriBizHub;
  deskripsi: string;
  harga: number;
  satuanHarga: string; // e.g., 'per kg', 'per 100 pcs', 'per unit'
  lokasiDaerah: string; // e.g., 'Kec. Lembang, Kab. Bandung Barat'
  jarakKm: number; // e.g., 2.5
  noWhatsapp: string;
  fotoProdukUri: string;
  isVerifiedTKML: boolean;
  b2bReady: boolean;
  createdAt: string;
};
