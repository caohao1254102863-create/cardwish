import { getServiceClient } from '../../../services/supabase'
import { createCheckoutSession } from '../../../services/stripe'

export default defineEventHandler(async (event) => {
  try {
    const supabase = getServiceClient()
    const shareCode = getRouterParam(event, 'share_code')
    const body = await readBody(event)
    const { success_url, cancel_url, payer_message, locale } = body

    // Fetch order
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        id, total_cents, currency, status, expires_at,
        card_templates!inner(name_zh, name_en, images)
      `)
      .eq('share_code', shareCode)
      .single()

    if (error || !order) {
      setResponseStatus(event, 404)
      return { error: 'Order not found' }
    }

    if (order.status !== 'pending') {
      setResponseStatus(event, 400)
      return { error: 'Order is no longer available for payment' }
    }

    if (new Date(order.expires_at) < new Date()) {
      await supabase.from('orders').update({ status: 'expired' }).eq('id', order.id)
      setResponseStatus(event, 400)
      return { error: 'Order has expired' }
    }

    // Create Stripe session
    const cardName = order.card_templates?.name_zh || order.card_templates?.name_en || 'Digital Card'
    const cardImageUrl = order.card_templates?.images?.[0]?.url

    const session = await createCheckoutSession({
      orderId: order.id,
      shareCode,
      amountCents: order.total_cents,
      currency: order.currency,
      cardName,
      cardImageUrl,
      successUrl: success_url,
      cancelUrl: cancel_url,
      payerMessage: payer_message,
      locale,
    })

    return { checkout_url: session.url }
  } catch (e: any) {
    setResponseStatus(event, 500)
    return { error: e.message || 'Payment session creation failed' }
  }
})
