# Catatan Keuangan — v2.3 (Vue 3 + Vite)
 
Aplikasi pencatat pemasukan, pengeluaran, budget bulanan, dan target tabungan.
Dibangun dengan Vue 3 (Composition API + `<script setup>`), Vue Router, dan
Vite. Backend pakai Supabase (Auth + Postgres + RPC).
 
## Menjalankan
 
```bash
npm install
cp .env.example .env   # isi VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY
npm run dev
```
 
Build produksi:
 
```bash
npm run build
npm run preview
```
 
## Ringkasan fitur
 
- Login & registrasi lewat Supabase Auth, route dilindungi oleh auth guard
  di `router/index.js`.
- Catatan transaksi (pemasukan/pengeluaran) dengan riwayat tidak bisa
  dihapus dari UI — ini sengaja, demi keamanan data riwayat keuangan.
- Budget bulanan dengan progress bar dan peringatan saat mendekati/lewat
  batas.
- Target Goals (tabungan) dengan proses setor & tarik dana.
- Sumber Dana (v2.3): tiap pemasukan diikat ke nama bank/dompet, muncul
  sebagai card ringkas di Beranda; Total Saldo dihitung dari gabungan
  semua card tersebut.
- Notifikasi pengingat mencatat keuangan 4x sehari lewat Web Push.
- Halaman Tentang berisi info aplikasi dan riwayat pembaruan (changelog),
  dengan banner otomatis saat ada versi baru.
- Loading state konsisten: skeleton untuk daftar/kartu saat data pertama
  kali dimuat, spinner kecil di tombol saat proses submit.
 
## Catatan migrasi database
 
Perubahan schema untuk tiap versi baru ditaruh di folder `sql/` sebagai
file terpisah (mis. `sql/v2.3_sumber_dana.sql`) — jalankan satu per satu
sesuai urutan versi di Supabase SQL Editor saat upgrade.
