<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin text-4xl mb-4">💝</div>
      <p class="text-gray-500">{{ t('common.loading') }}</p>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const localePath = useLocalePath()
const supabase = useSupabaseClient()

// Handle OAuth callback
onMounted(async () => {
  const { data, error } = await supabase.auth.getSession()
  if (data.session) {
    navigateTo(localePath('/'), { replace: true })
  } else {
    navigateTo(localePath('/auth/login'), { replace: true })
  }
})

definePageMeta({
  layout: 'auth',
})
</script>
