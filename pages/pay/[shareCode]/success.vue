<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <div class="text-white text-center py-12 px-4" style="background:linear-gradient(135deg,#4ade80,#10b981)">
      <p class="text-6xl mb-4">🎉</p>
      <h1 class="text-2xl font-bold mb-2">付款成功！</h1>
      <p class="text-white text-sm">卡片已送达 {{ name || 'TA' }}</p>
    </div>
    <div class="px-3 -mt-4">
      <div class="bg-white rounded-xl p-6 text-center shadow-sm">
        <p class="text-5xl mb-4">💌</p>
        <p class="text-gray-800 font-semibold mb-1">心意卡片已生成</p>
        <p class="text-gray-400 text-sm mb-6">心意已传达给 {{ name || 'TA' }}！</p>
        <NuxtLink to="/" class="inline-block px-8 py-3 rounded-full text-white font-semibold no-underline shadow-lg"
          style="background:linear-gradient(135deg,#ff6b81,#ff8fa3)">我也要创建卡片</NuxtLink>
      </div>
    </div>
    <div class="flex-1"></div>
    <p class="text-center text-xs text-gray-300 pb-6">感谢你让世界多了一份温暖 💝</p>
  </div>
</template>

<script setup>
const route = useRoute()
const sc = computed(() => route.params.shareCode)
const name = ref('')

definePageMeta({ layout: 'pay' })

onMounted(async () => {
  try {
    // Capture PayPal payment + complete order
    await $fetch('/api/paypal/capture-and-complete', {
      method: 'POST',
      body: { share_code: sc.value },
    })
    // Get order info for display
    const r = await $fetch('/api/pay/' + sc.value + '/success')
    if (r) name.value = r.recipient_name || ''

    const confetti = await import('canvas-confetti')
    confetti.default({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
  } catch (e) {
    console.error('Capture error:', e)
  }
})
</script>
