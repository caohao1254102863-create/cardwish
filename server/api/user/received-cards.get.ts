import { getServiceClient } from '../../services/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = getServiceClient()
    const user = await getServerUser(event)
    if (!user) {
      setResponseStatus(event, 401)
      return { error: 'Login required' }
    }

    const { data, error, count } = await supabase
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
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    const cards = (data || []).map((item: any) => ({
      id: item.id,
      is_new: item.is_new,
      created_at: item.created_at,
      viewed_at: item.viewed_at,
      image_url: item.generated_cards?.image_url,
      message: item.generated_cards?.orders?.message,
      recipient_name: item.generated_cards?.orders?.recipient_name,
      card_name: item.generated_cards?.orders?.card_templates?.name_zh
        || item.generated_cards?.orders?.card_templates?.name_en,
      category_slug: item.generated_cards?.orders?.card_templates?.categories?.slug,
      payer_message: item.generated_cards?.orders?.payments?.[0]?.payer_message,
    }))

    return { cards, total: count || 0 }
  } catch (e: any) {
    return { cards: [], error: e.message }
  }
})
