<template>
  <div class="min-h-screen bg-gray-100">
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <p class="text-gray-400">加载中...</p>
    </div>
    <div v-else-if="isDone" class="min-h-screen flex items-center justify-center p-6">
      <div class="text-center">
        <p class="text-5xl mb-4">{{ isDone === 'expired' ? '⏰' : '💌' }}</p>
        <p class="text-xl font-bold text-gray-700 mb-2">{{ isDone === 'expired' ? '订单已过期' : '已帮TA买单啦 🎉' }}</p>
        <NuxtLink to="/" class="inline-block px-8 py-3 rounded-full text-white font-semibold no-underline shadow-lg"
          style="background: linear-gradient(135deg, #ff6b81, #ff8fa3)">挑选卡片</NuxtLink>
      </div>
    </div>
    <template v-else-if="o">
      <div class="bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-100">
        <div class="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg"
          style="background: linear-gradient(135deg, #ff6b81, #ff8fa3)">💝</div>
        <div><p class="text-sm font-semibold text-gray-800">CardWish</p><p class="text-xs text-gray-400">朋友代付 · 心意卡片</p></div>
      </div>
      <div class="bg-white mx-3 mt-3 rounded-xl px-4 py-3 flex items-center gap-3">
        <p class="text-blue-500">📍</p>
        <div class="flex-1"><p class="text-gray-800 font-medium">{{ o.recipient_name || '好友' }}</p><p class="text-gray-400 text-xs">心意卡片 · 线上送达</p></div>
      </div>
      <div class="bg-white mx-3 mt-3 rounded-xl overflow-hidden">
        <div class="h-48 flex items-center justify-center" style="background: linear-gradient(135deg, #fce7f3, #fff1f2, #f3e8ff)">
          <div class="text-center"><p class="text-6xl mb-2">💝</p><p class="text-sm text-gray-500">{{ o.card_name }}</p></div>
        </div>
        <div class="p-4">
          <p v-if="o.message" class="text-sm p-3 rounded-lg mb-3" style="background:#fff7ed;color:#c2410c">"{{ o.message }}"</p>
          <div class="flex justify-between text-sm font-bold pt-3 border-t border-gray-100">
            <span>实付款</span>
            <span class="text-lg" style="color:#ff6b81">${{ fmt(o.total_cents) }}</span>
          </div>
        </div>
      </div>
      <div class="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 max-w-lg mx-auto">
        <button type="button" @click="doPay" :disabled="paying"
          class="w-full py-3 rounded-full font-bold text-white text-base shadow-lg disabled:opacity-50"
          style="background: #0070ba">
          {{ paying ? '处理中...' : 'PayPal $' + fmt(o.total_cents) + ' 帮TA付款' }}
        </button>
      </div>
      <div class="h-20"></div>
    </template>
    <div v-else class="min-h-screen flex items-center justify-center"><p class="text-gray-500">订单未找到</p></div>
  </div>
</template>

<script setup>
const route = useRoute()
const ret = useAsyncData('pay', () => $fetch('/api/orders/' + route.params.shareCode + '/by-share'))
const o = computed(() => {
  const d = ret.data.value
  return d ? d.order : null
})
const loading = computed(() => ret.pending.value)
const isDone = computed(() => {
  if (!o.value) return null
  if (o.value.status === 'expired') return 'expired'
  if (o.value.status === 'delivered') return 'delivered'
  return null
})
const paying = ref(false)

function fmt(c) { return (c / 100).toFixed(2) }

async function doPay() {
  paying.value = true
  try {
    const sc = route.params.shareCode
    // PayPal payment
    const r = await $fetch('/api/pay/' + sc + '/create-paypal-order', { method: 'POST' })
    if (r && r.approval_url) {
      window.location.href = r.approval_url
    } else {
      alert('支付失败: ' + (r?.error || '未知错误'))
    }
  } catch (e) { alert('支付失败: ' + (e.message || '')) }
  paying.value = false
}
</script>
