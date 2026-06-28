import { getServiceClient } from '../../services/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = getServiceClient()
    const user = await getServerUser(event)
    if (!user) {
      setResponseStatus(event, 401)
      return { error: 'Login required' }
    }

    const id = getRouterParam(event, 'id')
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        card_templates!inner(
          name_zh, name_en, sort_order,
          categories(slug)
        )
      `)
      .eq('id', id)
      .eq('creator_id', user.id)
      .single()

    if (error || !order) {
      setResponseStatus(event, 404)
      return { error: 'Order not found' }
    }

    return {
      order: {
        ...order,
        card_name: order.card_templates?.name_zh || order.card_templates?.name_en,
        sort_order: order.card_templates?.sort_order || 0,
        category_slug: order.card_templates?.categories?.slug,
        card_templates: undefined,
      },
    }
  } catch (e: any) {
    return { error: e.message }
  }
})
