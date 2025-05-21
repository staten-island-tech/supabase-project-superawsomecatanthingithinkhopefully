import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'

export const profileStore = defineStore('profileStore', () => {

    async function fetchUserProfile(){
        const {data:userid,error:errorid} = await supabase.auth.getUser()
        const {data,error} = await supabase.from('profiles').select().eq('id',userid.user?.id)
        console.log(data)

        
        
        
        
    }

    
    
    return {
        fetchUserProfile,
    }
  })