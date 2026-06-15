<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fef6f7] via-white to-[#fff0f3] p-6">
    <div class="w-full max-w-sm">
      <div class="text-center mb-6">
        <p class="text-4xl mb-1">💝</p>
        <h1 class="text-2xl font-bold text-gradient">{{ t('common.app_name') }}</h1>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
