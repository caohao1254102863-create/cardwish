<template>
  <div class="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
    <NuxtLink
      v-for="cat in categories"
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
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()

const categories = computed(() => [
  { slug: 'birthday', icon: '🎂', name: t('categories.birthday') },
  { slug: 'love', icon: '💕', name: t('categories.love') },
  { slug: 'flowers', icon: '💐', name: t('categories.flowers') },
  { slug: 'coffee', icon: '☕', name: t('categories.coffee') },
  { slug: 'cake', icon: '🍰', name: t('categories.cake') },
  { slug: 'thanks', icon: '🙏', name: t('categories.thanks') },
  { slug: 'congratulations', icon: '🎉', name: t('categories.congratulations') },
  { slug: 'mystery', icon: '🎁', name: t('categories.mystery') },
  { slug: 'encouragement', icon: '💪', name: t('categories.encouragement') },
  { slug: 'friendship', icon: '🤝', name: t('categories.friendship') },
])
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
