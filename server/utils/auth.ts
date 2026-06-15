import { getServiceClient } from '../services/supabase'

export async function getServerUser(event: any) {
  const supabase = getServiceClient()
  let accessToken = ''

  // 1. Try our custom auth_token cookie first
  const authCookie = getCookie(event, 'auth_token')
  if (authCookie) {
    accessToken = authCookie
  }

  // 2. Try Authorization header
  if (!accessToken) {
    const authHeader = getHeader(event, 'Authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      accessToken = authHeader.replace('Bearer ', '')
    }
  }

  // 3. Fallback to Supabase cookies
  if (!accessToken) {
    const cookies = parseCookies(event)
    for (const [name, value] of Object.entries(cookies)) {
      if (!name.includes('sb-') && !name.includes('supabase')) continue
      if (typeof value === 'string' && value.startsWith('eyJ')) {
        accessToken = value
        break
      }
      try {
        const parsed = JSON.parse(decodeURIComponent(value as string))
        if (parsed.access_token) {
          accessToken = parsed.access_token
          break
        }
      } catch { continue }
    }
  }

  if (!accessToken) return null

  const { data: { user }, error } = await supabase.auth.getUser(accessToken)
  if (error || !user) return null
  return user
}
