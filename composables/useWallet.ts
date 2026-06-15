/**
 * Composable for wallet and earnings data.
 */
export function useWallet() {
  const config = useRuntimeConfig()
  const platformFeePercent = config.public.platformFeePercent as number
  const creatorPercent = config.public.creatorPercent as number

  function calculateSplit(totalCents: number) {
    const platformFee = Math.round(totalCents * platformFeePercent / 100)
    const creatorEarning = totalCents - platformFee
    return { platformFee, creatorEarning }
  }

  function formatCurrency(cents: number, currency = 'USD'): string {
    const symbol = currency === 'CNY' ? '¥' : '$'
    return `${symbol}${(cents / 100).toFixed(2)}`
  }

  async function fetchWallet() {
    try {
      const { data } = await useFetch('/api/user/wallet')
      return data.value
    } catch (e) {
      return null
    }
  }

  async function fetchEarnings(page = 1, limit = 20) {
    try {
      const { data } = await useFetch('/api/user/earnings', {
        query: { page, limit },
      })
      return data.value
    } catch (e) {
      return { earnings: [] }
    }
  }

  return {
    calculateSplit,
    formatCurrency,
    fetchWallet,
    fetchEarnings,
    platformFeePercent,
    creatorPercent,
  }
}
