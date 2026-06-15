/**
 * Composable for sharing functionality.
 */
export function useShare() {
  const { t } = useI18n()

  async function copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (e) {
      // Fallback for older browsers / non-HTTPS
      const el = document.createElement('textarea')
      el.value = text
      el.style.position = 'fixed'
      el.style.left = '-9999px'
      document.body.appendChild(el)
      el.select()
      const success = document.execCommand('copy')
      document.body.removeChild(el)
      return success
    }
  }

  function shareToWhatsApp(text: string, url: string) {
    const msg = encodeURIComponent(`${text} ${url}`)
    window.open(`https://wa.me/?text=${msg}`, '_blank')
  }

  function shareToMessenger(url: string) {
    const encoded = encodeURIComponent(url)
    window.open(`https://www.facebook.com/dialog/send?link=${encoded}&app_id=0`, '_blank')
  }

  function shareToWeChat(url: string) {
    // In WeChat browser, use the built-in share
    // Outside WeChat, just copy the link
    copyToClipboard(url)
  }

  function getShareUrl(shareCode: string): string {
    const config = useRuntimeConfig()
    return `${config.public.siteUrl}/pay/${shareCode}`
  }

  return {
    copyToClipboard,
    shareToWhatsApp,
    shareToMessenger,
    shareToWeChat,
    getShareUrl,
  }
}
