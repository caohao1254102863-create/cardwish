import { getServiceClient } from '../../services/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = getServiceClient()
    const body = await readBody(event)
    const { phone, password } = body

    if (!phone) {
      setResponseStatus(event, 400)
      return { error: 'Phone required' }
    }

    const formatted = phone.startsWith('+') ? phone : '+86' + phone
    const email = 'phone_' + formatted.replace(/\+/g, '') + '@cardwish.com'

    // Check if user exists
    const { data: existing } = await supabase.auth.admin.listUsers()
    const found = existing?.users?.find((u: any) => u.email === email)

    if (found) {
      // User exists - update password and confirm
      await supabase.auth.admin.updateUserById(found.id, {
        password: password || 'cw_' + formatted.replace(/\+/g, ''),
        email_confirm: true,
      })

      // Ensure wallet exists
      const { data: wallet } = await supabase.from('wallets').select('id').eq('user_id', found.id).single()
      if (!wallet) {
        await supabase.from('wallets').insert({ user_id: found.id })
      }

      return { success: true, user_id: found.id, message: 'existing user updated' }
    }

    // Create new user
    const { data: newUser, error } = await supabase.auth.admin.createUser({
      email,
      password: password || 'cw_' + formatted.replace(/\+/g, ''),
      email_confirm: true,
      user_metadata: { phone: formatted },
    })

    if (error) throw error

    if (newUser?.user) {
      // Double-confirm
      await supabase.auth.admin.updateUserById(newUser.user.id, { email_confirm: true })

      // Create profile and wallet
      const { data: profile } = await supabase.from('profiles').select('id').eq('id', newUser.user.id).single()
      if (!profile) {
        await supabase.from('profiles').insert({ id: newUser.user.id, phone: formatted, preferred_locale: 'zh-CN' })
      }
      const { data: wallet } = await supabase.from('wallets').select('id').eq('user_id', newUser.user.id).single()
      if (!wallet) {
        await supabase.from('wallets').insert({ user_id: newUser.user.id })
      }
    }

    return { success: true, user_id: newUser?.user?.id, message: 'new user created' }
  } catch (e: any) {
    console.error('phone-login error:', e.message)
    setResponseStatus(event, 500)
    return { error: e.message }
  }
})
