<template>
  <div>
    <!-- Loading skeleton -->
    <div v-if="loading" class="grid grid-cols-2 gap-3">
      <div
        v-for="i in 4"
        :key="i"
        class="card-container animate-shimmer"
      >
        <div class="aspect-[3/4] bg-gray-100"></div>
        <div class="p-3 space-y-2">
          <div class="h-4 bg-gray-100 rounded w-3/4"></div>
          <div class="h-5 bg-gray-100 rounded w-1/3"></div>
        </div>
      </div>
    </div>

    <!-- Card grid -->
    <div v-else-if="cards.length > 0" class="grid grid-cols-2 gap-3">
      <CardItem
        v-for="card in cards"
        :key="card.id"
        :card="card"
      />
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-12">
      <div class="text-4xl mb-3">🃏</div>
      <p class="text-gray-400 text-sm">{{ t('common.no_data') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

defineProps<{
  cards: any[]
  loading?: boolean
}>()
</script>
