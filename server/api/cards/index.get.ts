import { getClient } from '../../services/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = getClient()
    const query = getQuery(event)
    const locale = (query.locale as string) || 'en'
    const category = query.category as string
    const sort = (query.sort as string) || 'popular'
    const page = parseInt((query.page as string) || '1')
    const limit = Math.min(parseInt((query.limit as string) || '20'), 50)
    const offset = (page - 1) * limit

    let dbQuery = supabase
      .from('card_templates')
      .select(`
        id, category_id,
        name_zh, name_en,
        description_zh, description_en,
        price_cents, currency, images, tags, status, sort_order, created_at,
        categories!inner(slug)
      `, { count: 'exact' })
      .eq('status', 'online')

    if (category) {
      dbQuery = dbQuery.eq('categories.slug', category)
    }

    switch (sort) {
      case 'newest': dbQuery = dbQuery.order('created_at', { ascending: false }); break
      case 'price_asc': dbQuery = dbQuery.order('price_cents', { ascending: true }); break
      case 'price_desc': dbQuery = dbQuery.order('price_cents', { ascending: false }); break
      default: dbQuery = dbQuery.order('sort_order', { ascending: true }); break
    }

    dbQuery = dbQuery.range(offset, offset + limit - 1)

    const { data, error, count } = await dbQuery

    if (error) throw error

    // Map localized fields
    const cards = (data || []).map((item: any) => ({
      id: item.id,
      category_id: item.category_id,
      category_slug: item.categories?.slug,
      name: locale === 'zh-CN' ? item.name_zh : item.name_en,
      name_zh: item.name_zh,
      name_en: item.name_en,
      description: locale === 'zh-CN' ? item.description_zh : item.description_en,
      description_zh: item.description_zh,
      description_en: item.description_en,
      price_cents: item.price_cents,
      currency: item.currency,
      images: item.images,
      tags: item.tags,
      status: item.status,
      sort_order: item.sort_order,
      created_at: item.created_at,
    }))

    return {
      cards,
      total: count || 0,
      page,
      limit,
      hasMore: (count || 0) > offset + limit,
    }
  } catch (e: any) {
    return { cards: [], total: 0, page: 1, limit: 20, hasMore: false, error: e.message }
  }
})
