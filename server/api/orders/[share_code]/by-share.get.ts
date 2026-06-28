import { getClient } from '../../../services/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = getClient()
    const shareCode = getRouterParam(event, 'share_code')

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        card_templates!inner(
          name_zh, name_en, images, sort_order, category_id,
          categories(slug)
        )
      `)
      .eq('share_code', shareCode)
      .single()

    if (error || !order) {
      setResponseStatus(event, 404)
      return { error: 'Order not found' }
    }

    // Check if expired
    if (order.status === 'pending' && new Date(order.expires_at) < new Date()) {
      // Auto-expire
      await supabase.from('orders').update({ status: 'expired' }).eq('id', order.id)
      order.status = 'expired'
    }

    return {
      order: {
        id: order.id,
        share_code: order.share_code,
        message: order.message,
        recipient_name: order.recipient_name,
        total_cents: order.total_cents,
        currency: order.currency,
        status: order.status,
        expires_at: order.expires_at,
        card_name: order.card_templates?.name_zh || order.card_templates?.name_en,
        card_images: order.card_templates?.images,
        sort_order: order.card_templates?.sort_order || 0,
        category_slug: order.card_templates?.categories?.slug,
        card_templates: undefined,
      },
    }
  } catch (e: any) {
    return { error: e.message }
  }
})
