<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toast ref="toastRef" />
</template>

<script setup>
const toastRef = ref(null)

// Global toast helper
function toast(msg, type = 'info', duration = 2500) {
  if (toastRef.value) toastRef.value.show(msg, type, duration)
}

// Make available globally
if (process.client) window.$toast = toast

// Also provide via Nuxt
provide('toast', toast)
</script>
