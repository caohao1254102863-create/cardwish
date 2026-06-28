<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <p class="text-gray-400">加载中...</p>
    </div>

    <!-- Order expired -->
    <div v-else-if="isDone === 'expired'" class="min-h-screen flex items-center justify-center p-6">
      <div class="text-center">
        <p class="text-6xl mb-4">⏰</p>
        <p class="text-xl font-bold text-gray-700 mb-2">订单已过期</p>
        <p class="text-gray-400 text-sm mb-6">该订单超过 24 小时无人付款，已自动取消</p>
        <a href="/" class="inline-block px-8 py-3 rounded-full text-white font-semibold no-underline shadow-lg"
          style="background: linear-gradient(135deg, #ff6b81, #ff8fa3)">我也要一张</a>
      </div>
    </div>

    <!-- Already paid -->
    <div v-else-if="isDone === 'delivered'" class="min-h-screen flex items-center justify-center p-6">
      <div class="text-center">
        <p class="text-6xl mb-4">💌</p>
        <p class="text-xl font-bold text-gray-700 mb-2">已付款成功</p>
        <p class="text-gray-400 text-sm mb-6">该订单已有其他用户完成付款</p>
        <a href="/" class="inline-block px-8 py-3 rounded-full text-white font-semibold no-underline shadow-lg"
          style="background: linear-gradient(135deg, #ff6b81, #ff8fa3)">我也要一张</a>
      </div>
    </div>

    <!-- Payment failed -->
    <div v-else-if="payError" class="min-h-screen flex items-center justify-center p-6">
      <div class="text-center">
        <p class="text-6xl mb-4">😕</p>
        <p class="text-xl font-bold text-gray-700 mb-2">付款未成功</p>
        <p class="text-gray-400 text-sm mb-6">{{ payError }}</p>
        <button type="button" @click="retryPay"
          class="inline-block px-8 py-3 rounded-full text-white font-semibold no-underline shadow-lg"
          style="background: #0070ba">🅿️ 重新付款</button>
      </div>
    </div>

    <!-- Payment page -->
    <template v-else-if="o">
      <!-- Minimal header -->
      <div class="bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-100">
        <div class="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg"
          style="background: linear-gradient(135deg, #ff6b81, #ff8fa3)">💝</div>
        <div>
          <p class="text-sm font-semibold text-gray-800">CardWish</p>
          <p class="text-xs text-gray-400">朋友代付 · 心意卡片</p>
        </div>
      </div>

      <!-- Delivery info -->
      <div class="bg-white mx-3 mt-3 rounded-xl px-4 py-3 flex items-center gap-3">
        <span class="text-blue-500">📍</span>
        <div class="flex-1">
          <p class="text-gray-800 font-medium">{{ o.recipient_name || '好友' }}</p>
          <p class="text-gray-400 text-xs">心意卡片 · 线上送达</p>
        </div>
      </div>

      <!-- Card preview -->
      <div class="bg-white mx-3 mt-3 rounded-xl overflow-hidden">
        <div class="h-48 relative overflow-hidden" style="background: linear-gradient(135deg, #fce7f3, #fff1f2, #f3e8ff)">
          <img :src="cardImg" class="w-full h-full object-cover" @error="imgFail=true" />
          <div v-if="imgFail" class="absolute inset-0 flex flex-col items-center justify-center">
            <p class="text-6xl mb-2">💝</p>
            <p class="text-sm text-gray-500">{{ o.card_name }}</p>
          </div>
        </div>
        <div class="p-4">
          <p v-if="o.message" class="text-sm p-3 rounded-lg mb-3" style="background:#fff7ed;color:#c2410c">
            "{{ o.message }}"
          </p>
          <div class="flex justify-between text-sm font-bold pt-3 border-t border-gray-100">
            <span>实付款</span>
            <span class="text-lg" style="color:#ff6b81">${{ fmt(o.total_cents) }}</span>
          </div>
        </div>
      </div>

      <!-- Payer message -->
      <div class="bg-white mx-3 mt-3 rounded-xl px-4 py-3">
        <label class="text-xs text-gray-400 mb-2 block">给 TA 的回复（选填）</label>
        <input v-model="msg" type="text" :placeholder="'给 ' + (o.recipient_name || 'TA') + ' 回复一句话...'"
          class="w-full text-sm text-gray-700 outline-none" maxlength="100" />
      </div>

      <!-- Expiry notice -->
      <div class="mx-3 mt-3 text-center text-xs text-gray-400">
        ⏰ 该订单将在 24 小时内有效，请尽快完成付款
      </div>

      <!-- Pay button -->
      <div class="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-4 max-w-lg mx-auto"
        style="padding-bottom: calc(1rem + env(safe-area-inset-bottom))">
        <button type="button" @click="doPay" :disabled="paying"
          class="w-full py-3.5 rounded-full font-bold text-white text-base shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-95"
          style="background: #0070ba">
          <span v-if="!paying">🅿️ PayPal · ${{ fmt(o.total_cents) }} 帮TA付款</span>
          <span v-else>正在跳转 PayPal...</span>
        </button>
        <p class="text-center text-xs text-gray-300 mt-2">由 PayPal 提供支付保障 · 支持全球银行卡</p>
      </div>
      <div class="h-28"></div>
    </template>

    <!-- Not found -->
    <div v-else class="min-h-screen flex items-center justify-center">
      <p class="text-gray-500">订单未找到</p>
    </div>
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
const payError = ref('')
const msg = ref('')
const imgFail = ref(false)
const cardImg = computed(() => {
  const slug = o.value?.category_slug || 'love'
  const so = o.value?.sort_order || 0
  return '/images/cards/' + slug + '/' + slug + '-' + ((so % 3) + 1) + '.png'
})

function fmt(c) { return (c / 100).toFixed(2) }

function retryPay() {
  payError.value = ''
  doPay()
}

async function doPay() {
  paying.value = true
  payError.value = ''
  try {
    const sc = route.params.shareCode
    const r = await $fetch('/api/pay/' + sc + '/create-paypal-order', { method: 'POST', body: { payer_message: msg.value } })
    if (r && r.approval_url) {
      window.location.href = r.approval_url
    } else {
      payError.value = r?.error || '支付暂时不可用，请稍后重试'
    }
  } catch (e) {
    payError.value = '网络连接失败，请检查网络后重试'
  }
  paying.value = false
}

const cfg = useRuntimeConfig()
definePageMeta({ layout: 'pay' })

useHead(() => {
  const order = o.value
  if (!order) return {}
  const title = (order.recipient_name || '好友') + ' 想要一张 ' + (order.card_name || '心意卡片')
  const desc = '$' + fmt(order.total_cents) + ' 帮TA实现心愿！'
  const imgUrl = cardImg.value.startsWith('http') ? cardImg.value : (cfg.public.siteUrl + cardImg.value)

  return {
    title,
    meta: [
      // Standard OG (Facebook, WhatsApp, Telegram, LINE, Discord)
      { property: 'og:title', content: title },
      { property: 'og:description', content: desc },
      { property: 'og:image', content: imgUrl },
      { property: 'og:image:width', content: '400' },
      { property: 'og:image:height', content: '400' },
      { property: 'og:type', content: 'product' },
      { property: 'og:site_name', content: 'CardWish' },

      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: desc },
      { name: 'twitter:image', content: imgUrl },

      // WeChat specific
      { itemprop: 'name', content: title },
      { itemprop: 'description', content: desc },
      { itemprop: 'image', content: imgUrl },
    ],
  }
})
</script>
