<template>
  <div class="pb-6">
    <div class="px-4 pt-4 pb-2"><h1 class="text-xl font-bold">我的订单</h1></div>

    <div class="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
      <button v-for="tab in tabs" :key="tab.value"
        class="flex-shrink-0 px-4 py-1.5 rounded-full text-sm border transition-all"
        :class="currentStatus === tab.value ? 'bg-red-400 text-white border-red-400' : 'bg-white text-gray-500 border-gray-200'"
        @click="currentStatus = tab.value">{{ tab.label }}</button>
    </div>

    <div class="px-4">
      <div v-if="loading" class="text-center py-12"><p class="text-gray-400">加载中...</p></div>

      <div v-else-if="list.length === 0" class="text-center py-12">
        <p class="text-5xl mb-3">📋</p>
        <p class="text-gray-400 mb-4">还没有订单，去挑选卡片吧！</p>
        <NuxtLink to="/" class="btn-primary !inline-flex">挑选卡片</NuxtLink>
      </div>

      <div v-else class="space-y-3">
        <div v-for="o in list" :key="o.id">
          <NuxtLink :to="'/order/' + o.id" class="card-container block p-4 no-underline">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs text-gray-400">订单号 {{ o.order_number }}</span>
              <span class="text-xs px-2 py-0.5 rounded-full" :class="badgeClass(o.status)">{{ statusLabel(o.status) }}</span>
            </div>
            <div class="flex items-center gap-3">
              <img :src="orderImg(o)" class="w-12 h-12 rounded-lg object-cover flex-shrink-0" @error="e => e.target.style.display='none'" />
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-700 truncate">{{ o.message || '无留言' }}</p>
                <p class="text-sm text-gray-400">致: {{ o.recipient_name }}</p>
              </div>
              <span class="font-bold text-red-400 flex-shrink-0">${{ fmt(o.total_cents) }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const list = ref([])
const loading = ref(true)
const currentStatus = ref('all')

const tabs = [{ value: 'all', label: '全部' }, { value: 'pending', label: '等待付款' }, { value: 'delivered', label: '已送达' }]

function fmt(c) { return (c / 100).toFixed(2) }
function orderImg(o) {
  const slug = o.category_slug || 'love'
  const idx = (parseInt(o.sort_order) % 3) + 1
  return '/images/cards/' + slug + '/' + slug + '-' + idx + '.png'
}
function statusLabel(s) {
  const m = { pending: '等待付款', paid: '已付款', delivered: '已送达', expired: '已过期', cancelled: '已取消' }
  return m[s] || s
}
function badgeClass(s) {
  const m = { pending: 'bg-yellow-100 text-yellow-700', paid: 'bg-blue-100 text-blue-700', delivered: 'bg-green-100 text-green-700', expired: 'bg-gray-100 text-gray-500' }
  return m[s] || 'bg-gray-100 text-gray-500'
}

async function fetchOrders() {
  loading.value = true
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token || ''
    const q = currentStatus.value !== 'all' ? '?status=' + currentStatus.value + '&limit=50' : '?limit=50'
    const res = await $fetch('/api/orders' + q, {
      headers: token ? { Authorization: 'Bearer ' + token } : {},
    })
    list.value = res.orders || []
  } catch (e) {
    list.value = []
  }
  loading.value = false
}

watch(currentStatus, () => fetchOrders())
onMounted(() => fetchOrders())
useHead({ title: "我的订单 - CardWish" })
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
