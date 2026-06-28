<template>
  <NuxtLink
    :to="localePath('/card/' + card.id)"
    class="bg-white rounded-xl overflow-hidden no-underline group active:scale-98 transition-all duration-200 block shadow-sm border border-gray-50"
  >
    <!-- Card image area -->
    <div class="aspect-square relative overflow-hidden" :class="gradientBg">
      <img
        :src="cardImage"
        :alt="card.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
        @error="imgFail = true"
      />
      <div v-if="imgFail" class="w-full h-full flex items-center justify-center text-6xl">
        {{ catEmoji }}
      </div>

      <!-- Price badge -->
      <div class="absolute bottom-2 right-2 rounded-full px-2.5 py-1 text-xs font-bold text-white shadow"
        style="background:rgba(255,107,129,0.9)">
        ${{ fmt(card.price_cents) }}
      </div>

      <!-- Tag badges -->
      <div v-if="card.tags && card.tags.length" class="absolute top-2 left-2 flex flex-wrap gap-1">
        <span v-for="tag in card.tags" :key="tag"
          class="px-1.5 py-0.5 rounded-full text-[10px] font-medium"
          :class="tag === 'Hot' || tag === '热门' ? 'bg-red-100 text-red-500' : tag === 'New' || tag === '新品' ? 'bg-blue-100 text-blue-500' : 'bg-white/80 text-gray-600'">
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- Card info -->
    <div class="p-3">
      <p class="text-xs text-gray-400 mb-1">{{ catLabel }}</p>
      <h4 class="text-sm font-semibold text-gray-800 line-clamp-1 mb-1">{{ card.name }}</h4>
      <span class="text-xs text-red-400 font-semibold">${{ fmt(card.price_cents) }}</span>
    </div>
  </NuxtLink>
</template>

<script setup>
const { locale } = useI18n()
const localePath = useLocalePath()

const props = defineProps({
  card: Object,
})

const catEmojiMap = { love: '💕', birthday: '🎂', flowers: '💐', coffee: '☕', cake: '🍰', thanks: '🙏', congratulations: '🎉', mystery: '🎁', encouragement: '💪', friendship: '🤝' }
const catLabelMap = { love: 'Love', birthday: 'Birthday', flowers: 'Flowers', coffee: 'Coffee', cake: 'Cake', thanks: 'Thanks', congratulations: 'Congrats', mystery: 'Mystery', encouragement: 'Cheer', friendship: 'Friends' }
const gradientMap = { love: 'gradient-love', birthday: 'gradient-birthday', flowers: 'gradient-floral', coffee: 'gradient-coffee', congratulations: 'gradient-sunset', thanks: 'gradient-forest', mystery: 'gradient-royal' }

const imgFail = ref(false)
const cardImage = computed(() => {
  if (props.card?.images && props.card.images[0] && props.card.images[0].url) {
    return props.card.images[0].url
  }
  const slug = props.card?.category_slug || 'love'
  const so = props.card?.sort_order || 0
  const idx = (so % 3) + 1
  return '/images/cards/' + slug + '/' + slug + '-' + idx + '.png'
})
const catEmoji = computed(() => catEmojiMap[props.card?.category_slug] || '💝')
const catLabel = computed(() => {
  const slug = props.card?.category_slug
  if (!slug) return ''
  if (locale.value === 'zh-CN') {
    const zhMap = { love: '浪漫爱情', birthday: '生日祝福', flowers: '鲜花祝福', coffee: '咖啡茶饮', cake: '蛋糕甜点', thanks: '感谢有你', congratulations: '祝贺庆祝', mystery: '神秘盲盒', encouragement: '加油鼓励', friendship: '友谊长存' }
    return zhMap[slug] || slug
  }
  return catLabelMap[slug] || slug
})
const gradientBg = computed(() => gradientMap[props.card?.category_slug] || 'gradient-love')

function fmt(c) { return (c / 100).toFixed(2) }
</script>
