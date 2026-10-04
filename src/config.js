// src/config.js
export const APP_CONFIG = {
  appName: "Catatan Keuangan",
  version: "v2.3",
  releaseDate: "4 Okt 2026",
  developer: "Zaki Nur Faizi",
  year: "2026",

  // Riwayat Pembaruan / Changelog Aplikasi
  changelog: [
    {
      version: "v2.3",
      date: "4 Oktober 2026",
      features: [
        "Menambahkan fitur Sumber Dana: tiap pemasukan sekarang bisa diikat ke nama bank/dompet (mis. Seabank), otomatis muncul sebagai card di Beranda",
        "Total Saldo di Beranda sekarang dihitung dari gabungan semua card sumber dana, bukan dari seluruh riwayat transaksi lagi",
        "Pengeluaran kini wajib memilih sumber dana yang mau dipakai, biar saldo per bank selalu akurat",
        "Isi Tabungan & Tarik Dana di menu Target/Tabungan sekarang juga terhubung ke Sumber Dana, saldo bank ikut terpotong/terisi otomatis",
        "Memperbaiki tampilan pilihan nama bank/dana saat input pemasukan, sekarang lebih rapi dan gampang dicari",
      ],
      bugs: ["Memastikan saldo lama sebelum fitur ini tidak hilang (otomatis dipindah ke card 'Saldo Lama')", "Memperketat pengecekan saldo untuk pengeluaran, supaya nggak bisa kebobolan transaksi yang nominalnya lebih besar dari saldo"],
    },
    {
      version: "v2.2",
      date: "2 Oktober 2026",
      features: ["Menambahkan Halaman Tentang aplikasi website ini dan style yang berbeda sedikit di halaman tentang aplikasinya"],
      bugs: ["Memperbaiki kendala pada router index.js dan layoutnya", "Memperbaiki di halaman about tombol kembalinya"],
    },
    {
      version: "v2.1",
      date: "26 September 2026",
      features: [
        "Menambahkan fitur notifikasi pengingat otomatis agar tidak lupa mencatat keuangan harian",
        "Menambahkan pengaman agar tabungan pribadi tidak bisa terhapus secara tidak sengaja",
        "Menambahkan tombol dan fitur untuk mengedit serta menghapus data tabungan dengan lebih mudah",
      ],
      bugs: [
        "Memperbaiki kendala pada fitur tabungan yang sebelumnya tidak bisa dihapus dan ditambahkan tombol edit",
        "Memperbaiki tombol pada fitur notifikasi agar bisa diklik dengan normal",
        "Peningkatan kestabilan aplikasi secara keseluruhan",
        "Memperbaiki kendala teknis pada sistem navigasi halaman",
      ],
    },
    {
      version: "v2.0",
      date: "25 September 2026",
      features: [
        "Pembaruan total tampilan aplikasi menjadi jauh lebih modern, cepat, dan responsif",
        "Menambahkan pengingat notifikasi otomatis langsung ke perangkat hingga 4 kali sehari",
        "Memperbarui tampilan jendela popup dan pesan notifikasi agar lebih nyaman dilihat",
        "Mengoptimalkan kecepatan pengelolaan data transaksi, anggaran, dan target tabungan",
      ],
      bugs: ["Memperbaiki izin akses notifikasi di browser agar bisa berjalan dengan lancar", "Membersihkan berkas aplikasi yang tidak terpakai agar performa jauh lebih ringan"],
    },
    {
      version: "v1.1",
      date: "24 September 2026",
      features: ["Penyempurnaan sistem perhitungan penyimpanan tabungan dan penarikan dana target", "Menjaga riwayat transaksi agar tetap aman dan tidak dapat dihapus sembarangan demi keamanan data keuangan"],
      bugs: ["Memperbaiki selisih perhitungan total saldo keseluruhan dengan transaksi di bulan berjalan"],
    },
    {
      version: "v1.0",
      date: "Awal Pengembangan",
      features: ["Peluncuran perdana aplikasi Catatan Keuangan berbasis web", "Menghadirkan menu Beranda, Catatan Transaksi, Target Tabungan, dan Pengaturan Anggaran Bulanan"],
      bugs: ["Pengaturan awal basis data penyimpanan akun pengguna"],
    },
  ],
};

// CATATAN DEV (private, nggak ditampilkan ke user):
// - v1.1.1 -> v2.0.0: full rewrite dari HTML+jQuery-ish vanilla JS ke Vue 3
//   (Composition API + <script setup>) + Vue Router + Vite.
// - Bootstrap JS & SweetAlert2 dilepas, diganti komponen Vue sendiri
//   (AppModal, ToastStack) biar nggak dobel dependency cuma buat modal/alert.
// - Logika bisnis (goals, budget, transaksi) TIDAK diubah — hanya dipindah
//   dari DOM manipulation manual ke reactive state Vue. RPC Supabase
//   (proses_tabungan, tarik_tabungan) tetap dipakai apa adanya.
// - Transaksi tetap TIDAK BISA dihapus dari UI (sengaja, sesuai desain awal
//   biar riwayat keuangan user nggak bisa diutak-atik/dihapus diam-diam).
