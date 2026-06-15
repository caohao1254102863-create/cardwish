import { getServiceClient } from '../../services/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = getServiceClient()
    const body = await readBody(event)
    const { phone, password, nickname } = body

    if (!phone || !password) {
      setResponseStatus(event, 400)
      return { error: 'Phone and password are required' }
    }

    // Validate phone format
    let formatted = phone.replace(/[\s\-()]/g, '')
    if (!formatted.startsWith('+')) formatted = `+86${formatted}`
    if (!/^\+86\d{11}$/.test(formatted)) {
      setResponseStatus(event, 400)
      return { error: 'Invalid phone number format' }
    }

    // Generate internal email
    const internalEmail = `phone_${formatted.replace(/\+/g, '')}@cardwish.com`

    // Check if user already exists
    const { data: existingUser } = await supabase.auth.admin.listUsers()
    const existing = existingUser?.users?.find((u: any) => u.email === internalEmail)

    if (existing) {
      // User exists, update password
      await supabase.auth.admin.updateUserById(existing.id, { password })
      return { success: true, message: 'Password updated for existing user', user_id: existing.id }
    }

    // Create user via Admin API (bypasses email confirmation)
    const { data: newUser, error } = await supabase.auth.admin.createUser({
      email: internalEmail,
      password,
      email_confirm: true,
      user_metadata: { phone: formatted },
    })

    // If user was created but not auto-confirmed, manually confirm
    if (newUser?.user && !newUser.user.email_confirmed_at) {
      await supabase.auth.admin.updateUserById(newUser.user.id, {
        email_confirm: true,
      })
    }

    if (error) throw error

    if (newUser?.user) {
      // Create profile
      await supabase.from('profiles').upsert({
        id: newUser.user.id,
        phone: formatted,
        phone_verified: true,
        nickname: nickname || null,
        preferred_locale: 'zh-CN',
      }, { onConflict: 'id' })

      // Create wallet if not exists
      const { data: wallet } = await supabase.from('wallets').select('id').eq('user_id', newUser.user.id).single()
      if (!wallet) {
        await supabase.from('wallets').insert({ user_id: newUser.user.id })
      }
    }

    return { success: true, user_id: newUser?.user?.id }
  } catch (e: any) {
    setResponseStatus(event, 500)
    return { error: e.message }
  }
})
