import { getClient } from '../../services/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = getClient()
    const locale = getQuery(event).locale as string || 'en'

    const { data, error } = await supabase
      .from('categories')
      .select('id, slug, name_zh, name_en, icon, sort_order')
      .order('sort_order', { ascending: true })

    if (error) throw error

    // Map localized name
    const categories = (data || []).map((cat: any) => ({
      ...cat,
      name: locale === 'zh-CN' ? cat.name_zh : cat.name_en,
    }))

    return { categories }
  } catch (e: any) {
    return { categories: [], error: e.message }
  }
})
