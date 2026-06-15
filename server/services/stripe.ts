import Stripe from 'stripe'

let stripeClient: Stripe | null = null

export function getStripeClient(): Stripe {
  if (stripeClient) return stripeClient

  const config = useRuntimeConfig()
  const key = process.env.STRIPE_SECRET_KEY || config.stripeSecretKey

  if (!key) {
    throw new Error('Missing STRIPE_SECRET_KEY environment variable')
  }

  stripeClient = new Stripe(key, {
    apiVersion: '2024-06-20' as any,
    httpClient: Stripe.createFetchHttpClient(),
  })

  return stripeClient
}

/**
 * Create a Stripe Checkout Session for a card order.
 */
export async function createCheckoutSession(params: {
  orderId: string
  shareCode: string
  amountCents: number
  currency: string
  cardName: string
  cardImageUrl?: string
  successUrl: string
  cancelUrl: string
  payerMessage?: string
  locale?: string
}) {
  const stripe = getStripeClient()

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'wechat_pay', 'alipay'],
    line_items: [
      {
        price_data: {
          currency: params.currency.toLowerCase(),
          product_data: {
            name: params.cardName,
            images: params.cardImageUrl ? [params.cardImageUrl] : [],
            description: 'Digital greeting card',
          },
          unit_amount: params.amountCents,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      order_id: params.orderId,
      share_code: params.shareCode,
      payer_message: params.payerMessage || '',
    },
    locale: params.locale === 'zh-CN' ? 'zh' : 'auto',
  })

  return session
}

/**
 * Verify Stripe webhook signature.
 */
export function verifyWebhookSignature(payload: string, signature: string): Stripe.Event {
  const stripe = getStripeClient()
  const config = useRuntimeConfig()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || config.stripeWebhookSecret

  if (!webhookSecret) {
    throw new Error('Missing STRIPE_WEBHOOK_SECRET')
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}
