<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-gray-100 safe-bottom
           md:hidden"
  >
    <div class="flex items-center justify-around h-14 max-w-lg mx-auto">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="localePath(item.to)"
        class="flex flex-col items-center gap-0.5 no-underline
               text-gray-400 hover:text-[var(--color-primary)] transition-colors
               min-w-0 flex-1 py-1"
        active-class="!text-[var(--color-primary)]"
      >
        <span class="text-xl">{{ item.icon }}</span>
        <span class="text-[10px] leading-none">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup>
const { t } = useI18n()
const localePath = useLocalePath()

const navItems = computed(() => [
  { to: '/', icon: '🏠', label: t('nav.home') },
  { to: '/user/orders', icon: '📋', label: t('nav.orders') },
  { to: '/user/wallet', icon: '💰', label: t('nav.wallet') },
  { to: '/user/received', icon: '💌', label: t('nav.received') },
  { to: '/user', icon: '👤', label: t('nav.profile') },
])
</script>
