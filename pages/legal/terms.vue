<template>
  <div class="px-4 py-6 max-w-lg mx-auto">
    <h1 class="text-2xl font-bold mb-4">{{ t('footer.terms') }}</h1>
    <div class="prose prose-sm text-gray-600 space-y-4">
      <p>Last updated: June 2026</p>
      <h3>1. Service Description</h3>
      <p>CardWish is a digital greeting card platform that allows users to create and share virtual greeting cards. Friends can pay to send these digital cards.</p>
      <h3>2. Platform Fees</h3>
      <p>Platform charges a 30% service fee on each transaction. The card recipient receives 70% of the payment amount.</p>
      <h3>3. Digital Products</h3>
      <p>All cards are digital products. No physical goods are delivered.</p>
      <h3>4. Payments</h3>
      <p>Payments are processed securely through Stripe. By making a payment, you agree to Stripe's terms of service.</p>
      <h3>5. Refunds</h3>
      <p>Due to the digital nature of our products, all sales are final. Refunds are issued only in cases of technical errors.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
