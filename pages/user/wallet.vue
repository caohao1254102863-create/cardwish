<template>
  <div class="pb-6">
    <div class="px-4 pt-4 pb-2"><h1 class="text-xl font-bold">{{ t('wallet.title') }}</h1></div>

    <div class="px-4 mb-6">
      <div class="gradient-love rounded-2xl p-6 text-white text-center">
        <p class="text-sm text-white/80 mb-1">{{ t('wallet.balance') }}</p>
        <p class="text-4xl font-bold mb-4">${{ formatPrice(w?.balance_cents || 0) }}</p>
        <div class="flex justify-center gap-8">
          <div><p class="text-xs text-white/60">{{ t('wallet.total_earned') }}</p><p class="font-semibold">${{ formatPrice(w?.total_earned_cents || 0) }}</p></div>
          <div class="border-l border-white/20"></div>
          <div><p class="text-xs text-white/60">{{ t('wallet.total_withdrawn') }}</p><p class="font-semibold">${{ formatPrice(w?.total_withdrawn_cents || 0) }}</p></div>
        </div>
      </div>

      <NuxtLink :to="localePath('/user/withdraw')" class="btn-primary w-full !mt-4 !inline-flex"
        :class="{ 'opacity-50 pointer-events-none': (w?.balance_cents || 0) < minWithdrawal }">
        💸 {{ t('wallet.withdraw') }}
      </NuxtLink>
      <p v-if="(w?.balance_cents || 0) < minWithdrawal" class="text-center text-xs text-gray-400 mt-3">
        {{ t('wallet.min_withdrawal', { amount: '$' + formatPrice(minWithdrawal) }) }}
      </p>
      <p v-else class="text-center text-xs text-gray-400 mt-3">可提现金额 ${{ formatPrice(w?.balance_cents || 0) }}</p>
    </div>

    <div class="px-4">
      <h3 class="font-semibold text-gray-700 mb-3">{{ t('wallet.earnings_title') }}</h3>
      <div v-if="loadingEarnings" class="space-y-2">
        <div v-for="i in 3" :key="i" class="h-14 bg-gray-100 rounded-lg animate-shimmer"></div>
      </div>
      <div v-else-if="earnings.length === 0" class="text-center py-8">
        <div class="text-3xl mb-2">💰</div>
        <p class="text-gray-400 text-sm">{{ t('wallet.no_earnings') }}</p>
      </div>
      <div v-else class="space-y-2">
        <div v-for="e in earnings" :key="e.id" class="card-container p-4 flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-700">{{ t('wallet.earning_from', { card_name: e.card_name || 'Card' }) }}</p>
            <p class="text-xs text-gray-400">{{ t('wallet.platform_fee', { amount: '$' + formatPrice(e.platform_fee_cents) }) }}</p>
          </div>
          <span class="font-bold text-[var(--color-success)]">+${{ formatPrice(e.amount_cents) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()
const minWithdrawal = computed(() => config.public.minWithdrawalCents)

const { data: walletData } = useAsyncData('user-wallet', () => $fetch('/api/user/wallet'))
const { data: earningsData, pending: loadingEarnings } = useAsyncData('user-earnings', () => $fetch('/api/user/earnings'))

const w = computed(() => walletData.value)
const earnings = computed(() => (earningsData.value)?.earnings || [])

function formatPrice(c) { return (c / 100).toFixed(2) }
useHead({ title: "我的钱包 - CardWish" })
</script>
