import { getServiceClient } from '../../services/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = getServiceClient()
    const user = await getServerUser(event)
    if (!user) {
      setResponseStatus(event, 401)
      return { error: 'Login required' }
    }

    const query = getQuery(event)
    const limit = Math.min(parseInt(query.limit || '20'), 50)

    const { data, error } = await supabase
      .from('withdrawal_requests')
      .select('id, amount_cents, method, status, created_at, processed_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return { withdrawals: data || [] }
  } catch (e) {
    return { withdrawals: [] }
  }
})
