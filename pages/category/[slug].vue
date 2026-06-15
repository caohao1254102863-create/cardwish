<template>
  <div class="pb-4">
    <div class="px-4 pt-4 pb-2">
      <h1 class="text-xl font-bold text-gray-800">{{ catName }}</h1>
    </div>

    <div class="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
      <button
        v-for="s in sorts"
        :key="s.value"
        class="flex-shrink-0 px-4 py-1.5 rounded-full text-sm border transition-all"
        :class="currentSort === s.value
          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
          : 'bg-white text-gray-500 border-gray-200'"
        @click="currentSort = s.value; page = 1; refresh()"
      >
        {{ s.label }}
      </button>
    </div>

    <div class="px-4">
      <CardGrid :cards="cards" :loading="pending" />
    </div>

    <div v-if="hasMore" class="text-center py-4">
      <button class="btn-secondary" @click="loadMore" :disabled="pending">
        {{ pending ? t('common.loading') : (locale === 'zh-CN' ? '加载更多' : 'Load More') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const route = useRoute()

const slug = computed(() => route.params.slug as string)
const currentSort = ref('popular')
const page = ref(1)

const catName = computed(() => {
  const map: Record<string, string> = {
    birthday: '🎂 ' + t('categories.birthday'),
    love: '💕 ' + t('categories.love'),
    flowers: '💐 ' + t('categories.flowers'),
    coffee: '☕ ' + t('categories.coffee'),
    cake: '🍰 ' + t('categories.cake'),
    thanks: '🙏 ' + t('categories.thanks'),
    congratulations: '🎉 ' + t('categories.congratulations'),
    mystery: '🎁 ' + t('categories.mystery'),
    encouragement: '💪 ' + t('categories.encouragement'),
    friendship: '🤝 ' + t('categories.friendship'),
  }
  return map[slug.value] || slug.value
})

const sorts = computed(() => [
  { label: locale.value === 'zh-CN' ? '🔥 最热门' : '🔥 Popular', value: 'popular' },
  { label: locale.value === 'zh-CN' ? '🆕 最新' : '🆕 Newest', value: 'newest' },
  { label: locale.value === 'zh-CN' ? '💰 价格低' : '💰 Price Low', value: 'price_asc' },
  { label: locale.value === 'zh-CN' ? '💰 价格高' : '💰 Price High', value: 'price_desc' },
])

const { data, pending, refresh } = useAsyncData(
  () => `category-${slug.value}-${currentSort.value}-${page.value}`,
  async () => {
    const res = await $fetch('/api/cards', {
      query: {
        category: slug.value,
        sort: currentSort.value,
        page: page.value,
        limit: 20,
        locale: locale.value,
      },
    })
    return (res as any).cards || []
  },
  { watch: [slug, currentSort] }
)

const cards = computed(() => data.value || [])
const hasMore = computed(() => cards.value.length >= 20)

function loadMore() {
  page.value++
  refresh()
}

useHead(() => ({
  title: `${catName.value} - CardWish`,
}))
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
