<template>
  <div class="pb-6">
    <div class="px-4 pt-4 pb-2">
      <NuxtLink :to="localePath('/user/received')" class="text-[var(--color-primary)] text-sm no-underline">
        ← {{ t('common.back') }}
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="p-4 space-y-4">
      <div class="aspect-[3/4] bg-gray-100 rounded-xl animate-shimmer"></div>
    </div>

    <!-- Card viewer -->
    <div v-else-if="card" class="px-4 animate-fade-in">
      <div class="card-container overflow-hidden">
        <!-- Full card display -->
        <div class="p-8 text-white text-center" :class="cardGradient">
          <div class="text-6xl mb-6">💝</div>
          <div class="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <p class="font-message text-white text-xl leading-relaxed">
              "{{ card.message || '...' }}"
            </p>
            <div class="mt-6 pt-6 border-t border-white/20">
              <p class="text-sm text-white/80">{{ t('card.to') }}: {{ card.recipient_name }}</p>
              <p class="text-sm text-white/60 mt-1">
                {{ t('received.paid_by', { payer: card.payer_nickname || 'A friend' }) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Card info -->
        <div class="p-5 space-y-3 text-center">
          <p class="text-sm text-gray-400">{{ t('received.card_from', { payer: card.payer_nickname || 'A friend' }) }}</p>
          <p v-if="card.payer_message" class="font-message text-[var(--color-primary)] text-lg">
            "{{ card.payer_message }}"
          </p>
          <p class="text-xs text-gray-300">{{ formatDate(card.created_at) }}</p>
        </div>
      </div>

      <!-- Download button -->
      <button class="btn-secondary w-full mt-4" @click="downloadCard">
        💾 {{ t('received.download') }}
      </button>
    </div>

    <!-- Error -->
    <div v-else class="p-8 text-center">
      <p class="text-gray-400">{{ t('errors.not_found') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const card = ref<any>(null)
const loading = ref(true)

const cardGradient = computed(() => {
  const map: Record<string, string> = { love: 'gradient-love', birthday: 'gradient-birthday', flowers: 'gradient-floral', coffee: 'gradient-coffee' }
  return map[card.value?.category_slug || ''] || 'gradient-love'
})

function formatDate(date: string) { return new Date(date).toLocaleDateString() }

function downloadCard() {
  // TODO: generate and download card image
  alert('Download feature coming soon!')
}

onMounted(async () => {
  try {
    const { data } = await useFetch(`/api/user/received-cards/${route.params.id}`)
    if (data.value) card.value = data.value
  } catch (e) {}
  loading.value = false
})
</script>
