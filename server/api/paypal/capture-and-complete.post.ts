import { getServiceClient } from '../../services/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = getServiceClient()
    const body = await readBody(event)
    const { share_code } = body

    if (!share_code) {
      setResponseStatus(event, 400)
      return { error: 'share_code required' }
    }

    // Fetch order
    const { data: order } = await supabase
      .from('orders')
      .select('id, creator_id, total_cents, currency, status')
      .eq('share_code', share_code)
      .single()

    if (!order) {
      setResponseStatus(event, 404)
      return { error: 'Order not found' }
    }

    if (order.status !== 'pending') {
      return { status: 'already_processed' }
    }

    // Find the pending PayPal payment
    const { data: payment } = await supabase
      .from('payments')
      .select('id, paypal_order_id')
      .eq('order_id', order.id)
      .eq('status', 'pending')
      .eq('payment_method', 'paypal')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // Update payment to succeeded
    if (payment) {
      await supabase.from('payments').update({
        status: 'succeeded',
        paid_at: new Date().toISOString(),
      }).eq('id', payment.id)
    } else {
      // Create payment if not exists (direct PayPal flow)
      const { data: newPayment } = await supabase.from('payments').insert({
        order_id: order.id,
        amount_cents: order.total_cents,
        currency: order.currency,
        status: 'succeeded',
        payment_method: 'paypal',
        paid_at: new Date().toISOString(),
      }).select('id').single()

      if (!newPayment) throw new Error('Failed to create payment')
      payment = newPayment
    }

    // Calculate split
    const platformFee = Math.round(order.total_cents * 0.3)
    const creatorEarning = order.total_cents - platformFee

    // Credit earnings
    await supabase.from('earnings').insert({
      user_id: order.creator_id,
      order_id: order.id,
      payment_id: payment.id,
      amount_cents: creatorEarning,
      platform_fee_cents: platformFee,
      description: 'PayPal payment',
    })

    // Credit wallet
    const { data: wallet } = await supabase.from('wallets').select('balance_cents, total_earned_cents').eq('user_id', order.creator_id).single()
    if (wallet) {
      await supabase.from('wallets').update({
        balance_cents: wallet.balance_cents + creatorEarning,
        total_earned_cents: wallet.total_earned_cents + creatorEarning,
      }).eq('user_id', order.creator_id)
    }

    // Generate card
    const { data: genCard } = await supabase.from('generated_cards').insert({
      order_id: order.id,
      image_url: '/og-default.png',
    }).select('id').single()

    if (genCard) {
      await supabase.from('received_cards').insert({
        user_id: order.creator_id,
        generated_card_id: genCard.id,
        is_new: true,
      })
    }

    // Mark order delivered
    await supabase.from('orders').update({
      status: 'delivered',
      paid_at: new Date().toISOString(),
      delivered_at: new Date().toISOString(),
    }).eq('id', order.id)

    return { success: true, order_id: order.id }
  } catch (e: any) {
    console.error('capture-and-complete error:', e.message)
    setResponseStatus(event, 500)
    return { error: e.message }
  }
})
