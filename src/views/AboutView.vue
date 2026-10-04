<!-- src/views/AboutView.vue -->
<template>
  <div class="about-page-wrapper">
    <!-- Tombol Kembali Dinamis -->
    <div class="top-nav">
      <button @click="goBack" class="back-btn">&larr; Kembali</button>
    </div>

    <div class="about-container">
      <!-- Header Section -->
      <div class="about-card hero-card">
        <div class="hero-icon">💰</div>
        <h1>My Catatan Gua</h1>
        <!-- <h1>{{ config.appName }}</h1> -->
        <p class="badge-version">Versi {{ config.version }}</p>
        <p class="description">
          <strong>My Catatan Gua</strong> — Platform pencatatan finansial digital untuk membantu siapa saja dalam mengelola pemasukan, pengeluaran, dan target tabungan dengan lebih mudah serta teratur. Catatan: Aplikasi ini murni wadah
          pencatatan keuangan pribadi, bukan dompet digital, bank, atau layanan transaksi uang asli.
        </p>

        <div class="meta-info">
          <div class="meta-item">
            <span>📅 Awal Pembuatan:</span>
            <strong>11 Juni 2026</strong>
          </div>
          <div class="meta-item">
            <span>🚀 Update Terakhir:</span>
            <strong>{{ config.releaseDate }}</strong>
          </div>
          <div class="meta-item">
            <span>👨‍💻 Pengembang:</span>
            <a href="https://zackynurfazz.netlify.app" target="_blank" rel="noopener noreferrer" class="dev-link"> {{ config.developer }} ↗ </a>
          </div>
        </div>
      </div>

      <!-- Changelog / Update Terbaru Section -->
      <div class="about-card">
        <div class="changelog-top-title">
          <h2>✨ Riwayat Pembaruan & Update Terbaru</h2>
          <span class="update-badge-highlight">Update {{ config.version }} Live!</span>
        </div>
        <p class="section-subtitle">Daftar pembaruan fitur dari setiap versi aplikasi.</p>

        <div class="changelog-list">
          <div v-for="(item, index) in config.changelog" :key="index" class="changelog-item">
            <div class="changelog-header" @click="toggleChangelog(index)">
              <div class="version-badge-group">
                <span class="v-tag">{{ item.version }}</span>
                <span class="v-date">{{ item.date }}</span>
              </div>
              <span class="toggle-icon">{{ activeChangelog === index ? "▲" : "▼" }}</span>
            </div>

            <div v-show="activeChangelog === index" class="changelog-body">
              <div v-if="item.features && item.features.length > 0" class="sub-section">
                <h4>🎯 Fitur & Pembaruan Baru:</h4>
                <ul>
                  <li v-for="(feat, fIdx) in item.features" :key="fIdx">{{ feat }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Copyright -->
      <div class="about-footer">
        <p>
          &copy; {{ config.year }} {{ config.appName }} &bull; Dikembangkan oleh
          <strong>
            <a href="https://zackynurfazz.netlify.app" style="text-decoration: none" target="_blank" rel="noopener noreferrer">{{ config.developer }}</a> </strong
          >.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { APP_CONFIG as config } from "../config";

// Default membuka accordion index ke-0 (Versi terbaru)
const router = useRouter();
const activeChangelog = ref(0);

function toggleChangelog(index) {
  activeChangelog.value = activeChangelog.value === index ? null : index;
}
function goBack() {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push("/");
  }
}
</script>

<style scoped>
.about-page-wrapper {
  min-height: 100vh;
  padding: 30px 20px 40px;
  background-color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.top-nav {
  max-width: 800px;
  width: 100%;
  margin-bottom: 20px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  color: #1e1b4b;
  padding: 8px 16px;
  border-radius: 10px;
  border: 2px solid #1e1b4b;
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  box-shadow: 3px 3px 0px #1e1b4b;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: #f3e8ff;
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0px #1e1b4b;
}

.back-btn:active {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0px #1e1b4b;
}

.about-container {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.about-card {
  background: #ffffff;
  border: 2px solid #1e1b4b;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 4px 4px 0px #1e1b4b;
}

.hero-card {
  text-align: center;
  background: linear-gradient(135deg, #fafafe 0%, #f3e8ff 100%);
}

.hero-icon {
  font-size: 3.5rem;
  margin-bottom: 8px;
}

.hero-card h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #1e1b4b;
  margin-bottom: 4px;
}

.badge-version {
  display: inline-block;
  background: #7c3aed;
  color: #fff;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  border: 1.5px solid #1e1b4b;
  margin-bottom: 14px;
}

.description {
  color: #4b5563;
  font-size: 0.95rem;
  max-width: 650px;
  margin: 0 auto 20px;
  line-height: 1.6;
}

.meta-info {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  padding-top: 15px;
  border-top: 2px dashed #d8b4fe;
}

.meta-item {
  font-size: 0.9rem;
  color: #374151;
  display: flex;
  gap: 6px;
  align-items: center;
}

.dev-link {
  color: #7c3aed;
  font-weight: 700;
  text-decoration: none;
  background: #f3e8ff;
  padding: 2px 8px;
  border-radius: 6px;
  border: 1.5px solid #1e1b4b;
  transition: all 0.2s;
}

.dev-link:hover {
  background: #ede9fe;
  box-shadow: 2px 2px 0px #1e1b4b;
}

.changelog-top-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 4px;
}

.about-card h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e1b4b;
  margin: 0;
}

.update-badge-highlight {
  background: #10b981;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  border: 1.5px solid #1e1b4b;
}

.section-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 16px;
}

.changelog-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.changelog-item {
  border: 2px solid #1e1b4b;
  border-radius: 10px;
  background: #fff;
  overflow: hidden;
  transition: all 0.2s;
}

.changelog-header {
  padding: 12px 16px;
  background: #f8fafc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.changelog-header:hover {
  background: #f3f4f6;
}

.version-badge-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.v-tag {
  background: #7c3aed;
  color: #fff;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  border: 1px solid #1e1b4b;
}

.v-date {
  font-size: 0.85rem;
  color: #4b5563;
  font-weight: 600;
}

.toggle-icon {
  font-size: 0.8rem;
  font-weight: bold;
  color: #1e1b4b;
}

.changelog-body {
  padding: 16px;
  border-top: 2px solid #1e1b4b;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sub-section h4 {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1e1b4b;
  margin-bottom: 6px;
}

.sub-section ul {
  margin: 0;
  padding-left: 20px;
}

.sub-section li {
  font-size: 0.85rem;
  color: #4b5563;
  margin-bottom: 4px;
  line-height: 1.4;
}

.about-footer {
  text-align: center;
  font-size: 0.8rem;
  color: #6b7280;
  padding: 10px 0;
}

@media (max-width: 640px) {
  .meta-info {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
    padding-left: 10px;
  }
}
</style>
