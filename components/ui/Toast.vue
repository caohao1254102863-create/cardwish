<template>
  <Teleport to="body">
    <TransitionGroup
      name="toast"
      tag="div"
      class="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-[90vw] max-w-sm"
    >
      <div
        v-for="item in items"
        :key="item.id"
        class="px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-center animate-slide-up"
        :class="item.type === 'error' ? 'bg-red-500 text-white' : item.type === 'success' ? 'bg-green-500 text-white' : 'bg-gray-800 text-white'"
        @click="remove(item.id)"
      >
        {{ item.message }}
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup>
const items = ref([])
let nextId = 0

function show(message, type = 'info', duration = 2500) {
  const id = ++nextId
  items.value.push({ id, message, type })
  if (duration > 0) setTimeout(() => remove(id), duration)
}

function remove(id) {
  items.value = items.value.filter(i => i.id !== id)
}

// Expose to global
if (typeof window !== 'undefined') {
  window.$toast = show
}

defineExpose({ show, remove })
</script>
