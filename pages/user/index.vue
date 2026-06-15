<template>
  <div class="pb-6">
    <!-- Profile header -->
    <div class="px-4 pt-6 pb-6 text-center">
      <div class="w-16 h-16 rounded-full bg-gradient-to-br from-[#ff6b81] to-[#ff8fa3] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3 shadow-lg">
        {{ userInitial }}
      </div>
      <h2 class="text-lg font-bold text-gray-800">{{ user?.email }}</h2>
      <p class="text-sm text-gray-400">{{ t('profile.joined', { date: joinedDate }) }}</p>
    </div>

    <!-- Menu items -->
    <div class="px-4 space-y-3">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.to"
        :to="localePath(item.to)"
        class="card-container p-4 flex items-center gap-4 no-underline active:scale-[0.98] transition-transform"
      >
        <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl">
          {{ item.icon }}
        </div>
        <div class="flex-1">
          <p class="font-semibold text-gray-700">{{ item.label }}</p>
          <p class="text-xs text-gray-400">{{ item.desc }}</p>
        </div>
        <span class="text-gray-300">→</span>
      </NuxtLink>

      <!-- Locale switcher -->
      <div class="card-container p-4 flex items-center gap-4">
        <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl">🌐</div>
        <div class="flex-1">
          <p class="font-semibold text-gray-700">{{ t('profile.language') }}</p>
          <p class="text-xs text-gray-400">{{ currentLangName }}</p>
        </div>
        <LocaleSwitcher />
      </div>

      <!-- Logout -->
      <button
        class="card-container p-4 flex items-center gap-4 w-full border-0 cursor-pointer active:scale-[0.98] transition-transform"
        @click="handleLogout"
      >
        <div class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-xl">🚪</div>
        <div class="flex-1 text-left">
          <p class="font-semibold text-red-500">{{ t('common.logout') }}</p>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const userInitial = computed(() => {
  const email = user.value?.email
  if (email) return email[0].toUpperCase()
  return '?'
})

const joinedDate = computed(() => {
  const created = user.value?.created_at
  if (created) return new Date(created).toLocaleDateString()
  return '...'
})

const currentLangName = computed(() => {
  return locale.value === 'zh-CN' ? '中文' : 'English'
})

const menuItems = computed(() => [
  { to: '/user/orders', icon: '📋', label: t('profile.my_orders'), desc: t('orders.title') },
  { to: '/user/wallet', icon: '💰', label: t('profile.my_wallet'), desc: t('wallet.title') },
  { to: '/user/received', icon: '💌', label: t('profile.my_cards'), desc: t('received.title') },
])

async function handleLogout() {
  if (confirm(t('auth.logout_confirm'))) {
    await supabase.auth.signOut()
    navigateTo(localePath('/'))
  }
}
</script>
