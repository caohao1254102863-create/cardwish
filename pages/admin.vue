<template>
  <div class="min-h-screen bg-gray-50 pb-6">
    <div class="bg-white px-4 py-4 border-b">
      <h1 class="text-lg font-bold text-gray-800">💰 提现管理</h1>
    </div>

    <!-- Tabs -->
    <div class="px-4 pt-4 pb-3 flex gap-2">
      <button @click="tab = 'pending'" :class="tab === 'pending' ? 'bg-red-400 text-white' : 'bg-white text-gray-500 border'"
        class="px-4 py-1.5 rounded-full text-sm font-medium">待处理</button>
      <button @click="tab = 'completed'" :class="tab === 'completed' ? 'bg-green-500 text-white' : 'bg-white text-gray-500 border'"
        class="px-4 py-1.5 rounded-full text-sm font-medium">已完成</button>
    </div>

    <!-- List -->
    <div class="px-4 space-y-3">
      <div v-if="loading" class="text-center py-12 text-gray-400">加载中...</div>

      <div v-else-if="list.length === 0" class="text-center py-12 text-gray-400">暂无数据</div>

      <div v-for="w in list" :key="w.id" class="bg-white rounded-xl p-4 shadow-sm space-y-3">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <p class="font-bold text-lg text-gray-800">${{ w.amount_dollars }}</p>
            <p class="text-xs text-gray-400">{{ w.created_at?.substring(0, 10) }} · {{ w.method === 'paypal' ? 'PayPal' : '银行' }}</p>
          </div>
          <span :class="w.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'"
            class="text-xs px-2 py-1 rounded-full">{{ w.status === 'pending' ? '待处理' : '已完成' }}</span>
        </div>

        <!-- User info -->
        <div class="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
          <p><span class="text-gray-400">用户：</span>{{ w.user_nickname || '未设置' }}</p>
          <p v-if="w.user_phone"><span class="text-gray-400">手机：</span>{{ w.user_phone }}</p>

          <template v-if="w.account_info">
            <div v-if="w.method === 'paypal'">
              <p class="flex items-center gap-2">
                <span class="text-gray-400">PayPal：</span>
                <code class="text-blue-600 font-medium">{{ w.account_info.paypal_email }}</code>
                <button @click="copyText(w.account_info.paypal_email)" class="text-xs text-red-400 active:scale-90">复制</button>
              </p>
              <p v-if="w.account_info.holder_name"><span class="text-gray-400">姓名：</span>{{ w.account_info.holder_name }}</p>
            </div>
            <template v-else>
              <p><span class="text-gray-400">持有人：</span>{{ w.account_info.holder_name }}</p>
              <p><span class="text-gray-400">银行：</span>{{ w.account_info.bank_name }}</p>
              <p class="flex items-center gap-2">
                <span class="text-gray-400">账号：</span>
                <code class="text-blue-600 font-medium">{{ w.account_info.bank_account }}</code>
                <button @click="copyText(w.account_info.bank_account)" class="text-xs text-red-400 active:scale-90">复制</button>
              </p>
              <p v-if="w.account_info.swift_code"><span class="text-gray-400">SWIFT：</span>{{ w.account_info.swift_code }}</p>
            </template>
          </template>
        </div>

        <!-- Actions (pending only) -->
        <div v-if="w.status === 'pending'" class="flex gap-2">
          <button @click="process(w.id, 'completed')" :disabled="processing === w.id"
            class="flex-1 py-2 rounded-lg bg-green-500 text-white text-sm font-medium active:scale-95 transition-all">
            {{ processing === w.id ? '处理中...' : '✅ 标记已打款' }}
          </button>
          <button @click="process(w.id, 'rejected')" :disabled="processing === w.id"
            class="flex-1 py-2 rounded-lg bg-gray-200 text-gray-600 text-sm font-medium active:scale-95 transition-all">
            ❌ 拒绝
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const list = ref([])
const loading = ref(true)
const tab = ref('pending')
const processing = ref(null)

async function fetchList() {
  loading.value = true
  try {
    const r = await $fetch('/api/admin/withdrawals?status=' + tab.value)
    list.value = r.withdrawals || []
  } catch (e) {}
  loading.value = false
}

async function process(id, status) {
  processing.value = id
  try {
    await $fetch('/api/admin/withdrawals/' + id + '/process', {
      method: 'POST',
      body: { status, admin_notes: status === 'completed' ? '已手动打款' : '' },
    })
    window.$toast(status === 'completed' ? '已标记完成' : '已拒绝', 'success')
    fetchList()
  } catch (e) {
    window.$toast('操作失败', 'error')
  }
  processing.value = null
}

function copyText(text) {
  navigator.clipboard.writeText(text || '').then(() => window.$toast('已复制', 'success', 1500)).catch(() => {})
}

watch(tab, () => fetchList())
onMounted(() => fetchList())
</script>
