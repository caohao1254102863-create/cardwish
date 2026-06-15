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
    const page = parseInt((query.page as string) || '1')
    const limit = Math.min(parseInt((query.limit as string) || '20'), 50)
    const offset = (page - 1) * limit

    const { data, error, count } = await supabase
      .from('earnings')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    // Fetch card names for each earning
    const earningsWithNames = await Promise.all((data || []).map(async (earning: any) => {
      const { data: order } = await supabase
        .from('orders')
        .select('card_templates(name_zh, name_en)')
        .eq('id', earning.order_id)
        .single()

      return {
        ...earning,
        card_name: order?.card_templates?.name_zh || order?.card_templates?.name_en || 'Card',
      }
    }))

    return {
      earnings: earningsWithNames,
      total: count || 0,
      page,
      limit,
      hasMore: (count || 0) > offset + limit,
    }
  } catch (e: any) {
    return { earnings: [], error: e.message }
  }
})
