import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const result: any = {
    env: {
      url: process.env.SUPABASE_URL ? 'SET' : 'MISSING',
      key: process.env.SUPABASE_KEY ? 'SET' : 'MISSING',
      serviceRole: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET (' + process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20) + '...)' : 'MISSING',
    },
  }

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    result.error = 'Missing env vars'
    return result
  }

  try {
    const supabase = createClient(url, key)

    // Test 1: Simple query
    const { data: catData, error: catError } = await supabase
      .from('categories')
      .select('count')
      .limit(1)

    result.categories = { data: catData, error: catError?.message }

    // Test 2: Check if tables exist
    const { data: tableData, error: tableError } = await supabase
      .from('card_templates')
      .select('count')
      .limit(1)

    result.card_templates = { data: tableData, error: tableError?.message }

    // Test 3: Check RLS status
    const { data: rlsData, error: rlsError } = await supabase.rpc('credit_wallet', {
      p_user_id: '00000000-0000-0000-0000-000000000000',
      p_amount_cents: 0,
    })
    result.rpc = { data: rlsData, error: rlsError?.message }

  } catch (e: any) {
    result.exception = e.message
  }

  return result
})
