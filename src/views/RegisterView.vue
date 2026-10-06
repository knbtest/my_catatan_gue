<!-- src/views/RegisterView.vue -->
<template>
  <div class="auth-page">
    <div class="auth-wrapper">
      <div class="auth-side">
        <div>
          <div class="auth-side-icon">🚀</div>
          <h2>Mulai Sekarang</h2>
          <p>Buat akun gratis dan mulai kelola keuanganmu dengan lebih terarah, mulai hari ini.</p>
        </div>
        <div class="auth-footer-info">
          <strong>{{ config.appName }} {{ config.version }}</strong><br />
          Dikembangkan oleh {{ config.developer }}<br />
          &copy; {{ config.year }} All Rights Reserved
          <div class="footer-link-wrapper">
            <RouterLink to="/about" class="about-link">Tentang Aplikasi & Update</RouterLink>
          </div>
        </div>
      </div>

      <div class="auth-form-panel">
        <div class="auth-brand">Buat Akun Baru </div>
        <div class="auth-sub">Isi data di bawah untuk mendaftar (Wajib Gmail)</div>

        <div v-if="errorMsg" class="alert-box error">{{ errorMsg }}</div>
        <div v-if="successMsg" class="alert-box success">{{ successMsg }}</div>

        <form @submit.prevent="handleSubmit">
          <div class="field">
            <label>Email</label>
            <input v-model="email" type="email" placeholder="contoh@gmail.com" required autocomplete="email" />
          </div>
          <div class="field">
            <label>Password</label>
            <input v-model="password" type="password" required minlength="8" placeholder="Minimal 8 Karakter" autocomplete="new-password" />
          </div>
          <div class="field">
            <label>Konfirmasi Password</label>
            <input v-model="passwordConfirm" type="password" required minlength="8" placeholder="Konfirmasi Password" autocomplete="new-password" />
          </div>
          <button type="submit" class="btn btn-primary btn-block" :disabled="isLoading">
            <BaseSpinner v-if="isLoading" />
            {{ isLoading ? 'Tunggu Bentar Yaaa....' : 'Daftar' }}
          </button>
        </form>

        <div class="switch-text">
          Sudah punya akun?
          <RouterLink to="/">Masuk di sini</RouterLink>
        </div>

        <div class="mobile-footer-info">
          {{ config.appName }} <strong>{{ config.version }}</strong> &bull; &copy; {{ config.year }} {{ config.developer }}
          <div class="mobile-footer-link">
            <RouterLink to="/about">Tentang Aplikasi & Update</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { terjemahkanErrorAuth } from '../utils/format'
import { APP_CONFIG as config } from '../config'
import BaseSpinner from '../components/BaseSpinner.vue'

const { register } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const isLoading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

async function handleSubmit() {
  errorMsg.value = ''
  successMsg.value = ''

  const cleanEmail = email.value.trim().toLowerCase()

  // 1. Validasi Ketat: Wajib berakhiran @gmail.com
  if (!cleanEmail.endsWith('@gmail.com')) {
    errorMsg.value = 'Pendaftaran wajib menggunakan akun Gmail yang valid (berakhiran @gmail.com).'
    return
  }

  // 2. Validasi Password Cocok
  if (password.value !== passwordConfirm.value) {
    errorMsg.value = 'Konfirmasi password tidak cocok.'
    return
  }
  
  // 3. Validasi Panjang Password
  if (password.value.length < 6) {
    errorMsg.value = 'Password minimal 6 karakter.'
    return
  }

  isLoading.value = true
  const { data, error } = await register(cleanEmail, password.value)
  isLoading.value = false

  if (error) {
    errorMsg.value = terjemahkanErrorAuth(error.message)
    return
  }

  // KONDISI A: Jika butuh verifikasi email
  if (data.user && !data.session) {
    successMsg.value = 'Pendaftaran berhasil! Silakan cek email kamu untuk melakukan konfirmasi sebelum login.'
    email.value = ''
    password.value = ''
    passwordConfirm.value = ''
    return
  }

  // KONDISI B: Jika otomatis login langsung dapat session
  if (data.session) {
    successMsg.value = 'Pendaftaran berhasil! Mengalihkan ke dashboard...'
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  }
}
</script>

<style scoped>
/* Style tetap sama seperti sebelumnya */
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, var(--color-auth) 0%, var(--color-auth-dark) 100%);
}

.auth-wrapper {
  width: 100%;
  max-width: 900px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  display: flex;
  min-height: 560px;
}

.auth-side {
  flex: 1;
  background: linear-gradient(160deg, var(--color-auth-dark), var(--color-auth));
  color: #fff;
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.auth-side-icon {
  font-size: 2.6rem;
  margin-bottom: 18px;
}

.auth-side h2 {
  font-weight: 700;
  font-size: 1.6rem;
  margin-bottom: 12px;
}

.auth-side p {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  line-height: 1.6;
}

.auth-footer-info {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
}

.footer-link-wrapper {
  margin-top: 8px;
}

.about-link {
  color: #ffffff;
  font-weight: 600;
  text-decoration: underline;
  font-size: 0.8rem;
  transition: opacity 0.2s;
}

.about-link:hover {
  opacity: 0.8;
}

.auth-form-panel {
  flex: 1;
  padding: 44px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.auth-brand {
  font-weight: 700;
  font-size: 1.4rem;
  color: #2d2d2d;
  margin-bottom: 6px;
}

.auth-sub {
  color: #8a8a8a;
  font-size: 0.9rem;
  margin-bottom: 24px;
}

.btn-block {
  width: 100%;
  padding: 12px;
  margin-top: 8px;
}

.switch-text {
  text-align: center;
  margin-top: 18px;
  font-size: 0.88rem;
  color: #6c757d;
}

.switch-text :deep(a) {
  text-decoration: none;
  font-weight: 600;
  color: var(--color-auth);
}
.switch-text :deep(a:hover) {
  text-decoration: underline;
}

.mobile-footer-info {
  display: none;
  text-align: center;
  font-size: 0.75rem;
  color: #a0a0a0;
  margin-top: 20px;
  line-height: 1.4;
}

.mobile-footer-link {
  margin-top: 6px;
}

.mobile-footer-link a {
  color: var(--color-auth, #7c3aed);
  font-weight: 600;
  text-decoration: none;
  font-size: 0.78rem;
}

.mobile-footer-link a:hover {
  text-decoration: underline;
}

@media (max-width: 767px) {
  .auth-side {
    display: none;
  }
  .auth-wrapper {
    min-height: auto;
  }
  .auth-form-panel {
    padding: 40px 28px;
  }
  .mobile-footer-info {
    display: block;
  }
}
</style>