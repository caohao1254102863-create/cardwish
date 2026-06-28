export function useToast() {
  function toast(msg, type = 'info', duration = 2500) {
    if (typeof window !== 'undefined' && window.$toast) {
      window.$toast(msg, type, duration)
    } else {
      alert(msg)
    }
  }

  return { toast }
}
