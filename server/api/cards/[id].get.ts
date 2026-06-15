import { getClient } from '../../services/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = getClient()
    const id = getRouterParam(event, 'id')
    const locale = (getQuery(event).locale as string) || 'en'

    const { data, error } = await supabase
      .from('card_templates')
      .select(`
        id, category_id,
        name_zh, name_en,
        description_zh, description_en,
        price_cents, currency, images, tags, status, sort_order, created_at,
        categories!inner(slug)
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    const card = {
      id: data.id,
      category_id: data.category_id,
      category_slug: data.categories?.slug,
      name: locale === 'zh-CN' ? data.name_zh : data.name_en,
      name_zh: data.name_zh,
      name_en: data.name_en,
      description: locale === 'zh-CN' ? data.description_zh : data.description_en,
      description_zh: data.description_zh,
      description_en: data.description_en,
      price_cents: data.price_cents,
      currency: data.currency,
      images: data.images,
      tags: data.tags,
      status: data.status,
      sort_order: data.sort_order,
      created_at: data.created_at,
    }

    return { card }
  } catch (e: any) {
    return { card: null, error: e.message }
  }
})
