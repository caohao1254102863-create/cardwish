<template>
  <div class="pb-6">
    <div class="px-4 pt-4 pb-2"><h1 class="text-xl font-bold">{{ t('received.title') }}</h1></div>

    <div class="px-4">
      <div v-if="pending" class="grid grid-cols-2 gap-3">
        <div v-for="i in 4" :key="i" class="card-container animate-shimmer"><div class="aspect-[3/4] bg-gray-100"></div></div>
      </div>

      <div v-else-if="cards.length === 0" class="text-center py-12">
        <div class="text-5xl mb-3">💌</div>
        <p class="text-gray-400 mb-4">{{ t('received.no_cards') }}</p>
        <NuxtLink :to="localePath('/')" class="btn-primary !inline-flex">{{ t('home.title') }}</NuxtLink>
      </div>

      <div v-else class="grid grid-cols-2 gap-3">
        <div v-for="card in cards" :key="card.id"
          class="card-container relative group active:scale-[0.98] transition-transform cursor-pointer"
          @click="navigateTo(localePath(`/user/received/${card.id}`))">
          <div v-if="card.is_new" class="absolute top-2 right-2 z-10 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
            {{ t('received.new_badge') }}
          </div>
          <div class="aspect-[3/4] gradient-love flex items-center justify-center text-5xl">💝</div>
          <div class="p-3">
            <p class="text-xs text-gray-400">{{ card.message?.substring(0, 30) || '...' }}</p>
            <p class="text-xs text-gray-300">{{ formatDate(card.created_at) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const localePath = useLocalePath()

const { data, pending } = useAsyncData('user-received', () => $fetch('/api/user/received-cards'))
const cards = computed(() => (data.value)?.cards || [])

function formatDate(d) { return new Date(d).toLocaleDateString() }
useHead({ title: "收到的卡片 - CardWish" })
</script>
