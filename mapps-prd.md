BAGIAN 1: PRD UI/UX Mobile Apps (Peserta TKML)
1. Ringkasan Produk & Pengguna Sasaran
Platform: Mobile Application (Android prioritas utama, iOS ready).

Target Pengguna: Peserta program Tenaga Kerja Mandiri Lanjutan (TKML) Kemnaker.

Karakteristik Pengguna: Literasi digital beragam, berada di berbagai wilayah dengan kualitas jaringan bervariasi, membutuhkan antarmuka yang bersih, instruksi jelas, dan proses upload yang ringan.

2. Arsitektur Informasi & Alur Layar (Screen Flow)
[ Splash Screen ]
       │
       ▼
[ Login SSO SIAPkerja ] ──(In-App Browser / Custom Tab)
       │
       ▼
[ Dashboard Utama ]
 ├── Tab 1: Beranda (Status Progres Stepper & Notifikasi Revisi)
 ├── Tab 2: Berkas & Usaha (Upload Dokumen, Profil Usaha, Edit Produk)
 ├── Tab 3: Karyawan (Daftar & Form Input Tenaga Kerja / Disabilitas)
 ├── Tab 4: RAB & LPJ (Usulan Anggaran, Realisasi Nota & Foto Belanja)
 └── Tab 5: Akun (Profil SIAPkerja, Bantuan, Logout)
3. Spesifikasi Layar & Komponen UI
Layar 1: Autentikasi (Login SSO SIAPkerja)
Elemen UI:

Logo Kemnaker / Program TKML.

Kartu informasi singkat program.

Tombol Utama: "Masuk dengan Akun SIAPkerja" (Warna khas biru Kemnaker).

Link bantuan/panduan: "Belum punya akun SIAPkerja?"

Behavior: Menekan tombol membuka web browser aman (OAuth2 PKCE). Setelah sukses, langsung diarahkan ke Dashboard.

Layar 2: Beranda (Status Stepper & Action Center)
Elemen UI:

Header: Sapaan nama peserta, nama usaha, ID TKML, dan badge status tahapan program (Registrasi, Review Berkas, Tahap RAB, Tahap LPJ).

Stepper Progres Interaktif: 4 milestone utama dengan indikator warna (Hijau: Terverifikasi, Kuning: Sedang Ditinjau, Merah: Perlu Revisi, Abu-abu: Belum Terbuka).

Alert Card (Revisi): Hanya muncul jika ada catatan dari admin (cth: "Foto Rekening Bank buram, silakan unggah ulang").

Shortcut Quick Actions: Tombol cepat "Upload Berkas", "Kelola Karyawan", "Input LPJ".

Layar 3: Berkas Usaha & Identitas
Elemen UI:

List berkas dalam bentuk kartu: Foto KTP, Kartu Keluarga, Foto Diri, NPWP, NIB, Rekening Bank, dll.

Status per kartu: Belum Diunggah, Menunggu Verifikasi, Diverifikasi (OK), Perlu Revisi (HOLD).

Komponen Upload: Tombol "Buka Kamera" atau "Pilih dari Galeri".

Image Cropper & Preview: Modal untuk crop/rotasi gambar sebelum diunggah.

Kompresi Otomatis: UI menampilkan indikator kompresi (misal: "Mengompres gambar dari 4.2 MB menjadi 320 KB").

Layar 4: Profil Usaha & Edit Produk Utama
Form Profil Usaha: Nama usaha, KBLI, sektor usaha, alamat KTP vs alamat fisik usaha, data rekening bank (Bank, No. Rek, KCP).

Katalog Produk Utama:

Foto produk utama (bisa multi-foto).

Input: Nama produk, kategori, deskripsi keunggulan, harga jual, kapasitas produksi per minggu/bulan.

Layar 5: Manajemen Data Karyawan
Daftar Karyawan: Card list menampilkan nama, NIK, jabatan, dan chip indikator (misal: Disabilitas: Netra, Penuh Waktu).

Floating Action Button (FAB): Tombol + Tambah Karyawan.

Form Tambah/Edit Karyawan:

NIK (Validasi otomatis 16 digit angka).

Nama lengkap, jenis kelamin (Radio button).

Tanggal lahir (Date picker), nomor HP.

Dropdown Disabilitas: Tidak Ada, Fisik, Sensorik Netra, Sensorik Rungu/Wicara, dll.

Posisi/bagian kerja & status hubungan kerja.

Layar 6: RAB & Pelaporan Belanja (LPJ)
Tab 1 — Usulan RAB:

Card ringkasan total anggaran disetujui vs terpakai.

List item RAB (Nama barang, spesifikasi, volume, satuan, harga satuan, subtotal).

Tab 2 — Realisasi Nota & Dokumentasi Belanja (LPJ):

Tautkan nota ke item RAB terkait.

Input nominal riil pada nota dan nama toko.

Upload 2 foto wajib per belanjaan: Foto Nota/Kuitansi dan Foto Fisik Barang/Alat.

4. Kebutuhan Non-Fungsional UI Mobile
Offline Drafting: Pengisian form yang belum dikirim disimpan di local storage (AsyncStorage/MMKV).

Bandwidth Optimization: Semua upload gambar otomatis dikompres di sisi HP sebelum dikirim (maks. 800 KB).

Validasi Formulir di Sisi Klien: Error handling real-time (contoh: NIK kurang digit langsung muncul tulisan merah di bawah input sebelum tombol kirim ditekan).