import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { type roomPlayers, type profileType } from '@/types/types'
import type { AuthError, PostgrestError } from '@supabase/supabase-js'
import { gameLogic } from './setup'

export const profileStore = defineStore('profileStore', () => {
    const profile = ref<profileType|null>(null)
    const gameProfile = ref<roomPlayers|null>()
    async function fetchUserProfile(){
        const {data:authData,error:authError} = await supabase.auth.getUser()
        const {data,error}= await supabase.from('profiles').select().eq('id',authData.user?.id).single()
        if(!error&&data){
            profile.value = data
        }
        return authData
    }
    async function getGameProfile(route_id:string){
        if(profile.value){
            const {data,error} = await supabase.from('game_players').select().eq('player_id_game',profile.value.id).eq('game_id',route_id).single()
            gameProfile.value = data
            return gameProfile.value
        }
    }
    async function fetchUserById(id:string){
        const {data} =await supabase.from('profiles').select().eq('id',id).single()
        return data
    }

    
    
    return {
        fetchUserProfile,
        profile,
        getGameProfile,
        gameProfile,
        fetchUserById
        
    }
  })