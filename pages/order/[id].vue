<template>
  <div class="min-h-screen bg-gray-100 pb-6">
    <div v-if="pending" class="p-4 pt-20 space-y-4">
      <div class="h-6 bg-gray-200 rounded w-2/3"></div>
      <div class="h-40 bg-gray-200 rounded-xl"></div>
    </div>
    <div v-else-if="!order" class="p-8 text-center pt-20">
      <p class="text-4xl mb-3">🔍</p>
      <p class="text-gray-500">订单未找到</p>
      <NuxtLink to="/" class="btn-primary !inline-flex mt-4">返回首页</NuxtLink>
    </div>
    <template v-else>
      <div class="text-white text-center py-8 px-4" :class="statusBg">
        <p class="text-4xl mb-2">{{ statusEmoji }}</p>
        <h2 class="text-xl font-bold">{{ statusText }}</h2>
        <p class="text-sm opacity-80 mt-1">订单号 {{ order.order_number }}</p>
      </div>
      <div class="px-3 -mt-4">
        <div class="bg-white rounded-xl overflow-hidden shadow-sm">
          <div class="h-40 relative overflow-hidden" style="background:linear-gradient(135deg,#fce7f3,#fff1f2,#f3e8ff)">
            <img :src="cardImg" class="w-full h-full object-cover" @error="imgFail=true" />
            <div v-if="imgFail" class="absolute inset-0 flex items-center justify-center"><p class="text-6xl">💝</p></div>
          </div>
          <div class="p-4">
            <p v-if="order.message" class="text-sm p-3 rounded-lg mb-3" style="background:#fff7ed;color:#c2410c">"{{ order.message }}"</p>
            <div class="flex justify-between text-sm mb-1"><span class="text-gray-400">卡片金额</span><span class="font-semibold">${{ fmt(order.total_cents) }}</span></div>
            <div class="flex justify-between text-sm"><span class="text-gray-400">你将获得 (70%)</span><span class="font-bold text-green-500">${{ fmt(earning) }}</span></div>
          </div>
        </div>
      </div>
      <div v-if="order.status === 'pending'" class="px-3 mt-4">
        <div class="bg-white rounded-xl p-5 shadow-sm">
          <h3 class="font-bold text-gray-800 mb-1">分享链接给朋友代付</h3>
          <p class="text-xs text-gray-400 mb-4">复制链接发送给微信 / 小红书 / X 好友</p>
          <div class="bg-gray-50 rounded-lg p-3 mb-4 flex items-center gap-2">
            <code class="flex-1 text-xs text-gray-600 break-all">{{ shareUrl }}</code>
            <button class="flex-shrink-0 px-4 py-2 text-white rounded-lg text-sm font-medium active:scale-95" style="background:#ff6b81" @click="copyUrl">{{ copied ? '已复制' : '复制' }}</button>
          </div>
          <div class="flex justify-center gap-4">
            <button class="w-12 h-12 rounded-full flex items-center justify-center text-xl active:scale-90" style="background:#f0fdf4;color:#22c55e" @click="shareTo('wechat')">💬</button>
            <button class="w-12 h-12 rounded-full flex items-center justify-center text-xl active:scale-90" style="background:#fef2f2;color:#ef4444" @click="shareTo('xhs')">📕</button>
            <button class="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl active:scale-90" style="background:#111" @click="shareTo('x')">𝕏</button>
            <button class="w-12 h-12 rounded-full flex items-center justify-center text-xl active:scale-90" style="background:#eff6ff;color:#3b82f6" @click="shareTo('wa')">📱</button>
          </div>
        </div>
      </div>
      <div v-if="order.status === 'delivered'" class="px-3 mt-4">
        <NuxtLink to="/user/received" class="w-full py-3 rounded-full text-white font-semibold text-center block no-underline shadow-lg" style="background:linear-gradient(135deg,#ff6b81,#ff8fa3)">查看我的卡片</NuxtLink>
      </div>
    </template>
  </div>
</template>

<script setup>
const route = useRoute()
const cfg = useRuntimeConfig()
const supabase = useSupabaseClient()
const ret = useAsyncData('order-detail', async () => {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token || ''
  return $fetch('/api/orders/' + route.params.id, {
    headers: token ? { Authorization: 'Bearer ' + token } : {},
  })
})
const order = computed(() => {
  const d = ret.data.value
  return d ? d.order : null
})
const imgFail = ref(false)
const cardImg = computed(() => {
  const slug = order.value?.category_slug || 'love'
  const so = order.value?.sort_order || 0
  const idx = (so % 3) + 1
  return '/images/cards/' + slug + '/' + slug + '-' + idx + '.png'
})
const copied = ref(false)
const shareUrl = computed(() => order.value ? cfg.public.siteUrl + '/pay/' + order.value.share_code : '')
const earning = computed(() => Math.round((order.value?.total_cents || 0) * 0.7))
const pending = computed(() => ret.pending.value)

function fmt(c) { return (c / 100).toFixed(2) }

const labels = { p: '等待付款', a: '已付款', d: '卡片已送达', e: '已过期', c: '已取消',
  pe: '⏳', ae: '✅', de: '💌', ee: '⌛', ce: '❌',
  pb: 'bg-gradient-to-r from-yellow-400 to-orange-400', ab: 'bg-gradient-to-r from-blue-400 to-cyan-400',
  db: 'bg-gradient-to-r from-green-400 to-emerald-400', eb: 'bg-gradient-to-r from-gray-400 to-gray-500',
  cb: 'bg-gradient-to-r from-gray-400 to-gray-500' }

const s = computed(() => order.value?.status || '')
const statusText = computed(() => (labels)[s.value] || s.value)
const statusEmoji = computed(() => (labels)[s.value + 'e'] || '📋')
const statusBg = computed(() => (labels)[s.value + 'b'] || 'bg-gray-400')

async function copyUrl() {
  try { await navigator.clipboard.writeText(shareUrl.value); copied.value = true; setTimeout(() => { copied.value = false }, 2000) } catch (e) {}
}

function shareTo(p) {
  const t = encodeURIComponent('帮我付一下这张心意卡片 ' + shareUrl.value)
  if (p === 'wa') window.open('https://wa.me/?text=' + t, '_blank')
  else if (p === 'x') window.open('https://x.com/intent/tweet?text=' + t, '_blank')
  else { copyUrl(); window.$toast('已复制链接，打开' + (p === 'wechat' ? '微信' : '小红书') + '粘贴发送', 'success', 2000) }
}
</script>
