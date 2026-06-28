<template>
  <div class="px-4 py-6 max-w-lg mx-auto">
    <h1 class="text-2xl font-bold mb-4">{{ t('footer.privacy') }}</h1>
    <div class="prose prose-sm text-gray-600 space-y-4">
      <p>{{ lastUpdated }}</p>
      <h3>1. {{ sections[0].title }}</h3>
      <p>{{ sections[0].body }}</p>
      <h3>2. {{ sections[1].title }}</h3>
      <p>{{ sections[1].body }}</p>
      <h3>3. {{ sections[2].title }}</h3>
      <p>{{ sections[2].body }}</p>
    </div>
  </div>
</template>

<script setup>
const { t, locale } = useI18n()

const lastUpdated = computed(() => locale.value === 'zh-CN' ? '最后更新：2026年6月' : 'Last updated: June 2026')

const sections = computed(() => locale.value === 'zh-CN' ? [
  { title: '数据收集', body: '我们仅收集提供服务所需的最少信息：用于身份验证的手机号，以及用于支付处理的交易记录。' },
  { title: '支付数据', body: '支付信息由 PayPal 处理，不会在我们的服务器上存储您的银行卡或支付账户信息。' },
  { title: '数据分享', body: '我们不会向第三方出售或分享您的个人数据。您的隐私安全是我们的首要承诺。' },
] : [
  { title: 'Data Collection', body: 'We collect only the minimum information needed: phone number for authentication and transaction records for payment processing.' },
  { title: 'Payment Data', body: 'Payment information is processed by PayPal and never stored on our servers. We do not retain your card or payment account details.' },
  { title: 'Data Sharing', body: 'We do not sell or share your personal data with third parties. Your privacy is our top commitment.' },
])
</script>
