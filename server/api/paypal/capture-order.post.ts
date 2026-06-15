import { getServiceClient, ensureProfileAndWallet } from '../../services/supabase'
import { capturePayPalOrder } from '../../services/paypal'

export default defineEventHandler(async (event) => {
  try {
    const supabase = getServiceClient()
    const body = await readBody(event)
    const { paypal_order_id, payer_message } = body

    if (!paypal_order_id) {
      setResponseStatus(event, 400)
      return { error: 'paypal_order_id required' }
    }

    // Check if already processed (idempotency)
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id, status, order_id')
      .eq('paypal_order_id', paypal_order_id)
      .single()

    if (existingPayment?.status === 'succeeded') {
      return { status: 'already_processed' }
    }

    // Capture the PayPal order
    let captureResult
    try {
      captureResult = await capturePayPalOrder(paypal_order_id)
    } catch (e: any) {
      setResponseStatus(event, 500)
      return { error: 'Failed to capture PayPal order: ' + e.message }
    }

    if (captureResult.status !== 'COMPLETED') {
      setResponseStatus(event, 400)
      return { error: 'Payment not completed' }
    }

    const shareCode = captureResult.customId

    // Fetch order
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('share_code', shareCode)
      .single()

    if (!order) {
      setResponseStatus(event, 404)
      return { error: 'Order not found' }
    }

    if (order.status !== 'pending') {
      return { status: 'already_processed' }
    }

    // Update payment record
    await supabase
      .from('payments')
      .update({
        status: 'succeeded',
        payer_message: payer_message || null,
        paid_at: new Date().toISOString(),
      })
      .eq('paypal_order_id', paypal_order_id)

    // Calculate split
    const totalCents = order.total_cents
    const platformFeeCents = Math.round(totalCents * 0.3)
    const creatorEarningCents = totalCents - platformFeeCents

    // Create earnings record
    const { data: payment } = await supabase
      .from('payments')
      .select('id')
      .eq('paypal_order_id', paypal_order_id)
      .single()

    if (payment) {
      await supabase.from('earnings').insert({
        user_id: order.creator_id,
        order_id: order.id,
        payment_id: payment.id,
        amount_cents: creatorEarningCents,
        platform_fee_cents: platformFeeCents,
        description: 'PayPal payment received',
      })

      // Credit wallet
      await supabase.rpc('credit_wallet', {
        p_user_id: order.creator_id,
        p_amount_cents: creatorEarningCents,
      })

      // Generate card placeholder
      const { data: genCard } = await supabase
        .from('generated_cards')
        .insert({
          order_id: order.id,
          image_url: `${useRuntimeConfig().public.siteUrl}/og-default.png`,
        })
        .select('id')
        .single()

      if (genCard) {
        await supabase.from('received_cards').insert({
          user_id: order.creator_id,
          generated_card_id: genCard.id,
          is_new: true,
        })
      }

      // Mark order delivered
      await supabase
        .from('orders')
        .update({
          status: 'delivered',
          paid_at: new Date().toISOString(),
          delivered_at: new Date().toISOString(),
        })
        .eq('id', order.id)
    }

    return { status: 'completed' }
  } catch (e: any) {
    setResponseStatus(event, 500)
    return { error: e.message }
  }
})
