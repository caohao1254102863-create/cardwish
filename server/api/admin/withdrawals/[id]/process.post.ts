import { getServiceClient } from '../../../../services/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = getServiceClient()
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { status, admin_notes } = body

    if (!id || !status) {
      setResponseStatus(event, 400)
      return { error: 'id and status required' }
    }

    const { data, error } = await supabase
      .from('withdrawal_requests')
      .update({
        status,
        admin_notes: admin_notes || '',
        processed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id, status')
      .single()

    if (error) throw error

    return { success: true, withdrawal: data }
  } catch (e) {
    setResponseStatus(event, 500)
    return { error: e.message }
  }
})
