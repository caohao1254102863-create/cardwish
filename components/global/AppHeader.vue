<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 pc-container">
    <div class="flex items-center justify-between px-3 h-14">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-1.5 no-underline min-w-0">
        <span class="text-xl flex-shrink-0">💝</span>
        <span class="text-lg font-bold text-gradient hidden sm:block truncate">CardWish</span>
      </NuxtLink>

      <!-- Right: locale + user -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <LocaleSwitcher />

        <template v-if="user">
          <NuxtLink to="/user"
            class="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-pink-400 flex items-center justify-center text-white text-sm font-semibold shadow-sm no-underline">
            {{ userInitial }}
          </NuxtLink>
        </template>
        <template v-else>
          <NuxtLink :to="localePath('/auth/login')"
            class="px-3 py-1.5 rounded-full text-white text-xs font-semibold no-underline"
            style="background:linear-gradient(135deg,#ff6b81,#ff8fa3)">
            {{ t('auth.login') }}
          </NuxtLink>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
const { t } = useI18n()
const localePath = useLocalePath()
const user = useSupabaseUser()

const userInitial = computed(() => {
  const email = user.value?.email
  if (email) return email[0].toUpperCase()
  return '?'
})
</script>
