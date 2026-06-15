export function usePhoneAuth() {
  const supabase = useSupabaseClient()

  function formatPhone(phone: string): string {
    let cleaned = phone.replace(/[\s\-()]/g, '')
    if (cleaned.startsWith('+')) return cleaned
    if (/^1[3-9]\d{9}$/.test(cleaned)) return `+86${cleaned}`
    return cleaned
  }

  function validatePhone(phone: string): boolean {
    const cleaned = phone.replace(/[\s\-()]/g, '')
    return /^(\+86)?1[3-9]\d{9}$/.test(cleaned)
  }

  function generateCode(): string {
    return String(Math.floor(100000 + Math.random() * 900000))
  }

  async function signUpWithPhone(phone: string, password: string) {
    const formatted = formatPhone(phone)
    return await $fetch('/api/auth/phone-register', {
      method: 'POST',
      body: { phone: formatted, password },
    })
  }

  async function signInWithPhone(phone: string, password: string) {
    const formatted = formatPhone(phone)
    const internalEmail = `phone_${formatted.replace(/\+/g, '')}@cardwish.com`
    const { data, error } = await supabase.auth.signInWithPassword({
      email: internalEmail, password,
    })
    if (error) throw error
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id, phone: formatted, phone_verified: true,
      }, { onConflict: 'id' })
    }
    return data
  }

  async function loginWithPhoneAndCode(phone: string, _code: string) {
    const formatted = formatPhone(phone)
    const internalEmail = `phone_${formatted.replace(/\+/g, '')}@cardwish.com`
    const defaultPassword = `cw_${formatted.replace(/\+/g, '')}`

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: internalEmail, password: defaultPassword,
    })

    if (!signInError && signInData.user) {
      await supabase.from('profiles').upsert({
        id: signInData.user.id, phone: formatted, phone_verified: true,
      }, { onConflict: 'id' })
      return signInData
    }

    await $fetch('/api/auth/phone-register', {
      method: 'POST',
      body: { phone: formatted, password: defaultPassword },
    })

    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: internalEmail, password: defaultPassword,
    })
    if (loginError) throw loginError
    return loginData
  }

  async function loginWithEmailAndCode(email: string, _code: string) {
    const defaultPassword = `cw_email_${email.replace(/[^a-zA-Z0-9]/g, '_')}`

    const { data: signInData } = await supabase.auth.signInWithPassword({
      email, password: defaultPassword,
    })
    if (signInData?.user) return signInData

    await $fetch('/api/auth/email-register', {
      method: 'POST',
      body: { email },
    })

    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email, password: defaultPassword,
    })
    if (loginError) throw loginError
    return loginData
  }

  return {
    formatPhone,
    validatePhone,
    generateCode,
    signUpWithPhone,
    signInWithPhone,
    loginWithPhoneAndCode,
    loginWithEmailAndCode,
  }
}
