<template>
  <div class="pb-6">
    <!-- Loading -->
    <div v-if="pending" class="p-4">
      <div class="aspect-[4/3] bg-gray-100 rounded-xl animate-shimmer mb-4"></div>
      <div class="h-6 bg-gray-100 rounded w-3/4 animate-shimmer mb-2"></div>
      <div class="h-4 bg-gray-100 rounded w-1/2 animate-shimmer"></div>
    </div>

    <!-- Error -->
    <div v-else-if="!card" class="p-8 text-center">
      <div class="text-4xl mb-3">😔</div>
      <p class="text-gray-500 mb-4">{{ t('errors.card_not_found') }}</p>
      <NuxtLink :to="localePath('/')" class="btn-primary !inline-flex">
        ← {{ t('common.back') }}
      </NuxtLink>
    </div>

    <!-- Card Detail -->
    <template v-else>
      <div class="relative">
        <div class="w-full aspect-[4/3] relative overflow-hidden" :class="gradientClass">
          <img
            :src="cardImage"
            :alt="card.name"
            class="w-full h-full object-cover"
            @error="imgFail = true"
          />
          <div v-if="imgFail" class="absolute inset-0 flex items-center justify-center text-7xl">
            {{ categoryEmoji }}
          </div>
        </div>
      </div>

      <div class="px-4 pt-5">
        <div class="flex items-start justify-between mb-2">
          <h1 class="text-2xl font-bold text-gray-800 flex-1">{{ card.name }}</h1>
        </div>
        <p class="text-gray-500 text-sm mb-4">{{ card.description }}</p>

        <div class="flex items-center gap-2 mb-4">
          <span class="badge bg-pink-50 text-[var(--color-primary)]">
            {{ catName }}
          </span>
          <span v-for="tag in card.tags" :key="tag" class="badge bg-gray-100 text-gray-500">
            {{ tag }}
          </span>
        </div>

        <div class="card-container p-4 mb-6">
          <div class="flex items-center justify-between">
            <span class="text-gray-500">{{ t('card.price') }}</span>
            <span class="price-tag text-2xl">
              <span class="text-sm mr-0.5">$</span>
              {{ formatPrice(card.price_cents) }}
            </span>
          </div>
        </div>

        <NuxtLink
          :to="localePath(`/checkout?template_id=${route.params.id}`)"
          class="btn-primary w-full !py-4 !text-lg"
        >
          ✨ {{ t('card.create_card') }}
        </NuxtLink>

        <p class="text-center text-xs text-gray-400 mt-3">{{ t('checkout.fee_note') }}</p>
      </div>
    </template>
  </div>
</template>

<script setup>
const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const { data, pending } = useAsyncData(
  () => `card-${route.params.id}`,
  () => $fetch(`/api/cards/${route.params.id}`, { query: { locale: locale.value } })
)

const imgFail = ref(false)
const cardImage = computed(() => {
  if (card.value?.images && card.value.images[0] && card.value.images[0].url) {
    return card.value.images[0].url
  }
  const slug = card.value?.category_slug || 'love'
  const idx = (parseInt(card.value?.sort_order) % 3) + 1
  return '/images/cards/' + slug + '/' + slug + '-' + idx + '.png'
})

const card = computed(() => (data.value)?.card || null)

const gradientClass = computed(() => {
  const m = { love: 'gradient-love', birthday: 'gradient-birthday', flowers: 'gradient-floral', coffee: 'gradient-coffee', congratulations: 'gradient-sunset', thanks: 'gradient-forest', mystery: 'gradient-royal' }
  return m[card.value?.category_slug || ''] || 'gradient-love'
})

const categoryEmoji = computed(() => {
  const m = { love: '💕', birthday: '🎂', flowers: '💐', coffee: '☕', cake: '🍰', thanks: '🙏', congratulations: '🎉', mystery: '🎁', encouragement: '💪', friendship: '🤝' }
  return m[card.value?.category_slug || ''] || '💝'
})

const catName = computed(() => t(`categories.${card.value?.category_slug}`) || card.value?.category_slug)

function formatPrice(c) { return (c / 100).toFixed(2) }

useHead(() => ({
  title: card.value ? `${card.value.name} - CardWish` : 'CardWish',
}))
</script>
