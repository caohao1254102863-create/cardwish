import { getServiceClient } from '../../services/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = getServiceClient()
    const user = await getServerUser(event)
    if (!user) {
      setResponseStatus(event, 401)
      return { error: 'Login required' }
    }

    const body = await readBody(event)
    const { amount_cents, method, account_info } = body
    const config = useRuntimeConfig()
    const minWithdrawal = config.public.minWithdrawalCents as number

    if (!amount_cents || amount_cents < minWithdrawal) {
      setResponseStatus(event, 400)
      return { error: `Minimum withdrawal is $${minWithdrawal / 100}` }
    }

    if (!method || !account_info) {
      setResponseStatus(event, 400)
      return { error: 'Method and account info are required' }
    }

    // Check balance and deduct atomically
    const { data: wallet } = await supabase
      .from('wallets')
      .select('balance_cents')
      .eq('user_id', user.id)
      .single()

    if (!wallet || wallet.balance_cents < amount_cents) {
      setResponseStatus(event, 400)
      return { error: 'Insufficient balance' }
    }

    // Deduct balance
    const { error: deductError } = await supabase
      .from('wallets')
      .update({
        balance_cents: wallet.balance_cents - amount_cents,
        total_withdrawn_cents: supabase.raw(`total_withdrawn_cents + ${amount_cents}`),
      })
      .eq('user_id', user.id)

    if (deductError) throw deductError

    // Create withdrawal request
    const { data: withdrawal, error } = await supabase
      .from('withdrawal_requests')
      .insert({
        user_id: user.id,
        amount_cents,
        method,
        account_info,
        status: 'pending',
      })
      .select('id, amount_cents, method, status, created_at')
      .single()

    if (error) throw error

    return {
      withdrawal,
      message: 'Withdrawal request submitted',
    }
  } catch (e: any) {
    setResponseStatus(event, 500)
    return { error: e.message }
  }
})
