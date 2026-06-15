<template>
  <NuxtLink
    :to="localePath(`/card/${card.id}`)"
    class="card-container no-underline group active:scale-[0.98] transition-transform duration-200"
  >
    <!-- Card image -->
    <div
      class="aspect-[3/4] relative overflow-hidden"
      :class="getGradientClass(card.category_slug)"
    >
      <img
        v-if="card.images?.[0]?.url"
        :src="card.images[0].url"
        :alt="card.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      <!-- Fallback gradient when no image -->
      <div
        v-else
        class="w-full h-full flex items-center justify-center text-5xl"
      >
        {{ getCategoryEmoji(card.category_slug) }}
      </div>

      <!-- Tags -->
      <div v-if="card.tags?.length" class="absolute top-2 left-2 flex flex-col gap-1">
        <span
          v-for="tag in card.tags"
          :key="tag"
          class="badge bg-white/90 text-[var(--color-primary)] text-[10px]"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- Card info -->
    <div class="p-3">
      <h4 class="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
        {{ card.name }}
      </h4>
      <div class="price-tag text-base">
        <span class="text-xs mr-0.5">{{ currencySymbol }}</span>
        {{ formatPrice(card.price_cents) }}
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const localePath = useLocalePath()

const props = defineProps<{
  card: {
    id: string
    name: string
    name_zh?: string
    category_slug?: string
    price_cents: number
    currency?: string
    images?: { url: string }[]
    tags?: string[]
  }
}>()

const currencySymbol = computed(() => {
  if (props.card.currency === 'CNY') return '¥'
  return '$'
})

function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2)
}

function getGradientClass(category?: string): string {
  const map: Record<string, string> = {
    love: 'gradient-love',
    birthday: 'gradient-birthday',
    flowers: 'gradient-floral',
    coffee: 'gradient-coffee',
    congratulations: 'gradient-sunset',
    thanks: 'gradient-forest',
    mystery: 'gradient-royal',
  }
  return map[category || ''] || 'gradient-love'
}

function getCategoryEmoji(category?: string): string {
  const map: Record<string, string> = {
    love: '💕',
    birthday: '🎂',
    flowers: '💐',
    coffee: '☕',
    cake: '🍰',
    thanks: '🙏',
    congratulations: '🎉',
    mystery: '🎁',
    encouragement: '💪',
    friendship: '🤝',
  }
  return map[category || ''] || '💝'
}
</script>
