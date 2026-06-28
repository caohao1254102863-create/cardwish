<template>
  <div class="min-h-screen bg-[#fef6f7] flex items-center justify-center p-6">
    <div class="w-full max-w-sm">
      <div class="text-center mb-6">
        <p class="text-4xl mb-1">💝</p>
        <h1 class="text-2xl font-bold text-gradient">CardWish</h1>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm">
        <div class="flex items-center bg-gray-50 rounded-lg border border-gray-200 focus-within:border-red-300 transition-all mb-4">
          <span class="pl-4 text-gray-500 text-sm">+86</span>
          <input v-model="phone" type="tel" placeholder="请输入手机号"
            class="flex-1 px-3 py-3 bg-transparent outline-none text-sm" maxlength="11"
            @input="phone = phone.replace(/\D/g, '')" />
        </div>

        <div class="mb-4">
          <input v-model="nickname" type="text" placeholder="昵称（选填）"
            class="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none transition-all text-sm" maxlength="20" />
        </div>

        <button v-if="!codeSent" type="button"
          class="w-full py-3 rounded-full bg-gradient-to-r from-red-400 to-pink-400 text-white font-semibold active:scale-95 transition-all"
          @click="sendCode" :disabled="phone.length !== 11">
          获取验证码
        </button>

        <div v-if="codeSent" class="space-y-4 animate-fade-in">
          <div class="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
            <p class="text-xs text-green-600 mb-1">🔑 点击验证码自动填入</p>
            <p class="text-2xl font-bold text-green-700 tracking-[0.3em] cursor-pointer select-all"
              @click="inputCode = sentCode">{{ sentCode }}</p>
          </div>
          <input v-model="inputCode" type="text" inputmode="numeric" placeholder="输入6位验证码"
            class="w-full px-4 py-3 rounded-lg border border-gray-200 text-center text-lg tracking-[0.3em] font-bold outline-none"
            maxlength="6" @input="inputCode = inputCode.replace(/\D/g, '')" />
          <button type="button"
            class="w-full py-3 rounded-full bg-gradient-to-r from-red-400 to-pink-400 text-white font-semibold active:scale-95 transition-all disabled:opacity-50"
            :disabled="loading || inputCode.length !== 6" @click="doRegister">
            {{ loading ? '注册中...' : '注册' }}
          </button>
        </div>

        <p class="text-center text-sm text-gray-400 mt-6">
          已有账户？
          <NuxtLink to="/auth/login" class="text-red-400 font-medium no-underline">登录 →</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()

const phone = ref('')
const nickname = ref('')
const sentCode = ref('')
const inputCode = ref('')
const codeSent = ref(false)
const loading = ref(false)

function sendCode() {
  const raw = phone.value.replace(/\D/g, '')
  phone.value = raw
  if (raw.length !== 11) { window.$toast('请输入11位手机号', 'error', 2000); return }
  sentCode.value = String(Math.floor(100000 + Math.random() * 900000))
  codeSent.value = true
}

async function doRegister() {
  if (inputCode.value !== sentCode.value) { window.$toast('验证码不正确', 'error', 2000); return }
  loading.value = true
  try {
    const formatted = '+86' + phone.value
    const email = 'phone_' + formatted.replace(/\+/g, '') + '@cardwish.com'
    const password = 'cw_' + formatted.replace(/\+/g, '')

    // Register via API
    const res = await $fetch('/api/auth/phone-login', {
      method: 'POST',
      body: { phone: formatted, password },
    })
    if (res.error) throw new Error(res.error)

    // Login after register
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)

    if (data?.session?.access_token) {
      document.cookie = 'auth_token=' + data.session.access_token + '; path=/; max-age=28800; SameSite=Lax'
      if (nickname.value) {
        await supabase.from('profiles').update({ nickname: nickname.value }).eq('id', data.user.id)
      }
    }

    await navigateTo('/')
  } catch (e) {
    { window.$toast('注册失败: ' + (e.message || '未知错误'), 'error'); }
  }
  loading.value = false
}
</script>
