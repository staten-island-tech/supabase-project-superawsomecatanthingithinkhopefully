import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { type profileType } from '@/types/types'
import type { AuthError, PostgrestError } from '@supabase/supabase-js'
import { useRoute, useRouter } from 'vue-router'
import { type Hosttype } from '@/types/types'

export const gamers = defineStore('gameStore', () => {
    const router = useRoute()
    const routers = useRouter()
    const room_id = router.params.gameid as string
    const room_host = ref()

    async function get_host(){
        const {data, error}: {data: Hosttype[] | null, error: PostgrestError|null} = await supabase.from('game').select('user_id, id').eq('id', room_id)
        room_host.value = data
        return room_host
    }

    
    
    return {
        get_host,
        room_host,
        
    }
  })