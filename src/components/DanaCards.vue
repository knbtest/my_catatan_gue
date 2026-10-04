<!-- src/components/DanaCards.vue
     Presentational saja — datanya sudah di-fetch oleh view yang memanggilnya
     (DashboardView.vue), lewat state singleton di useSumberDana. -->
<template>
  <div v-if="isLoading" class="dana-grid">
    <div class="dana-skel" v-for="n in 3" :key="n"></div>
  </div>
 
  <div v-else-if="danaList.length" class="dana-grid">
    <div class="dana-card" v-for="d in danaList" :key="d.id">
      <span class="dana-nama">{{ d.nama }}</span>
      <span class="dana-saldo">Rp {{ d.saldo.toLocaleString('id-ID') }}</span>
    </div>
  </div>
</template>
 
<script setup>
import { useSumberDana } from '../composables/useSumberDana'
 
const { danaList, isLoading } = useSumberDana()
</script>
 
<style scoped>
.dana-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}
 
.dana-card {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
 
.dana-nama {
  font-size: 0.82rem;
  color: #8a8a8a;
  font-weight: 600;
}
 
.dana-saldo {
  font-size: 1.05rem;
  font-weight: 700;
  color: #333;
}
 
.dana-skel {
  height: 64px;
  border-radius: 12px;
  background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
  background-size: 200% 100%;
  animation: dana-shimmer 1.3s infinite;
}
 
@keyframes dana-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
