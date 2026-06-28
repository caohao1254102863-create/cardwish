<template>
  <div class="pb-6">
    <div class="px-4 pt-4 pb-2">
      <NuxtLink to="/user/wallet" class="text-red-400 text-sm no-underline">← 返回钱包</NuxtLink>
      <h1 class="text-xl font-bold mt-2">提现</h1>
    </div>

    <!-- Balance card -->
    <div class="px-4 mb-4">
      <div class="rounded-2xl p-6 text-white text-center" style="background:linear-gradient(135deg,#ff6b81,#ff8fa3)">
        <p class="text-sm opacity-80 mb-1">可提现余额</p>
        <p class="text-4xl font-bold">${{ fmt(balance) }}</p>
      </div>
    </div>

    <!-- Withdraw form -->
    <div class="px-4">
      <div class="card-container p-5 space-y-4">
        <!-- Amount -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">提现金额 (USD)</label>
          <input v-model.number="amount" type="number"
            class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-400 outline-none text-lg font-bold"
            placeholder="0.00" step="0.01" :min="minAmt" :max="maxAmt" />
          <p class="text-xs text-gray-400 mt-1">最低 ${{ minAmt }}，最高 ${{ fmt(balance) }}</p>
        </div>

        <!-- Method -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">收款方式</label>
          <div class="space-y-2">
            <button type="button" @click="method = 'paypal'"
              class="w-full p-3 rounded-lg border text-left text-sm flex items-center gap-3 transition-all"
              :class="method === 'paypal' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'">
              <span class="text-lg">🅿️</span>
              <div><p class="font-medium text-gray-700">PayPal</p><p class="text-xs text-gray-400">推荐 · 与收款通道一致</p></div>
              <span v-if="method === 'paypal'" class="ml-auto text-blue-500">✓</span>
            </button>
            <button type="button" @click="method = 'bank'"
              class="w-full p-3 rounded-lg border text-left text-sm flex items-center gap-3 transition-all"
              :class="method === 'bank' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'">
              <span class="text-lg">🏦</span>
              <div><p class="font-medium text-gray-700">银行转账</p><p class="text-xs text-gray-400">仅支持香港/海外银行账户</p></div>
              <span v-if="method === 'bank'" class="ml-auto text-blue-500">✓</span>
            </button>
          </div>
        </div>

        <!-- Account -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">收款账户</label>
          <input v-model="account" type="text"
            :placeholder="method === 'paypal' ? '输入你的 PayPal 邮箱地址' : '输入银行账户信息'"
            class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-400 outline-none text-sm" />
          <p class="text-xs text-gray-400 mt-1">💰 到账时间：1-3 个工作日</p>
        </div>

        <!-- Fee note -->
        <div class="bg-gray-50 rounded-lg p-3 text-xs text-gray-500">
          <p class="font-medium text-gray-600 mb-1">💡 提现说明</p>
          <p>· 提现金额为你从卡片中获得的 70% 收益</p>
          <p>· 平台不收取提现手续费</p>
          <p>· PayPal 可能产生少量跨境交易费</p>
          <p>· 提交后 1-3 个工作日内到账</p>
        </div>

        <!-- Submit -->
        <button type="button" class="btn-primary w-full" :disabled="!canSubmit || submitting" @click="submit">
          {{ submitting ? '提交中...' : '提交提现申请' }}
        </button>
      </div>
    </div>

    <!-- History -->
    <div class="px-4 mt-6" v-if="history.length > 0">
      <h3 class="font-semibold text-gray-700 mb-3">提现记录</h3>
      <div class="space-y-2">
        <div v-for="h in history" :key="h.id" class="card-container p-4 flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-700">${{ fmt(h.amount_cents) }}</p>
            <p class="text-xs text-gray-400">{{ h.method }} · {{ fmtDate(h.created_at) }}</p>
          </div>
          <span class="text-xs px-2 py-1 rounded-full" :class="statusClass(h.status)">{{ statusLabel(h.status) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const config = useRuntimeConfig()
const minAmt = computed(() => (config.public.minWithdrawalCents || 1000) / 100)

const balance = ref(0)
const amount = ref(null)
const method = ref('paypal')
const account = ref('')
const submitting = ref(false)
const history = ref([])

const maxAmt = computed(() => balance.value / 100)
const canSubmit = computed(() => {
  const amt = (amount.value || 0)
  return amt >= minAmt.value && amt <= maxAmt.value && account.value.trim().length > 0
})

function fmt(c) { return (c / 100).toFixed(2) }
function fmtDate(d) { return new Date(d).toLocaleDateString('zh-CN') }
function statusLabel(s) {
  const m = { pending: '处理中', processing: '处理中', completed: '已完成', rejected: '已拒绝' }
  return m[s] || s
}
function statusClass(s) {
  const m = { pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-500' }
  return m[s] || ''
}

async function submit() {
  if (!canSubmit.value) return
  submitting.value = true
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token || ''
    const amountCents = Math.round((amount.value || 0) * 100)
    await $fetch('/api/user/withdraw', {
      method: 'POST',
      headers: token ? { Authorization: 'Bearer ' + token } : {},
      body: { amount_cents: amountCents, method: method.value, account_info: { account: account.value } },
    })
    window.$toast('提现申请已提交，1-3 个工作日到账', 'success')
    navigateTo('/user/wallet')
  } catch (e) {
    window.$toast('提交失败: ' + (e.message || '未知错误'), 'error')
  }
  submitting.value = false
}

onMounted(async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token || ''
    const [walletRes, histRes] = await Promise.all([
      $fetch('/api/user/wallet', { headers: token ? { Authorization: 'Bearer ' + token } : {} }),
      $fetch('/api/user/withdrawals?limit=20', { headers: token ? { Authorization: 'Bearer ' + token } : {} }),
    ])
    balance.value = walletRes?.balance_cents || 0
    history.value = histRes?.withdrawals || []
  } catch (e) {}
})
</script>
