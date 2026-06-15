/**
 * PayPal payment service.
 * Uses PayPal REST API to create and capture orders.
 */

interface PayPalConfig {
  clientId: string
  clientSecret: string
  mode: 'sandbox' | 'live'
}

function getPayPalConfig(): PayPalConfig {
  return {
    clientId: process.env.PAYPAL_CLIENT_ID || '',
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
    mode: (process.env.PAYPAL_MODE as 'sandbox' | 'live') || 'sandbox',
  }
}

function getBaseUrl(): string {
  const config = getPayPalConfig()
  return config.mode === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'
}

async function getAccessToken(): Promise<string> {
  const config = getPayPalConfig()
  const baseUrl = getBaseUrl()
  const auth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`,
    },
    body: 'grant_type=client_credentials',
  })

  const data = await response.json()
  return data.access_token
}

export async function createPayPalOrder(params: {
  amountCents: number
  currency: string
  orderId: string
  shareCode: string
  cardName: string
}): Promise<{ orderId: string; approvalUrl: string }> {
  const accessToken = await getAccessToken()
  const baseUrl = getBaseUrl()
  const amount = (params.amountCents / 100).toFixed(2)

  const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'PayPal-Request-Id': params.orderId,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: params.orderId,
          description: `CardWish: ${params.cardName}`,
          amount: {
            currency_code: params.currency,
            value: amount,
          },
          custom_id: params.shareCode,
        },
      ],
      application_context: {
        brand_name: 'CardWish',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${useRuntimeConfig().public.siteUrl}/pay/${params.shareCode}/success`,
        cancel_url: `${useRuntimeConfig().public.siteUrl}/pay/${params.shareCode}`,
      },
    }),
  })

  const data = await response.json()

  if (data.status === 'CREATED') {
    const approvalUrl = data.links.find((l: any) => l.rel === 'approve')?.href || ''
    return { orderId: data.id, approvalUrl }
  }

  throw new Error(data.message || 'Failed to create PayPal order')
}

export async function capturePayPalOrder(paypalOrderId: string): Promise<{
  status: string
  amountCents: number
  currency: string
  customId: string
}> {
  const accessToken = await getAccessToken()
  const baseUrl = getBaseUrl()

  const response = await fetch(`${baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data = await response.json()

  if (data.status === 'COMPLETED') {
    const purchaseUnit = data.purchase_units[0]
    const capture = purchaseUnit.payments?.captures?.[0]
    return {
      status: 'COMPLETED',
      amountCents: Math.round(parseFloat(capture.amount.value) * 100),
      currency: capture.amount.currency_code,
      customId: purchaseUnit.custom_id || '',
    }
  }

  throw new Error(data.message || 'Failed to capture PayPal order')
}
