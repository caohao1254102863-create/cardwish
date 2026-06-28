import { getServiceClient } from '../../services/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = getServiceClient()
    const query = getQuery(event)
    const status = query.status || 'pending'

    const { data, error } = await supabase
      .from('withdrawal_requests')
      .select(`
        id, amount_cents, method, account_info, status, created_at,
        profiles(nickname, phone)
      `)
      .eq('status', status)
      .order('created_at', { ascending: true })
      .limit(50)

    if (error) throw error

    return {
      withdrawals: (data || []).map(function(w) {
        return {
          ...w,
          user_nickname: w.profiles?.nickname || '',
          user_phone: w.profiles?.phone || '',
          amount_dollars: (w.amount_cents / 100).toFixed(2),
        }
      }),
    }
  } catch (e) {
    return { withdrawals: [], error: e.message }
  }
})
