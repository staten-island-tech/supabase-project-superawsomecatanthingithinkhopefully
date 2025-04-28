import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'

export const useSignupStore = defineStore('signup', () => {
  const username = ref<string>('')
  const email = ref<string>('')
  const password = ref<string>('')
  const error = ref<string | null>(null)
  const isLoggedIn = ref(false)
  const user = ref(null)

  async function signup() {
    const result = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          username: username.value
        }
      }
    })

    if (result.error) {
      error.value = result.error.message
    } else {
      error.value = null
    }

    return { data: result.data, error: result.error }
  }

  return {
    username,
    email,
    password,
    error,
    signup
  }
})
