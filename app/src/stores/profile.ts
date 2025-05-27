import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { type profileType } from '@/types/types'
import type { AuthError, PostgrestError } from '@supabase/supabase-js'

export const profileStore = defineStore('profileStore', () => {
    const profile = ref<profileType|null>(null)

    async function fetchUserProfile(){
        const {data:authData,error:authError} = await supabase.auth.getUser()
        const {data,error}:{data:profileType|null,error:PostgrestError|null} = await supabase.from('profiles').select().eq('id',authData.user?.id).single()
        console.log(data)
        if(!error&&data){
            profile.value = data
        }
        console.log(authData)
        return authData
        
        

        
        
        
        
    }

    
    
    return {
        fetchUserProfile,
        profile,
        
    }
  })