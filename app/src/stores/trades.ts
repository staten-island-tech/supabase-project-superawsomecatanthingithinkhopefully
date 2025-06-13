import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { gameLogic } from './setup'
import { profileStore } from './profile'
import { type Ref } from 'vue'
import { type RoomInfo, type roomPlayers,type Tiles, type Trade } from '@/types/types'
import type { PostgrestError, PostgrestSingleResponse } from '@supabase/supabase-js'
import { rooms } from './rooms'
import { gameLoop } from './gameloop'

export const tradeStore = defineStore('trades', () => {
    const currentTrade = ref<{
  initiatingPlayer: string
  recievingPlayer: string
  initResource: number
  typeInitResource: string
  recieveResource: number
  typeRecieveResource: string
  gameId: string
} | null>(null)
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
    .eq('game_id',gameId)
    .single()
    
    
    const { data: recievePlayer, error:reciever } = await supabase
    .from('game_players')
    .select()
    .eq('player_id_game', recievingPlayer)
    .eq('game_id',gameId)
    .single()

    
    if (initPlayer[typeInitResource]>=initResource && recievePlayer[typeRecieveResource] >= recieveResource){
        await gameLoop().increment(typeInitResource,-initResource,initiatingPlayer,gameId)
        await gameLoop().increment(typeRecieveResource,recieveResource,initiatingPlayer,gameId)

        await gameLoop().increment(typeInitResource,initResource,recievingPlayer,gameId)
        await gameLoop().increment(typeRecieveResource,-recieveResource,recievingPlayer,gameId)
      
    console.log("yes!")
    }
    const {data,error}=   await supabase
    .from('trades')
    .delete()
    .eq('init_id', initiatingPlayer)
    .eq('init_type', typeInitResource)
    .eq('init_quant', initResource)
    .eq('recieve_type', typeRecieveResource)
    .eq('recieve_quant', recieveResource)
    .eq('game_id', gameId);
        console.log(error)

    
    }
    async function offerTrade(initiatingPlayer:string,initResource:number,typeInitResource:string,recieveResource:number,typeRecieveResource:string,gameId:string){
         
        
        const {data,error} = await supabase.from('trades').insert({init_id:initiatingPlayer,init_type:typeInitResource,init_quant:initResource,recieve_type:typeRecieveResource,recieve_quant:recieveResource,game_id:gameId}).select().single()
        if(data&&!error){
        return data
    }
    }
    async function fetchTradeResults(gameId:string){
        const {data,error}:{data:Trade[]|null,error:PostgrestError|null} = await supabase.from('trades').select().eq('game_id',gameId)
        
        return data
    }
    
    
  return {
    bankTrade,
    offerTrade,
    fetchTradeResults,
    playerTrades
    
  }
})


