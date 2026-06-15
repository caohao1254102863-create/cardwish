export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event)
  const cookieList = Object.entries(cookies).map(([name, value]) => ({
    name,
    value: typeof value === 'string' ? value.substring(0, 50) + '...' : String(value).substring(0, 50),
  }))

  const supabaseCookies = cookieList.filter(c => c.name.includes('sb') || c.name.includes('supabase'))

  return {
    total: cookieList.length,
    supabaseCookies,
    allNames: cookieList.map(c => c.name),
  }
})
