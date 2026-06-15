<template>
  <div class="pb-6">
    <div class="px-4 pt-4 pb-2">
      <NuxtLink :to="localePath('/user/wallet')" class="text-[var(--color-primary)] text-sm no-underline">
        ← {{ t('common.back') }}
      </NuxtLink>
      <h1 class="text-xl font-bold mt-2">{{ t('wallet.withdraw') }}</h1>
    </div>

    <div class="px-4">
      <div class="card-container p-5">
        <!-- Balance display -->
        <div class="text-center mb-6">
          <p class="text-sm text-gray-500">{{ t('wallet.balance') }}</p>
          <p class="text-3xl font-bold text-[var(--color-primary)]">
            {{ currencySymbol }}{{ formatPrice(balance) }}
          </p>
        </div>

        <!-- Amount input -->
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            {{ t('wallet.withdraw_amount') }}
          </label>
          <input
            v-model.number="amount"
            type="number"
            :min="formatPrice(minWithdrawal)"
            :max="formatPrice(balance)"
            step="0.01"
            class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-card-shadow)] outline-none text-lg font-bold"
            placeholder="0.00"
          />
          <p class="text-xs text-gray-400 mt-1">
            {{ t('wallet.min_withdrawal', { amount: currencySymbol + formatPrice(minWithdrawal) }) }}
          </p>
        </div>

        <!-- Method selection -->
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            {{ t('wallet.withdraw_method') }}
          </label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="method in methods"
              :key="method.value"
              class="py-3 rounded-lg border text-center text-sm transition-all"
              :class="selectedMethod === method.value
                ? 'border-[var(--color-primary)] bg-pink-50 text-[var(--color-primary)] font-semibold'
                : 'border-gray-200 text-gray-500'"
              @click="selectedMethod = method.value"
            >
              {{ method.label }}
            </button>
          </div>
        </div>

        <!-- Account info -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            {{ t('wallet.account_info') }}
          </label>
          <input
            v-model="accountInfo"
            class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-card-shadow)] outline-none"
            :placeholder="t('wallet.account_info_hint')"
          />
        </div>

        <!-- Submit -->
        <button
          class="btn-primary w-full"
          :disabled="!canWithdraw || submitting"
          @click="handleWithdraw"
        >
          {{ submitting ? t('common.loading') : t('wallet.withdraw') + ' ' + currencySymbol + formatPrice(amountCents) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()

const balance = ref(0)
const amount = ref<number | null>(null)
const selectedMethod = ref('wechat')
const accountInfo = ref('')
const submitting = ref(false)

const minWithdrawal = computed(() => config.public.minWithdrawalCents as number)
const amountCents = computed(() => Math.round((amount.value || 0) * 100))

const currencySymbol = computed(() => '$')

const methods = [
  { value: 'wechat', label: t('wallet.method_wechat') },
  { value: 'alipay', label: t('wallet.method_alipay') },
  { value: 'bank', label: t('wallet.method_bank') },
]

const canWithdraw = computed(() => {
  return amountCents.value >= minWithdrawal.value &&
    amountCents.value <= balance.value &&
    accountInfo.value.trim().length > 0
})

function formatPrice(cents: number): string { return (cents / 100).toFixed(2) }

async function handleWithdraw() {
  if (!canWithdraw.value) return
  submitting.value = true
  try {
    const { error } = await useFetch('/api/user/withdraw', {
      method: 'POST',
      body: {
        amount_cents: amountCents.value,
        method: selectedMethod.value,
        account_info: { account: accountInfo.value },
      },
    })
    if (error.value) throw error.value
    alert(t('wallet.withdraw_success'))
    navigateTo(localePath('/user/wallet'))
  } catch (e: any) {
    alert(e.message || t('errors.withdrawal_failed'))
  }
  submitting.value = false
}

onMounted(async () => {
  try {
    const { data } = await useFetch('/api/user/wallet')
    if (data.value) {
      balance.value = (data.value as any).balance_cents || 0
    }
  } catch (e) {}
})
</script>
