import { getServiceClient } from '../../services/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = getServiceClient()
    const body = await readBody(event)
    const { email } = body

    if (!email) {
      setResponseStatus(event, 400)
      return { error: 'Email is required' }
    }

    // Check if user already exists
    const { data: existingUser } = await supabase.auth.admin.listUsers()
    const existing = existingUser?.users?.find((u: any) => u.email === email)

    if (existing) {
      // User exists, confirm if not already
      if (!existing.email_confirmed_at) {
        await supabase.auth.admin.updateUserById(existing.id, { email_confirm: true })
      }
      return { success: true, user_id: existing.id, message: 'User confirmed' }
    }

    // Create new user with auto-confirm
    const { data: newUser, error } = await supabase.auth.admin.createUser({
      email,
      password: `cw_email_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email_confirm: true,
    })

    if (error) throw error

    if (newUser?.user) {
      if (!newUser.user.email_confirmed_at) {
        await supabase.auth.admin.updateUserById(newUser.user.id, { email_confirm: true })
      }
      await supabase.from('profiles').upsert({ id: newUser.user.id }, { onConflict: 'id' })
      const { data: wallet } = await supabase.from('wallets').select('id').eq('user_id', newUser.user.id).single()
      if (!wallet) await supabase.from('wallets').insert({ user_id: newUser.user.id })
    }

    return { success: true, user_id: newUser?.user?.id }
  } catch (e: any) {
    setResponseStatus(event, 500)
    return { error: e.message }
  }
})
