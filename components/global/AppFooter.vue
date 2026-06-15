<template>
  <footer class="hidden md:block mt-auto border-t border-gray-100 bg-white py-6">
    <div class="pc-container px-4">
      <div class="flex items-center justify-between text-sm text-gray-400">
        <div class="flex gap-4">
          <NuxtLink :to="localePath('/legal/terms')" class="no-underline text-gray-400 hover:text-[var(--color-primary)]">
            {{ t('footer.terms') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/legal/privacy')" class="no-underline text-gray-400 hover:text-[var(--color-primary)]">
            {{ t('footer.privacy') }}
          </NuxtLink>
        </div>
        <span>{{ t('footer.copyright', { year: 2026 }) }}</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
</script>
