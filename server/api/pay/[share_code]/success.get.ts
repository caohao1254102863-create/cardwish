import { getServiceClient } from '../../../services/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = getServiceClient()
    const shareCode = getRouterParam(event, 'share_code')

    const { data: order } = await supabase
      .from('orders')
      .select(`
        id, status, message, recipient_name,
        payments(payer_message)
      `)
      .eq('share_code', shareCode)
      .single()

    if (!order) {
      return { status: 'not_found' }
    }

    if (order.status === 'delivered' || order.status === 'paid') {
      return {
        status: 'succeeded',
        payer_message: order.payments?.[0]?.payer_message || '',
        recipient_name: order.recipient_name,
      }
    }

    if (order.status === 'expired') {
      return { status: 'expired' }
    }

    return { status: order.status }
  } catch (e: any) {
    return { status: 'error', error: e.message }
  }
})
