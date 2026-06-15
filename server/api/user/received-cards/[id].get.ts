import { getServiceClient } from '../../../services/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = getServiceClient()
    const user = await getServerUser(event)
    if (!user) {
      setResponseStatus(event, 401)
      return { error: 'Login required' }
    }

    const id = getRouterParam(event, 'id')

    // Fetch and mark as viewed
    const { data, error } = await supabase
      .from('received_cards')
      .select(`
        id, is_new, created_at, viewed_at,
        generated_cards!inner(
          id, image_url,
          orders!inner(
            message, recipient_name,
            card_templates!inner(name_zh, name_en, categories(slug)),
            payments(payer_message)
          )
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error || !data) {
      setResponseStatus(event, 404)
      return { error: 'Card not found' }
    }

    // Mark as viewed
    if (data.is_new) {
      await supabase
        .from('received_cards')
        .update({ is_new: false, viewed_at: new Date().toISOString() })
        .eq('id', id)
    }

    const card = {
      id: data.id,
      is_new: data.is_new,
      created_at: data.created_at,
      viewed_at: data.viewed_at,
      image_url: data.generated_cards?.image_url,
      message: data.generated_cards?.orders?.message,
      recipient_name: data.generated_cards?.orders?.recipient_name,
      card_name: data.generated_cards?.orders?.card_templates?.name_zh
        || data.generated_cards?.orders?.card_templates?.name_en,
      category_slug: data.generated_cards?.orders?.card_templates?.categories?.slug,
      payer_message: data.generated_cards?.orders?.payments?.[0]?.payer_message,
    }

    return card
  } catch (e: any) {
    return { error: e.message }
  }
})
