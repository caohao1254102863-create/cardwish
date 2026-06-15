import { getServiceClient } from '../../../services/supabase'
import { createPayPalOrder } from '../../../services/paypal'

export default defineEventHandler(async (event) => {
  try {
    const supabase = getServiceClient()
    const shareCode = getRouterParam(event, 'share_code')

    const { data: order, error } = await supabase
      .from('orders')
      .select('id, total_cents, currency, status, expires_at, card_templates!inner(name_zh, name_en)')
      .eq('share_code', shareCode)
      .single()

    if (error || !order) {
      setResponseStatus(event, 404)
      return { error: 'Order not found' }
    }

    if (order.status !== 'pending') {
      setResponseStatus(event, 400)
      return { error: 'Order is no longer available' }
    }

    if (new Date(order.expires_at) < new Date()) {
      await supabase.from('orders').update({ status: 'expired' }).eq('id', order.id)
      setResponseStatus(event, 400)
      return { error: 'Order has expired' }
    }

    const cardName = order.card_templates?.name_zh || order.card_templates?.name_en || 'Digital Card'

    const paypalOrder = await createPayPalOrder({
      amountCents: order.total_cents,
      currency: order.currency,
      orderId: order.id,
      shareCode: shareCode,
      cardName,
    })

    // Store PayPal order ID in payments
    await supabase.from('payments').insert({
      order_id: order.id,
      paypal_order_id: paypalOrder.orderId,
      amount_cents: order.total_cents,
      currency: order.currency,
      status: 'pending',
      payment_method: 'paypal',
    })

    return { paypal_order_id: paypalOrder.orderId, approval_url: paypalOrder.approvalUrl }
  } catch (e: any) {
    setResponseStatus(event, 500)
    return { error: e.message }
  }
})
