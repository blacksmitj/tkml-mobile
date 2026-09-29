import { z } from 'zod';

export const KaryawanSchema = z.object({
  nik: z
    .string()
    .min(1, 'NIK wajib diisi')
    .length(16, 'NIK harus tepat 16 digit angka')
    .regex(/^[0-9]+$/, 'NIK hanya boleh berisi karakter angka'),
  namaLengkap: z
    .string()
    .min(1, 'Nama lengkap wajib diisi')
    .min(3, 'Nama lengkap minimal 3 karakter'),
  jenisKelamin: z.enum(['L', 'P'], {
    message: 'Pilih jenis kelamin',
  }),
  tanggalLahir: z
    .string()
    .min(1, 'Tanggal lahir wajib diisi')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal lahir harus YYYY-MM-DD'),
  noHp: z
    .string()
    .min(1, 'Nomor HP/WhatsApp wajib diisi')
    .min(10, 'Nomor HP minimal 10 digit')
    .max(14, 'Nomor HP maksimal 14 digit')
    .regex(/^[0-9]+$/, 'Nomor HP hanya boleh angka'),
  disabilitas: z.enum(
    [
      'tidak_ada',
      'fisik',
      'sensorik_netra',
      'sensorik_rungu_wicara',
      'intelektual',
      'mental',
    ],
    {
      message: 'Pilih kategori disabilitas',
    }
  ),
  posisi: z.string().min(1, 'Posisi / jabatan kerja wajib diisi'),
  statusKerja: z.enum(['penuh_waktu', 'paruh_waktu', 'borongan', 'musiman'], {
    message: 'Pilih status hubungan kerja',
  }),
});

export type KaryawanFormData = z.infer<typeof KaryawanSchema>;

export const LpjNotaSchema = z.object({
  rabItemId: z.string().min(1, 'Pilih item anggaran RAB terkait'),
  namaToko: z.string().min(1, 'Nama toko / penyedia wajib diisi'),
  nominalRiil: z
    .number({
      message: 'Nominal belanja harus angka valid',
    })
    .positive('Nominal belanja harus lebih dari Rp 0'),
  tanggalTransaksi: z.string().min(1, 'Tanggal belanja wajib diisi'),
  fotoNotaUri: z.string().min(1, 'Foto nota/kuitansi wajib diunggah'),
  fotoBarangUri: z.string().min(1, 'Foto fisik barang/alat wajib diunggah'),
  catatan: z.string().optional(),
});

export type LpjNotaFormData = z.infer<typeof LpjNotaSchema>;

export const ProfilUsahaSchema = z.object({
  namaUsaha: z.string().min(1, 'Nama usaha wajib diisi'),
  kbli: z.string().min(1, 'KBLI usaha wajib dipilih'),
  sektorUsaha: z.string().min(1, 'Sektor usaha wajib diisi'),
  alamatKtp: z.string().min(1, 'Alamat domisili KTP wajib diisi'),
  alamatUsaha: z.string().min(1, 'Alamat fisik lokasi usaha wajib diisi'),
  bankName: z.string().min(1, 'Nama Bank wajib diisi'),
  bankAccountNo: z
    .string()
    .min(1, 'Nomor rekening wajib diisi')
    .regex(/^[0-9]+$/, 'Nomor rekening hanya boleh angka'),
  bankAccountName: z.string().min(1, 'Nama pemilik rekening wajib diisi'),
  bankKcp: z.string().min(1, 'Kantor Cabang Pembantu (KCP) wajib diisi'),
});

export type ProfilUsahaFormData = z.infer<typeof ProfilUsahaSchema>;
