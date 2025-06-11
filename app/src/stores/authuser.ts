import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { type AuthForm } from '@/types/types'

export const useSignupStore = defineStore('signup', () => {
  
  const user_info = ref<AuthForm>({
    username : '',
    email: '',
    password:''
  })
  
  const error = ref<string | null>(null)
  const isLoggedIn = ref<boolean>(false)
  

  async function signup() {
    const result = await supabase.auth.signUp({
      email: user_info.value.email ,
      password: user_info.value.password,
      options: {
        data: {
          username: user_info.value.username
        }
      }
    })

    if (result.error) {
      error.value = result.error.message
    } else {
      // console.log(user_info.username)
      // const userId = result.data.user
      // if(userId){
      //   const {data:profileData,error:profileError} = await supabase.from('profiles').update({username:user_info.username}).eq('id',userId.id).select()
      // }
      
    }
    

    return { data: result.data, error: result.error }
  }
  async function login() {
    const result = await supabase.auth.signInWithPassword({
      email: user_info.value.email,
      password: user_info.value.password,
      
    })
  
    if (result.error) {
      error.value = result.error.message
    } else {
      error.value = null
      isLoggedIn.value=true
      
      console.log(user_info.value.username)
    }
  
    return { data: result.data, error: result.error, isLoggedIn }
  }
  
  

  return {
    user_info,
    error,
    signup,
    login,
    
    isLoggedIn,
  }
})


