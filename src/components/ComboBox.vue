<!-- src/components/ComboBox.vue
     Combobox ringan bikinan sendiri — pengganti <input list="..."> (datalist)
     yang stylingnya nggak bisa diatur. Tetap bisa isi teks bebas (nama bank
     baru) atau klik salah satu saran dari yang sudah ada. -->
<template>
  <div class="combo" ref="comboRef">
    <input
      v-model="query"
      type="text"
      :placeholder="placeholder"
      autocomplete="off"
      @focus="open = true"
      @input="open = true"
    />
    <ul v-if="open && filtered.length" class="combo-list">
      <li v-for="opt in filtered" :key="opt" @mousedown.prevent="pick(opt)">
        {{ opt }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

const comboRef = ref(null)
const query = ref(props.modelValue)
const open = ref(false)

watch(() => props.modelValue, (v) => {
  if (v !== query.value) query.value = v
})
watch(query, (v) => emit('update:modelValue', v))

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  const list = q ? props.options.filter((o) => o.toLowerCase().includes(q)) : props.options
  return list.slice(0, 6)
})

function pick(opt) {
  query.value = opt
  open.value = false
}

function onClickOutside(e) {
  if (comboRef.value && !comboRef.value.contains(e.target)) open.value = false
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
.combo {
  position: relative;
}

.combo input {
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: 10px;
  font-size: 0.92rem;
  outline: none;
  background: #fff;
}
.combo input:focus {
  border-color: var(--color-primary);
}

.combo-list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
  max-height: 180px;
  overflow-y: auto;
  z-index: 20;
  list-style: none;
  margin: 6px 0 0;
  padding: 6px;
}

.combo-list li {
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
}
.combo-list li:hover {
  background: rgba(61, 169, 252, 0.12);
  color: var(--color-primary);
}
</style>