import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'

export const useSignupStore = defineStore('signup', () => {
  interface AuthForm {
  username: string
  email: string
  password: string
}
  const user_info = reactive<AuthForm>({
    username : '',
    email: '',
    password:''
  })
  
  const error = ref<string | null>(null)
  const isLoggedIn = ref(false)
  const user = ref(null)

  async function signup() {
    const result = await supabase.auth.signUp({
      email: user_info.email ,
      password: user_info.password,
      options: {
        data: {
          username: user_info.username
        }
      }
    })

    if (result.error) {
      error.value = result.error.message
    } else {
      console.log(user_info.username)
      const{data:testdata,error:testerror} = await supabase.auth.getUser()
      
      if (testdata.user != null){
        console.log(testdata.user.id)
        const {data, error } = await supabase.from('profiles').upsert({username:user_info.username}).eq('id',testdata.user?.id).select()
        return data
      }
      
    }

    return { data: result.data, error: result.error }
  }
  async function login() {
    const result = await supabase.auth.signInWithPassword({
      email: user_info.email,
      password: user_info.password,
      
    })
  
    if (result.error) {
      error.value = result.error.message
      console.log("bruh")
    } else {
      error.value = null
      isLoggedIn.value=true
      console.log(user_info.username)
    }
  
    return { data: result.data, error: result.error }
  }

  return {
    user_info,
    error,
    signup,
    login,
  }
})


