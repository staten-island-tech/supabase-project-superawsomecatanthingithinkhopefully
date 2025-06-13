import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { type profileType } from '@/types/types'
import type { AuthError, PostgrestError } from '@supabase/supabase-js'
import { useRoute, useRouter } from 'vue-router'
import { type Hosttype, type Name_TagType } from '@/types/types'


export const gamers = defineStore('gameStore', () => {
    const router = useRoute()
    const routers = useRouter()
    const room_id = router.params.gameid as string
    const room_host = ref()

    async function get_host(){
        const {data:Hostdata, error}: {data: Hosttype[] | null, error: PostgrestError|null} = await supabase.from('game').select('user_id, id').eq('id', room_id)
        if (Hostdata){
            room_host.value = Hostdata[0].user_id
            const {data, error}: {data: Name_TagType[] | null, error: PostgrestError | null} = await supabase.from('profiles').select('username, id').eq('id', room_host.value)
            if (data){
                room_host.value = data[0].username
                
                return room_host
            }
            
        }
        
    }

    
    
    return {
        get_host,
        room_host,
        
    }
  })