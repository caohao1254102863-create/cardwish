<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Global app setup
const { locale } = useI18n()
const supabase = useSupabaseClient()

// Watch auth state
const user = useSupabaseUser()
</script>
