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

export type BizHubAd = {
  id: string;
  namaUsaha: string;
  namaPemilik: string;
  idTKML: string;
  judulProduk: string;
  kategori: KategoriBizHub;
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
