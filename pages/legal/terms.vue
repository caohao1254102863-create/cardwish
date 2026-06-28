<template>
  <div class="px-4 py-6 max-w-lg mx-auto">
    <h1 class="text-2xl font-bold mb-4">{{ t('footer.terms') }}</h1>
    <div class="prose prose-sm text-gray-600 space-y-4">
      <p>{{ lastUpdated }}</p>
      <h3>1. {{ sections[0].title }}</h3>
      <p>{{ sections[0].body }}</p>
      <h3>2. {{ sections[1].title }}</h3>
      <p>{{ sections[1].body }}</p>
      <h3>3. {{ sections[2].title }}</h3>
      <p>{{ sections[2].body }}</p>
      <h3>4. {{ sections[3].title }}</h3>
      <p>{{ sections[3].body }}</p>
      <h3>5. {{ sections[4].title }}</h3>
      <p>{{ sections[4].body }}</p>
    </div>
  </div>
</template>

<script setup>
const { t, locale } = useI18n()

const lastUpdated = computed(() => locale.value === 'zh-CN' ? '最后更新：2026年6月' : 'Last updated: June 2026')

const sections = computed(() => locale.value === 'zh-CN' ? [
  { title: '服务说明', body: 'CardWish 是一个数字心意卡片平台，用户可以创建并分享虚拟卡片，好友可为其代付款项并送达精美数字卡片。' },
  { title: '平台费用', body: '平台对每笔交易收取 30% 的服务费，卡片发起者获得 70% 的付款收益。' },
  { title: '数字产品', body: '所有卡片均为数字虚拟产品，不涉及实物配送。付款后卡片以数字形式送达。' },
  { title: '支付安全', body: '支付由 PayPal 安全处理。付款即表示您同意 PayPal 的服务条款。' },
  { title: '退款政策', body: '由于产品的数字虚拟属性，所有交易均不支持退款。仅在技术故障导致的情况下可申请退款处理。' },
] : [
  { title: 'Service Description', body: 'CardWish is a digital greeting card platform that allows users to create and share virtual greeting cards. Friends can pay to send these beautiful digital cards.' },
  { title: 'Platform Fees', body: 'Platform charges a 30% service fee on each transaction. The card creator receives 70% of the payment amount.' },
  { title: 'Digital Products', body: 'All cards are digital products. No physical goods are delivered. Cards are delivered digitally upon payment.' },
  { title: 'Payment Security', body: 'Payments are processed securely through PayPal. By making a payment, you agree to PayPal\'s terms of service.' },
  { title: 'Refund Policy', body: 'Due to the digital nature of our products, all sales are final. Refunds are issued only in cases of technical errors.' },
])
</script>
