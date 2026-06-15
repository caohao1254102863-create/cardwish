/**
 * Format price from cents to display string.
 */
export function formatPrice(cents: number, currency = 'USD'): string {
  const symbol = currency === 'CNY' ? '¥' : '$'
  return `${symbol}${(cents / 100).toFixed(2)}`
}

/**
 * Format date to relative time string.
 */
export function formatRelativeTime(dateStr: string, locale = 'en'): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (locale === 'zh-CN') {
    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 30) return `${days}天前`
  } else {
    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 30) return `${days}d ago`
  }

  return date.toLocaleDateString(locale === 'zh-CN' ? 'zh-CN' : 'en-US')
}

/**
 * Calculate platform fee and creator earning.
 */
export function calculateSplit(totalCents: number, platformPercent = 30) {
  const platformFee = Math.round(totalCents * platformPercent / 100)
  return {
    platformFee,
    creatorEarning: totalCents - platformFee,
  }
}
