<template>
  <div class="p-10 text-center">
    <p class="mb-4">Click count: {{ count }}</p>
    <button class="btn-primary" @click="count++">+1</button>
    <button class="btn-secondary ml-2" @click="show = !show">Toggle</button>
    <p v-if="show" class="mt-4 text-green-500">✅ Vue is working!</p>
  </div>
</template>

<script setup>
const count = ref(0)
const show = ref(false)
</script>
