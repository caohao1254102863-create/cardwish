import { getServiceClient } from '../../services/supabase'
import { verifyWebhookSignature } from '../../services/stripe'

export default defineEventHandler(async (event) => {
  const supabase = getServiceClient()

  try {
    const signature = getHeader(event, 'stripe-signature')
    if (!signature) {
      setResponseStatus(event, 400)
      return { error: 'Missing stripe-signature header' }
    }

    // Read raw body
    const rawBody = await readRawBody(event)
    if (!rawBody) {
      setResponseStatus(event, 400)
      return { error: 'Missing request body' }
    }

    // Verify webhook
    let stripeEvent
    try {
      stripeEvent = verifyWebhookSignature(rawBody, signature)
    } catch (err) {
      setResponseStatus(event, 400)
      return { error: 'Invalid webhook signature' }
    }

    // Handle the event
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object as any
        const { order_id, share_code, payer_message } = session.metadata || {}

        if (!order_id) {
          console.error('No order_id in session metadata')
          break
        }

        // Check if payment already processed (idempotency)
        const { data: existing } = await supabase
          .from('payments')
          .select('id')
          .eq('stripe_session_id', session.id)
          .single()

        if (existing) {
          console.log('Payment already processed:', session.id)
          return { received: true, status: 'already_processed' }
        }

        // Fetch order
        const { data: order } = await supabase
          .from('orders')
          .select('*')
          .eq('id', order_id)
          .single()

        if (!order) {
          console.error('Order not found:', order_id)
          break
        }

        if (order.status !== 'pending') {
          console.log('Order not pending:', order_id, order.status)
          break
        }

        // 1. Create payment record
        const { data: payment, error: paymentError } = await supabase
          .from('payments')
          .insert({
            order_id,
            stripe_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent,
            amount_cents: session.amount_total,
            currency: session.currency?.toUpperCase() || 'USD',
            status: 'succeeded',
            payer_message: payer_message || null,
            paid_at: new Date().toISOString(),
          })
          .select('id')
          .single()

        if (paymentError) {
          console.error('Failed to create payment:', paymentError)
          break
        }

        // 2. Calculate split: 70% creator, 30% platform
        const totalCents = order.total_cents
        const platformFeeCents = Math.round(totalCents * 0.3)
        const creatorEarningCents = totalCents - platformFeeCents

        // 3. Create earnings record
        await supabase.from('earnings').insert({
          user_id: order.creator_id,
          order_id,
          payment_id: payment.id,
          amount_cents: creatorEarningCents,
          platform_fee_cents: platformFeeCents,
          description: 'Card payment received',
        })

        // 4. Update wallet balance (atomic increment)
        const { error: walletError } = await supabase.rpc('credit_wallet', {
          p_user_id: order.creator_id,
          p_amount_cents: creatorEarningCents,
        })

        if (walletError) {
          // Fallback: manual update
          const { data: wallet } = await supabase
            .from('wallets')
            .select('balance_cents, total_earned_cents')
            .eq('user_id', order.creator_id)
            .single()

          if (wallet) {
            await supabase.from('wallets')
              .update({
                balance_cents: wallet.balance_cents + creatorEarningCents,
                total_earned_cents: wallet.total_earned_cents + creatorEarningCents,
              })
              .eq('user_id', order.creator_id)
          }
        }

        // 5. Generate card image (placeholder — real implementation in Phase 3)
        // For now, mark the card as delivered with a placeholder URL
        const cardImageUrl = `${useRuntimeConfig().public.siteUrl}/og-default.png`

        const { data: genCard } = await supabase
          .from('generated_cards')
          .insert({
            order_id,
            image_url: cardImageUrl,
          })
          .select('id')
          .single()

        // 6. Create received_card record
        if (genCard) {
          await supabase.from('received_cards').insert({
            user_id: order.creator_id,
            generated_card_id: genCard.id,
            is_new: true,
          })
        }

        // 7. Update order status
        await supabase
          .from('orders')
          .update({
            status: 'delivered',
            paid_at: new Date().toISOString(),
            delivered_at: new Date().toISOString(),
          })
          .eq('id', order_id)

        console.log('Payment processed successfully:', order_id, 'Earnings:', creatorEarningCents)
        break
      }

      case 'checkout.session.expired': {
        // Handle expired checkout sessions
        console.log('Checkout session expired:', stripeEvent.data.object)
        break
      }

      default:
        console.log('Unhandled event type:', stripeEvent.type)
    }

    return { received: true }
  } catch (e: any) {
    console.error('Webhook error:', e)
    setResponseStatus(event, 500)
    return { error: e.message }
  }
})
