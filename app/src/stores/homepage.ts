import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'

export const homePage = defineStore('homePage', () => {

    async function fetchUserData(){
        const {data:userid,error:id_error} = await supabase.auth.getUser()
        if (userid == null){
            console.log(id_error)
        }
        
        const {data,error} = await supabase.from('profiles').select().eq('id',userid.user)
    }

    
    
    return {

    }
  })