<template>
  <button
    class="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
           bg-pink-50 hover:bg-pink-100 transition-colors
           text-[var(--color-primary)] border-0 cursor-pointer"
    @click="switchLocale"
  >
    🌐 {{ nextLocaleLabel }}
  </button>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const nextLocale = computed(() => locale.value === 'zh-CN' ? 'en' : 'zh-CN')
const nextLocaleLabel = computed(() => locale.value === 'zh-CN' ? 'EN' : '中文')

function switchLocale() {
  const path = switchLocalePath(nextLocale.value)
  navigateTo(path)
}
</script>
