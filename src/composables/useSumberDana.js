// src/composables/useSumberDana.js
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
 
// State di luar function = singleton, dipakai bareng oleh DanaCards.vue,
// DashboardView.vue, dan AktivitasView.vue tanpa fetch berulang-ulang.
const danaList = ref([])
const isLoading = ref(true)
 
export function useSumberDana() {
  const totalSaldo = computed(() => danaList.value.reduce((sum, d) => sum + d.saldo, 0))
 
  async function fetchDana() {
    isLoading.value = true
    const { data, error } = await supabase.from('sumber_dana').select('*').order('nama')
    if (error) console.error('Gagal ambil sumber dana:', error.message)
    danaList.value = data || []
    isLoading.value = false
  }
 
  /** Pemasukan: nama dana bebas, auto-create card kalau belum ada. */
  async function tambahPemasukan(nama, deskripsi, jumlah) {
    const { error } = await supabase.rpc('catat_pemasukan', {
      p_nama_dana: nama,
      p_deskripsi: deskripsi,
      p_jumlah: jumlah,
    })
    if (!error) await fetchDana()
    return error
  }
 
  /** Pengeluaran: wajib pilih dana_id yang sudah ada, validasi saldo di server. */
  async function tambahPengeluaran(danaId, deskripsi, jumlah) {
    const { error } = await supabase.rpc('catat_pengeluaran', {
      p_dana_id: danaId,
      p_deskripsi: deskripsi,
      p_jumlah: jumlah,
    })
    if (!error) await fetchDana()
    return error
  }
 
  return { danaList, isLoading, totalSaldo, fetchDana, tambahPemasukan, tambahPengeluaran }
}
