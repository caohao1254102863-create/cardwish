/**
 * Auth middleware — redirects to login if not authenticated.
 * Add to page meta: definePageMeta({ middleware: ['auth'] })
 */
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()
  if (!user.value) {
    const localePath = useLocalePath()
    return navigateTo({
      path: localePath('/auth/login'),
      query: { redirect: to.fullPath },
    })
  }
})
