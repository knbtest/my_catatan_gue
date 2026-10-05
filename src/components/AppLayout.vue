<!-- src/components/AppLayout.vue -->
<template>
  <div class="wrapper">
    <!-- Navbar mobile -->
    <nav class="mobile-nav">
      <div class="mobile-nav-top">
        <span class="brand" style="text-align: center;">Catatan Keuangan</span>
        <button class="burger" @click="menuOpen = !menuOpen" aria-label="Buka menu"><span></span><span></span><span></span></button>
      </div>
      <div v-show="menuOpen" class="mobile-nav-menu">
        <RouterLink to="/dashboard" @click="menuOpen = false">Beranda</RouterLink>
        <RouterLink to="/catatan" @click="menuOpen = false">Catatan Transaksi</RouterLink>
        <RouterLink to="/aktivitas" @click="menuOpen = false">Aktivitas</RouterLink>
        <a href="/logout" class="logout" @click.prevent="confirmLogout">Logout</a>
        <div class="version-footer mobile">
          <div>
            {{ config.appName }} <strong>{{ config.version }}</strong> &bull; &copy; {{ config.year }} {{ config.developer }}
          </div>
        </div>
      </div>
    </nav>

    <!-- Sidebar desktop -->
    <aside class="sidebar">
      <div>
        <div class="brand" style="text-align: center;">Catatan Keuangan</div>
        <nav>
          <RouterLink to="/dashboard">Beranda</RouterLink>
          <RouterLink to="/catatan">Catatan Transaksi</RouterLink>
          <RouterLink to="/aktivitas">Aktivitas</RouterLink>
          <a href="/logout" class="logout" @click.prevent="confirmLogout">Logout</a>
        </nav>
      </div>
      <div class="version-footer desktop">
        <strong>{{ config.appName }} {{ config.version }}</strong
        ><br />
        Dikembangkan oleh {{ config.developer }}<br />
        &copy; {{ config.year }} All Rights Reserved
      </div>
    </aside>

    <!-- Main content (Independent Scroll) -->
    <main class="main">
      <slot />
    </main>

    <!-- Modal Konfirmasi Logout -->
    <div v-if="showLogoutModal" class="modal-overlay">
      <div class="modal-box">
        <h3>Konfirmasi Logout</h3>
        <p>Apakah kamu yakin ingin keluar dari aplikasi?</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showLogoutModal = false">Batal</button>
          <button class="btn-confirm" @click="executeLogout">Ya, Logout</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";
import { APP_CONFIG as config } from "../config";

const router = useRouter();
const { logout } = useAuth();
const menuOpen = ref(false);
const showLogoutModal = ref(false);

// Dipanggil saat tombol logout diklik (membuka modal)
function confirmLogout() {
  menuOpen.value = false; // Tutup menu mobile jika terbuka
  showLogoutModal.value = true;
}

// Eksekusi proses logout yang sebenarnya
async function executeLogout() {
  await logout();
  router.push("/");
}
</script>

<style scoped>
/* Modifikasi Layar Utama: Batasi tinggi sesuai viewport */
.wrapper {
  display: flex;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.brand {
  font-size: 19px;
  font-weight: bold;
  color: var(--color-primary);
}

/* --- Sidebar desktop Fixed --- */
.sidebar {
  width: 205px;
  height: 100%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px 0;
  flex-shrink: 0;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
}

.sidebar > div:first-child .brand {
  padding: 0 16px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-top: 10px;
}

.sidebar nav a {
  display: block;
  padding: 9px 6px;
  font-size: 16px;
  color: #333;
  text-decoration: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  transition: background 0.2s;
}

.sidebar nav a:hover,
.sidebar nav a.router-link-active {
  background: rgba(61, 169, 252, 0.15);
  color: var(--color-primary);
  font-weight: 600;
}

.sidebar nav a.logout {
  color: #e02b4d;
  font-weight: 600;
  border-bottom: none;
}
.sidebar nav a.logout:hover {
  background: rgba(255, 0, 80, 0.08);
  color: #e02b4d;
}

.version-footer.desktop {
  padding: 12px 4px 0;
  font-size: 0.68rem;
  color: #8a8a8a;
  line-height: 1.3;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  text-align: center;
  /* white-space: nowrap; */
}

/* --- Mobile nav --- */
.mobile-nav {
  display: none;
}

/* --- Main content (Menerapkan Independent Scroll) --- */
.main {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  background-color: #767b7cc2;
}

/* --- Modal Styling --- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
}

.modal-box {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 360px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  text-align: center;
  animation: modalPop 0.2s ease-in-out;
}

.modal-box h3 {
  margin-bottom: 10px;
  font-size: 18px;
  color: #333;
}

.modal-box p {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn-cancel,
.btn-confirm {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
}

.btn-cancel {
  background: #e2e8f0;
  color: #475569;
}

.btn-cancel:hover {
  background: #cbd5e1;
}

.btn-confirm {
  background: #e02b4d;
  color: #fff;
}

.btn-confirm:hover {
  background: #c52241;
}

@keyframes modalPop {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Penyesuaian Tampilan Mobile */
@media (max-width: 768px) {
  .wrapper {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
    overflow: visible;
  }
  .sidebar {
    display: none;
  }
  .mobile-nav {
    display: block;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  }
  .mobile-nav-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
  }
  .burger {
    background: none;
    border: none;
    width: 28px;
    height: 22px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0;
  }
  .burger span {
    display: block;
    height: 2.5px;
    width: 100%;
    background: #333;
    border-radius: 2px;
  }
  .mobile-nav-menu {
    display: flex;
    flex-direction: column;
    padding: 4px 16px 14px;
  }
  .mobile-nav-menu a {
    padding: 10px 4px;
    text-decoration: none;
    color: #333;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
  .mobile-nav-menu a.router-link-active {
    color: var(--color-primary);
    font-weight: 600;
  }
  .mobile-nav-menu a.logout {
    color: #e02b4d;
    font-weight: 600;
    border-bottom: none;
  }
  .version-footer.mobile {
    font-size: 0.7rem;
    color: #8a8a8a;
    padding-top: 8px;
    margin-top: 6px;
    border-top: 1px solid #eee;
    text-align: center;
  }
  .main {
    height: auto;
    overflow-y: visible;
    padding: 14px;
  }
}
</style>
