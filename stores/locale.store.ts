import { defineStore } from 'pinia'

export const useLocaleStore = defineStore('locale', () => {
  const { locale } = useI18n()
  const switchLocalePath = useSwitchLocalePath()

  const currentLocale = computed(() => locale.value)
  const isZh = computed(() => locale.value === 'zh-CN')

  function toggle() {
    const target = currentLocale.value === 'en' ? 'zh-CN' : 'en'
    const path = switchLocalePath(target)
    navigateTo(path)
  }

  function setLocale(target: 'en' | 'zh-CN') {
    const path = switchLocalePath(target)
    navigateTo(path)
  }

  return {
    currentLocale,
    isZh,
    toggle,
    setLocale,
  }
})
