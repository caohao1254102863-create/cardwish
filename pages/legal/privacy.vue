<template>
  <div class="px-4 py-6 max-w-lg mx-auto">
    <h1 class="text-2xl font-bold mb-4">{{ t('footer.privacy') }}</h1>
    <div class="prose prose-sm text-gray-600 space-y-4">
      <p>Last updated: June 2026</p>
      <h3>1. Data Collection</h3>
      <p>We collect only the minimum information needed: email address for authentication and transaction records for payment processing.</p>
      <h3>2. Payment Data</h3>
      <p>Payment information is processed by Stripe and never stored on our servers.</p>
      <h3>3. Data Sharing</h3>
      <p>We do not sell or share your personal data with third parties.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
