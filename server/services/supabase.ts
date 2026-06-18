import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/supabase'

function getSupabaseConfig() {
  const config = useRuntimeConfig()
  return {
    url: process.env.SUPABASE_URL || config.public.supabaseUrl || '',
    anonKey: process.env.SUPABASE_KEY || config.public.supabaseKey || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || config.supabaseServiceRoleKey || '',
  }
}

export function getAnonClient() {
  const { url, anonKey } = getSupabaseConfig()
  if (!url || !anonKey) {
    throw new Error(`Missing SUPABASE_URL (${!!url}) or SUPABASE_KEY (${!!anonKey})`)
  }
  return createClient<Database>(url, anonKey)
}

export function getServiceClient() {
  const { url, serviceRoleKey } = getSupabaseConfig()
  if (!url || !serviceRoleKey) {
    throw new Error(`Missing SUPABASE_URL (${!!url}) or SUPABASE_SERVICE_ROLE_KEY (${!!serviceRoleKey})`)
  }
  return createClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

/**
 * Get best available client — prefers service role, falls back to anon.
 */
export function getClient() {
  const { url, anonKey, serviceRoleKey } = getSupabaseConfig()
  if (!url) throw new Error('Missing SUPABASE_URL')
  const key = serviceRoleKey || anonKey
  if (!key) throw new Error('Missing Supabase key')
  return createClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export async function getUserFromEvent(event: any) {
  const supabase = getServiceClient()
  const authHeader = getHeader(event, 'Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return null
  return user
}

export async function ensureProfileAndWallet(supabase: any, userId: string) {
  const { data: profile } = await supabase.from('profiles').select('id').eq('id', userId).single()
  if (!profile) {
    await supabase.from('profiles').insert({ id: userId, preferred_locale: 'zh-CN' })
  }
  const { data: wallet } = await supabase.from('wallets').select('id').eq('user_id', userId).single()
  if (!wallet) {
    await supabase.from('wallets').insert({ user_id: userId, balance_cents: 0, total_earned_cents: 0, total_withdrawn_cents: 0 })
  }
}

export function generateShareCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length))
  return code
}

export function generateOrderNumber(): string {
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `CRD-${dateStr}-${random}`
}
