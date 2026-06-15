<template>
  <header
    class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 pc-container"
  >
    <div class="flex items-center justify-between px-4 h-14">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 no-underline">
        <span class="text-2xl">💝</span>
        <span class="text-xl font-bold text-gradient hidden sm:block">CardWish</span>
      </NuxtLink>

      <!-- Right actions -->
      <div class="flex items-center gap-3">
        <LocaleSwitcher />

        <!-- User menu -->
        <template v-if="user">
          <NuxtLink
            to="/user"
            class="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b81] to-[#ff8fa3] flex items-center justify-center text-white text-sm font-semibold shadow-sm"
          >
            {{ userInitial }}
          </NuxtLink>
        </template>
        <template v-else>
          <NuxtLink
            :to="localePath('/auth/login')"
            class="btn-primary !px-4 !py-2 !text-sm"
          >
            {{ t('auth.login') }}
          </NuxtLink>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const user = useSupabaseUser()

const userInitial = computed(() => {
  const email = user.value?.email
  if (email) return email[0].toUpperCase()
  return '?'
})
</script>
