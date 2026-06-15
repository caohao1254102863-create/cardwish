<template>
  <div class="min-h-screen flex flex-col bg-[var(--color-bg)]">
    <AppHeader />
    <main class="flex-1 pb-16 md:pb-0 pc-container">
      <slot />
    </main>
    <AppFooter />
    <MobileNavigation />
  </div>
</template>

<script setup lang="ts">
</script>
