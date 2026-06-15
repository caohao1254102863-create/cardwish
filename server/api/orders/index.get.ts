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
    const status = query.status as string
    const page = parseInt((query.page as string) || '1')
    const limit = Math.min(parseInt((query.limit as string) || '20'), 50)
    const offset = (page - 1) * limit

    let dbQuery = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status && status !== 'all') {
      dbQuery = dbQuery.eq('status', status)
    }

    const { data, error, count } = await dbQuery

    if (error) throw error

    return {
      orders: data || [],
      total: count || 0,
      page,
      limit,
      hasMore: (count || 0) > offset + limit,
    }
  } catch (e: any) {
    return { orders: [], error: e.message }
  }
})
