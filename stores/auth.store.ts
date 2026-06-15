import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const isLoggedIn = computed(() => !!user.value)

  async function login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function register(email: string, password: string) {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
  }

  async function loginWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) throw error
  }

  async function sendMagicLink(email: string) {
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) throw error
  }

  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    navigateTo('/')
  }

  return {
    user,
    isLoggedIn,
    login,
    register,
    loginWithGoogle,
    sendMagicLink,
    logout,
  }
})
