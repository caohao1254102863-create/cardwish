import { getServiceClient, ensureProfileAndWallet } from '../../services/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = getServiceClient()
    const user = await getServerUser(event)
    if (!user) {
      setResponseStatus(event, 401)
      return { error: 'Login required' }
    }

    await ensureProfileAndWallet(supabase, user.id)

    const { data: wallet, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) throw error

    return wallet
  } catch (e: any) {
    return { balance_cents: 0, total_earned_cents: 0, total_withdrawn_cents: 0, error: e.message }
  }
})
