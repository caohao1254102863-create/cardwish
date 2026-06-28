<template>
  <div class="pb-6">
    <!-- Steps -->
    <div class="flex items-center justify-center gap-2 px-4 py-4">
      <div v-for="(step, i) in steps" :key="i" class="flex items-center gap-2">
        <div
          class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
          :class="currentStep >= i ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 text-gray-400'"
        >
          {{ currentStep > i ? '✓' : i + 1 }}
        </div>
        <span class="text-xs" :class="currentStep >= i ? 'text-[var(--color-primary)] font-medium' : 'text-gray-400'">
          {{ step }}
        </span>
        <div v-if="i < steps.length - 1" class="w-6 h-px bg-gray-200"></div>
      </div>
    </div>

    <!-- Step 1: Personalize -->
    <div v-if="currentStep === 0" class="px-4 animate-fade-in">
      <div class="card-container p-5">
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2">{{ t('checkout.message_label') }}</label>
          <textarea
            v-model="form.message"
            :placeholder="t('checkout.message_placeholder')"
            class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-card-shadow)] outline-none transition-all resize-none"
            rows="4"
            maxlength="200"
          ></textarea>
          <p class="text-right text-xs text-gray-400 mt-1">{{ form.message.length }}/200</p>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2">{{ t('checkout.recipient_name_label') }}</label>
          <input
            v-model="form.recipientName"
            :placeholder="t('card.recipient_name_placeholder')"
            class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-card-shadow)] outline-none transition-all"
            maxlength="30"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2">{{ t('checkout.simulated_address_label') }}</label>
          <input
            v-model="form.address"
            :placeholder="t('card.delivery_address_placeholder')"
            class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-card-shadow)] outline-none transition-all"
            maxlength="100"
          />
          <p class="text-xs text-gray-400 mt-1">💡 {{ t('card.delivery_address_hint') }}</p>
        </div>
        <button class="btn-primary w-full" @click="currentStep = 1">
          {{ t('common.next') }} →
        </button>
      </div>
    </div>

    <!-- Step 2: Confirm -->
    <div v-if="currentStep === 1" class="px-4 animate-fade-in">
      <div class="card-container p-5">
        <h3 class="font-semibold text-gray-700 mb-4">{{ t('card.card_preview') }}</h3>
        <div class="rounded-xl overflow-hidden mb-4 border border-gray-100">
          <div class="h-40 relative" style="background:linear-gradient(135deg,#fce7f3,#f3e8ff)">
            <img :src="previewImg" class="w-full h-full object-cover" @error="imgFail=true" />
            <div v-if="imgFail" class="absolute inset-0 flex items-center justify-center text-5xl">💝</div>
          </div>
          <div class="p-5 gradient-love text-white text-center">
            <p class="font-message text-white/90">"{{ form.message || '...' }}"</p>
            <div class="mt-4 pt-4 border-t border-white/20">
              <p class="text-sm text-white/80">{{ t('card.to') }}: {{ form.recipientName || '...' }}</p>
            </div>
          </div>
        </div>

        <div class="space-y-3 mb-4 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">{{ t('checkout.card_fee') }}</span>
            <span class="font-semibold">${{ formatPrice(cardTemplate?.price_cents || 0) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">{{ t('checkout.platform_fee') }} (30%)</span>
            <span class="text-gray-400">${{ formatPrice(platformFee) }}</span>
          </div>
          <div class="border-t border-gray-100 pt-3 flex justify-between">
            <span class="font-semibold">{{ t('checkout.you_receive') }} (70%)</span>
            <span class="font-bold text-[var(--color-success)] text-lg">${{ formatPrice(creatorEarning) }}</span>
          </div>
        </div>

        <div class="flex gap-3">
          <button class="btn-secondary flex-1" @click="currentStep = 0">← {{ t('common.back') }}</button>
          <button class="btn-primary flex-1" @click="handleCreateOrder" :disabled="creating">
            {{ creating ? t('common.loading') : t('checkout.confirm_order') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Step 3: Share -->
    <div v-if="currentStep === 2 && shareData" class="px-4 animate-slide-up">
      <div class="card-container p-5 text-center">
        <div class="text-5xl mb-4">🎉</div>
        <h3 class="text-lg font-bold mb-2">{{ t('share.title') }}</h3>
        <p class="text-gray-500 text-sm mb-6">{{ t('share.description') }}</p>

        <div class="bg-gray-50 rounded-lg p-3 mb-4 flex items-center gap-2">
          <code class="flex-1 text-xs text-gray-600 break-all text-left">{{ shareData.share_url }}</code>
          <button
            class="flex-shrink-0 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium active:scale-95"
            @click="copyShareUrl"
          >
            {{ copied ? t('share.copied') : t('share.copy_link') }}
          </button>
        </div>

        <div class="mb-4">
          <canvas ref="qrCanvas" class="w-36 h-36 mx-auto"></canvas>
        </div>

        <p class="text-sm text-yellow-600 bg-yellow-50 rounded-lg p-3 mb-4">
          ⏳ {{ t('share.waiting_for_payment') }}
        </p>

        <NuxtLink :to="localePath(`/order/${shareData.order?.id}`)" class="btn-secondary !inline-flex">
          📋 {{ t('orders.title') }}
        </NuxtLink>

        <NuxtLink :to="localePath('/')" class="btn-primary !inline-flex mt-3 w-full">
          🎨 {{ t('home.title') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const config = useRuntimeConfig()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const steps = computed(() => [t('checkout.step_personalize'), t('checkout.step_confirm'), t('checkout.step_share')])

const currentStep = ref(0)
const creating = ref(false)
const copied = ref(false)
const shareData = ref(null)
const qrCanvas = ref(null)
const cardTemplate = ref(null)

// Get template_id from query params
const templateId = computed(() => route.query.template_id)

const platformFee = computed(() => Math.round((cardTemplate.value?.price_cents || 0) * 0.3))
const creatorEarning = computed(() => (cardTemplate.value?.price_cents || 0) - platformFee.value)

const imgFail = ref(false)
const previewImg = computed(() => {
  const slug = cardTemplate.value?.category_slug || 'love'
  const so = cardTemplate.value?.sort_order || 0
  const idx = (so % 3) + 1
  return '/images/cards/' + slug + '/' + slug + '-' + idx + '.png'
})

const form = reactive({ message: '', recipientName: '', address: '' })

function formatPrice(c) { return (c / 100).toFixed(2) }

// Load card template info
onMounted(async () => {
  if (templateId.value) {
    try {
      const res = await $fetch(`/api/cards/${templateId.value}`)
      cardTemplate.value = (res).card
    } catch (e) {}
  }
})

async function handleCreateOrder() {
  if (!user.value) {
    window.$toast('请先登录', 'error', 2000)
    navigateTo(localePath('/auth/login'))
    return
  }
  if (!templateId.value) {
    window.$toast('请先选择卡片', 'error', 2000)
    return
  }
  creating.value = true
  try {
    // Get access token from Supabase session
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token || ''

    if (!token) {
      window.$toast('登录已过期，请重新登录', 'error', 2000)
      navigateTo(localePath('/auth/login'))
      return
    }

    const res = await $fetch('/api/checkout', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token },
      body: {
        template_id: templateId.value,
        message: form.message,
        recipient_name: form.recipientName,
        delivery_address_simulation: form.address,
      },
    })
    shareData.value = res
    currentStep.value = 2
    // Generate QR code
    nextTick(async () => {
      if (qrCanvas.value) {
        const QRCode = (await import('qrcode')).default
        await QRCode.toCanvas(qrCanvas.value, (res).share_url, { width: 200 })
      }
    })
  } catch (e) {
    { window.$toast(e.message || '创建失败', 'error'); }
  }
  creating.value = false
}

async function copyShareUrl() {
  try {
    await navigator.clipboard.writeText(shareData.value?.share_url || '')
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch (e) {}
}

useHead({ title: "定制卡片 - CardWish" })
</script>
