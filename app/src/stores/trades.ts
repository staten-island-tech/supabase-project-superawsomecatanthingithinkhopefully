import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { gameLogic } from './setup'
import { profileStore } from './profile'
import { type Ref } from 'vue'
import { type RoomInfo, type roomPlayers,type Tiles } from '@/types/types'
import type { PostgrestError, PostgrestSingleResponse } from '@supabase/supabase-js'
import { rooms } from './rooms'
import { gameLoop } from './gameloop'

export const trades = defineStore('trades', () => {
    async function bankTrade(tradeIn:number,typeIn:string,typeOut:string,userId:string,gameId:string){
        const { data: player, error } = await supabase
    .from('game_players')
    .select()
    .eq('player_id_game', userId)
    .eq('game_id', gameId)
    .single()
        if (tradeIn!=3||typeIn===typeOut||player[typeIn]<3){
            return
        }
        else{
            await gameLoop().increment(typeIn,-3,userId,gameId)
            await gameLoop().increment(typeOut,1,userId,gameId)
        }
    }
    async function playerTrades(initiatingPlayer:string,recievingPlayer:string,initResource:number,typeInitResource:string,recieveResource:number,typeRecieveResource:string,gameId:string){
        const { data: initPlayer, error:initError } = await supabase
    .from('game_players')
    .select()
    .eq('player_id_game', initiatingPlayer)
    .single()
    const { data: recievePlayer, error:reciever } = await supabase
    .from('game_players')
    .select()
    .eq('player_id_game', recievingPlayer)
    .single()
    if (initPlayer[typeInitResource]>=initResource && recievePlayer[typeRecieveResource] >= recieveResource){
        await gameLoop().increment(typeInitResource,initResource,initiatingPlayer,gameId)
        await gameLoop().increment(typeRecieveResource,recieveResource,initiatingPlayer,gameId)

        await gameLoop().increment(typeInitResource,initResource,recievingPlayer,gameId)
        await gameLoop().increment(typeRecieveResource,recieveResource,recievingPlayer,gameId)
    }

    }
  return {
    
    
  }
})


