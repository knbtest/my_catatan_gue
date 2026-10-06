<!-- src/views/AktivitasView.vue -->
<template>
  <AppLayout>
    <div class="page-title">Semua Aktivitas</div>

    <div class="card-aktivitas">
      <div class="card-head">
        <div class="card-head-title">Riwayat Seluruh Aktivitas Keuangan</div>
        <div class="action-buttons">
          <button class="btn btn-success btn-sm" @click="bukaModalTambah('pemasukan')">+ Pemasukan</button>
          <button class="btn btn-danger btn-sm" @click="bukaModalTambah('pengeluaran')">- Pengeluaran</button>
        </div>
      </div>

      <div class="list-wrapper">
        <PageLoader v-if="isLoading" text="Memuat data transaksi..." />

        <div v-else-if="listAktivitas.length === 0" class="empty-note">Belum ada transaksi di bulan ini.</div>

        <div v-else class="aktivitas-item" v-for="item in listAktivitas" :key="item.id">
          <div class="item-left">
            <div class="item-title">{{ item.deskripsi }}</div>
            <div class="item-meta">
              <span class="item-time">{{ formatTanggalJam(item.created_at) }}</span>
              <!-- Badge Sisa Waktu Live Countdown -->
              <span v-if="hitungSisaDetik(item.created_at) > 0" class="countdown-badge">
                ⏱️ Sisa waktu: <strong>{{ formatSisaWaktu(item.created_at) }}</strong>
              </span>
            </div>
          </div>

          <div class="item-right-group">
            <div class="item-price" :class="item.tipe === 'pemasukan' ? 'masuk' : 'keluar'">{{ item.tipe === "pemasukan" ? "+" : "-" }}{{ formatRupiah(item.jumlah) }}</div>

            <!-- Tombol Edit & Hapus hanya muncul jika umur transaksi <= 10 menit -->
            <div class="action-item-buttons" v-if="bolehEditAtauHapus(item.created_at)">
              <button class="btn-icon" @click="bukaModalEdit(item)" title="Edit Transaksi">✏</button>
              <button class="btn-icon text-danger" @click="konfirmasiHapus(item.id)" title="Hapus Transaksi">🗑️</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Modal Tambah Transaksi ===== -->
    <AppModal v-model="showModal" :title="modalTipe === 'pemasukan' ? 'Uang Masuk' : 'Uang Keluar'">
      <form @submit.prevent="handleSubmitTambah">
        <div class="field">
          <label :class="modalTipe === 'pemasukan' ? 'text-success' : 'text-danger'">Deskripsi</label>
          <input v-model="formDeskripsi" type="text" required :placeholder="modalTipe === 'pemasukan' ? 'Contoh: Gajihan...' : 'Contoh: Beli Mie...'" />
        </div>

        <div class="field" v-if="modalTipe === 'pemasukan'">
          <label class="text-success">Nama Bank / Dana</label>
          <ComboBox v-model="formNamaDana" :options="namaDanaOptions" placeholder="Contoh: Uang Saku/Bank" />
        </div>

        <div class="field" v-else>
          <label class="text-danger">Sumber Dana</label>
          <select v-model="formDanaId" required>
            <option value="" disabled>Pilih sumber dana</option>
            <option v-for="d in danaList" :key="d.id" :value="d.id">{{ d.nama }} (Rp {{ d.saldo.toLocaleString("id-ID") }})</option>
          </select>
        </div>

        <div class="field">
          <label :class="modalTipe === 'pemasukan' ? 'text-success' : 'text-danger'">Jumlah</label>
          <div class="input-prefix">
            <span>Rp</span>
            <input :value="formJumlahTampil" @input="onJumlahInput" type="text" inputmode="numeric" autocomplete="off" placeholder="0" required />
          </div>
        </div>
        <button type="submit" class="btn btn-block" :class="modalTipe === 'pemasukan' ? 'btn-success' : 'btn-danger'" :disabled="isSubmitting">
          <BaseSpinner v-if="isSubmitting" />
          {{ isSubmitting ? "Memproses..." : "Simpan" }}
        </button>
      </form>
    </AppModal>

    <!-- ===== Modal Edit Transaksi ===== -->
    <AppModal v-model="showEditModal" title="Edit Transaksi (Batas 10 Menit)">
      <form @submit.prevent="handleSubmitEdit">
        <div class="field">
          <label>Deskripsi</label>
          <input v-model="editDeskripsi" type="text" required />
        </div>

        <div class="field">
          <label>Jumlah</label>
          <div class="input-prefix">
            <span>Rp</span>
            <input :value="editJumlahTampil" @input="onEditJumlahInput" type="text" inputmode="numeric" autocomplete="off" required />
          </div>
        </div>

        <button type="submit" class="btn btn-primary btn-block" :disabled="isSubmitting">
          <BaseSpinner v-if="isSubmitting" />
          {{ isSubmitting ? "Menyimpan..." : "Perbarui Transaksi" }}
        </button>
      </form>
    </AppModal>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { supabase } from "../lib/supabase";
import { useAuth } from "../composables/useAuth";
import { useToast } from "../composables/useToast";
import { useSumberDana } from "../composables/useSumberDana";
import { formatRupiah, formatTanggalJam, getRentangBulanIni, parseAngkaFormat, formatRibuan } from "../utils/format";
import AppLayout from "../components/AppLayout.vue";
import AppModal from "../components/AppModal.vue";
import PageLoader from "../components/PageLoader.vue";
import BaseSpinner from "../components/BaseSpinner.vue";
import ComboBox from "../components/ComboBox.vue";

const { user } = useAuth();
const { showToast } = useToast();
const { danaList, fetchDana, tambahPemasukan, tambahPengeluaran } = useSumberDana();
const namaDanaOptions = computed(() => danaList.value.map((d) => d.nama));

const isLoading = ref(true);
const listAktivitas = ref([]);
const currentTime = ref(Date.now());
let timerInterval = null;

// State Modal Tambah
const showModal = ref(false);
const modalTipe = ref("pemasukan");
const formDeskripsi = ref("");
const formNamaDana = ref("");
const formDanaId = ref("");
const formJumlahTampil = ref("");
const formJumlahAngka = ref(0);

// State Modal Edit
const showEditModal = ref(false);
const editId = ref(null);
const editDeskripsi = ref("");
const editJumlahTampil = ref("");
const editJumlahAngka = ref(0);

const isSubmitting = ref(false);

// Cek apakah transaksi masih di bawah 10 menit
function bolehEditAtauHapus(createdAt) {
  const waktuBuat = new Date(createdAt).getTime();
  const selisihMenit = (currentTime.value - waktuBuat) / (1000 * 60);
  return selisihMenit <= 10;
}

// Hitung sisa detik untuk countdown
function hitungSisaDetik(createdAt) {
  const waktuBuat = new Date(createdAt).getTime();
  const batasWaktu = waktuBuat + 10 * 60 * 1000;
  const sisa = Math.floor((batasWaktu - currentTime.value) / 1000);
  return sisa > 0 ? sisa : 0;
}

// Format detik jadi MM:SS
function formatSisaWaktu(createdAt) {
  const totalDetik = hitungSisaDetik(createdAt);
  const menit = Math.floor(totalDetik / 60);
  const detik = totalDetik % 60;
  return `${String(menit).padStart(2, "0")}:${String(detik).padStart(2, "0")}`;
}

async function muatData() {
  isLoading.value = true;
  const { awal, akhir } = getRentangBulanIni();
  const { data, error } = await supabase.from("transaksi").select("*").eq("user_id", user.value.id).gte("created_at", awal).lt("created_at", akhir).order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal memuat data transaksi:", error.message);
    showToast({ type: "error", title: "Gagal memuat data", text: error.message });
    isLoading.value = false;
    return;
  }

  listAktivitas.value = data || [];
  isLoading.value = false;
}

function bukaModalTambah(tipe) {
  modalTipe.value = tipe;
  formDeskripsi.value = "";
  formNamaDana.value = "";
  formDanaId.value = "";
  formJumlahTampil.value = "";
  formJumlahAngka.value = 0;
  showModal.value = true;
}

function onJumlahInput(e) {
  const angka = parseAngkaFormat(e.target.value);
  formJumlahAngka.value = angka;
  formJumlahTampil.value = angka ? formatRibuan(angka) : "";
}

async function handleSubmitTambah() {
  const jumlah = formJumlahAngka.value;
  const deskripsi = formDeskripsi.value.trim();

  if (!jumlah || jumlah <= 0 || !deskripsi) {
    showToast({ type: "warning", title: "Input Belum Lengkap", text: "Mohon isi deskripsi dan jumlah uang dengan benar ya!" });
    return;
  }

  let error = null;
  isSubmitting.value = true;

  if (modalTipe.value === "pemasukan") {
    const nama = formNamaDana.value.trim();
    if (!nama) {
      showToast({ type: "warning", title: "Input Belum Lengkap", text: "Isi nama bank/dana dulu ya!" });
      isSubmitting.value = false;
      return;
    }
    error = await tambahPemasukan(nama, deskripsi, jumlah);
  } else {
    if (!formDanaId.value) {
      showToast({ type: "warning", title: "Input Belum Lengkap", text: "Pilih sumber dana dulu ya!" });
      isSubmitting.value = false;
      return;
    }
    error = await tambahPengeluaran(formDanaId.value, deskripsi, jumlah);
  }

  isSubmitting.value = false;

  if (error) {
    showToast({ type: "error", title: "Waduh, Gagal!", text: error.message || String(error) });
    return;
  }

  showModal.value = false;
  showToast({ type: "success", title: "Mantap!", text: `Transaksi berhasil disimpan!` });
  await muatData();
}

// Handler Edit
function bukaModalEdit(item) {
  editId.value = item.id;
  editDeskripsi.value = item.deskripsi;
  editJumlahAngka.value = item.jumlah;
  editJumlahTampil.value = formatRibuan(item.jumlah);
  showEditModal.value = true;
}

function onEditJumlahInput(e) {
  const angka = parseAngkaFormat(e.target.value);
  editJumlahAngka.value = angka;
  editJumlahTampil.value = angka ? formatRibuan(angka) : "";
}

async function handleSubmitEdit() {
  if (!editDeskripsi.value.trim() || editJumlahAngka.value <= 0) {
    showToast({ type: "warning", title: "Peringatan", text: "Data edit belum lengkap." });
    return;
  }

  isSubmitting.value = true;
  const { data, error } = await supabase.rpc("update_transaksi_limit", {
    p_transaksi_id: editId.value,
    p_user_id: user.value.id,
    p_deskripsi: editDeskripsi.value.trim(),
    p_jumlah: editJumlahAngka.value,
  });

  isSubmitting.value = false;

  if (error || !data.success) {
    showToast({ type: "error", title: "Gagal Edit", text: data?.message || error.message });
    return;
  }

  showEditModal.value = false;
  showToast({ type: "success", title: "Berhasil", text: "Transaksi berhasil diperbarui." });
  await muatData();
}

// Handler Hapus
async function konfirmasiHapus(id) {
  if (!confirm("Yakin ingin menghapus transaksi ini?")) return;

  const { data, error } = await supabase.rpc("hapus_transaksi_limit", {
    p_transaksi_id: id,
    p_user_id: user.value.id,
  });

  if (error || !data.success) {
    showToast({ type: "error", title: "Gagal Hapus", text: data?.message || error?.message });
    return;
  }

  showToast({ type: "success", title: "Terhapus", text: "Transaksi berhasil dihapus." });
  await muatData();
}

onMounted(() => {
  muatData();
  fetchDana();
  // Jalankan interval untuk memperbarui waktu live setiap detik
  timerInterval = setInterval(() => {
    currentTime.value = Date.now();
  }, 1000);
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped>
.page-title {
  background: rgba(255, 255, 255, 0.6);
  font-size: 15px;
  font-weight: bold;
  color: var(--color-primary);
  padding: 8px 14px;
  border-radius: 8px;
  width: fit-content;
}

.card-aktivitas {
  flex: 1;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 20px;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  overflow: visible;
  height: calc(100vh - 160px);
  min-height: 0;
  overflow: hidden;
}

.card-head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #eef1f5;
  padding-bottom: 14px;
  margin-bottom: 14px;
}

.card-head-title {
  color: var(--color-primary-dark);
  font-weight: bold;
  font-size: 18px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

.aktivitas-item {
  background: #01d9ff;
  border: 2px solid #5dbaf0;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-title {
  font-weight: 600;
  color: #333;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.item-time {
  font-size: 0.78rem;
  color: #ffffff;
}

/* Style Badge Sisa Waktu Countdown */
.countdown-badge {
  font-size: 0.72rem;
  background: #fff8eb;
  color: #b45309;
  border: 1px solid #fde68a;
  padding: 2px 8px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.item-right-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-item-buttons {
  display: flex;
  gap: 6px;
}

.btn-icon {
  background: #f4f6fb;
  border: none;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.2s;
}

.btn-icon:hover {
  background: #e2e8f0;
}

.item-price {
  font-weight: bold;
  font-size: 0.95rem;
}

.masuk {
  color: var(--color-success) !important;
}
.keluar {
  color: var(--color-danger) !important;
}

.empty-note {
  text-align: center;
  color: #888;
  padding: 40px 0;
}

.input-prefix {
  display: flex;
  align-items: center;
  border: 1.5px solid var(--color-border);
  border-radius: 10px;
  overflow: hidden;
}
.input-prefix span {
  padding: 11px 14px;
  background: #f4f6fb;
  font-weight: 700;
  color: #8892a4;
  border-right: 1.5px solid var(--color-border);
}
.input-prefix input {
  flex: 1;
  padding: 11px 14px;
  border: none !important;
  outline: none;
  font-size: 0.92rem;
}

.field select {
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: 10px;
  font-size: 0.92rem;
  background: #fff;
  color: #333;
}

.text-success {
  color: var(--color-success) !important;
}
.text-danger {
  color: var(--color-danger) !important;
}

.btn-block {
  width: 100%;
  padding: 13px;
  margin-top: 6px;
}

@media (max-width: 768px) {
  .action-buttons {
    width: 100%;
  }
  .action-buttons button {
    flex: 1;
  }
  .card-head-title {
    width: 100%;
    text-align: center;
  }
}
</style>
