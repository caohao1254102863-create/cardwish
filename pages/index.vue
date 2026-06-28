<template>
  <div class="pb-4">
    <!-- Hero Banner -->
    <section class="relative px-4 pt-6 pb-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gradient mb-2">{{ t('home.title') }}</h1>
        <p class="text-gray-500 text-sm mb-6">{{ t('home.subtitle') }}</p>
        <NuxtLink
          :to="localePath('/category/birthday')"
          class="btn-primary inline-flex"
        >
          🎨 {{ t('common.view_all') }}
        </NuxtLink>
      </div>
    </section>

    <!-- How It Works -->
    <section class="px-4 mb-8">
      <div class="card-container p-5">
        <h3 class="text-lg font-bold text-center mb-4">{{ t('home.how_it_works') }}</h3>
        <div class="grid grid-cols-4 gap-2">
          <div v-for="(step, i) in steps" :key="i" class="text-center">
            <div class="w-10 h-10 rounded-full bg-[var(--color-bg)] flex items-center justify-center text-lg mx-auto mb-2">
              {{ step.icon }}
            </div>
            <p class="text-xs font-semibold text-gray-700">{{ step.title }}</p>
            <p class="text-[10px] text-gray-400 leading-tight mt-1">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="px-4 mb-6">
      <h3 class="text-lg font-bold mb-3">{{ t('home.categories') }}</h3>
      <div class="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        <NuxtLink
          v-for="cat in categoryList"
          :key="cat.slug"
          :to="localePath(`/category/${cat.slug}`)"
          class="flex flex-col items-center gap-1.5 flex-shrink-0 no-underline
                 w-[72px] py-2 rounded-xl hover:bg-white active:scale-95 transition-all"
        >
          <div class="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-2xl">
            {{ cat.icon }}
          </div>
          <span class="text-xs text-gray-600 text-center leading-tight">{{ cat.name }}</span>
        </NuxtLink>
      </div>
    </section>

    <!-- Hot Picks -->
    <section class="px-4 mb-6">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-bold">{{ t('home.hot_picks') }}</h3>
        <NuxtLink :to="localePath('/category/birthday')" class="text-sm text-[var(--color-primary)] no-underline">
          {{ t('common.view_all') }} →
        </NuxtLink>
      </div>
      <CardGrid :cards="allCards.slice(0, 6)" :loading="pending" />
    </section>

    <!-- All Cards -->
    <section class="px-4 mb-6">
      <h3 class="text-lg font-bold mb-3">{{ t('home.featured') }}</h3>
      <CardGrid :cards="allCards.slice(6, 14)" :loading="pending" />
    </section>
  </div>
</template>

<script setup>
const { t, locale } = useI18n()
const localePath = useLocalePath()

const steps = computed(() => [
  { icon: '🎨', title: t('home.step1_title'), desc: t('home.step1_desc') },
  { icon: '✏️', title: t('home.step2_title'), desc: t('home.step2_desc') },
  { icon: '📤', title: t('home.step3_title'), desc: t('home.step3_desc') },
  { icon: '💌', title: t('home.step4_title'), desc: t('home.step4_desc') },
])

// Fetch cards and categories client-side only
const allCards = ref([])
const catList = ref([])
const pending = ref(true)

async function fetchHomeData() {
  try {
    const cardsRes = await $fetch('/api/cards', { query: { sort: 'popular', limit: 20 } })
    const catsRes = await $fetch('/api/categories')
    allCards.value = cardsRes.cards || []
    catList.value = (catsRes.categories || []).map(function(c) {
      return { ...c, name: locale.value === 'zh-CN' ? c.name_zh : c.name_en }
    })
  } catch (e) {}
  pending.value = false
}

onMounted(() => fetchHomeData())
watch(locale, () => fetchHomeData())

const categoryList = computed(() => catList.value)

useHead({
  title: 'CardWish - Beautiful Digital Greeting Cards',
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
