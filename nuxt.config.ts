// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@nuxtjs/supabase',
  ],

  // Auto-import components without directory prefixes
  components: [
    { path: '~/components/global', prefix: '' },
    { path: '~/components/cards', prefix: '' },
    { path: '~/components/home', prefix: '' },
    { path: '~/components/checkout', prefix: '' },
    { path: '~/components/share', prefix: '' },
    { path: '~/components/payment', prefix: '' },
    { path: '~/components/wallet', prefix: '' },
    { path: '~/components/received', prefix: '' },
    { path: '~/components/user', prefix: '' },
    { path: '~/components/ui', prefix: '' },
  ],

  // i18n configuration — Chinese as default
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'zh-CN',
    locales: [
      { code: 'zh-CN', name: '中文', file: 'zh-CN.json' },
      { code: 'en', name: 'English', file: 'en.json' },
    ],
    lazy: false,
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'locale',
      redirectOnRoot: true,
      alwaysRedirect: false,
    },
    vueI18n: './i18n.config.ts',
  },

  // Supabase configuration
  supabase: {
    url: process.env.SUPABASE_URL || '',
    key: process.env.SUPABASE_KEY || '',
    redirect: false,
    cookieOptions: {
      maxAge: 28800,
      sameSite: 'lax',
      secure: true,
    },
    clientOptions: {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    },
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/callback',
      exclude: ['/', '/card/**', '/category/**', '/pay/**', '/legal/**'],
    },
  },

  // CSS
  css: ['vant/lib/index.css', '@/assets/css/main.css'],

  // Vite configuration
  vite: {},

  // Nitro (Netlify Functions) configuration
  nitro: {
    preset: 'cloudflare-pages',
  },

  // App configuration
  app: {
    head: {
      title: 'CardWish - Beautiful Digital Greeting Cards',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'description', content: 'Create beautiful digital greeting cards, share with friends, and let them pay for it!' },
        { property: 'og:title', content: 'CardWish - Beautiful Digital Greeting Cards' },
        { property: 'og:description', content: 'Create beautiful digital greeting cards, share with friends, and let them pay for it!' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'CardWish' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  // Runtime config
  runtimeConfig: {
    public: {
      siteUrl: process.env.SITE_URL || 'http://localhost:3000',
      platformFeePercent: 30,
      creatorPercent: 70,
      minWithdrawalCents: 1000,
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseKey: process.env.SUPABASE_KEY || '',
    },
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
})
