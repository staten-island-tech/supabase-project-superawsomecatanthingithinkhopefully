import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { gameLogic } from './setup'
import { profileStore } from './profile'
import { type Ref } from 'vue'
import { type roomPlayers,type Tiles } from '@/types/types'
import type { PostgrestError, PostgrestSingleResponse } from '@supabase/supabase-js'
import { rooms } from './rooms'
export const gameLoop = defineStore('gameLoop', () => {
    const use_profile = profileStore()
    const allPlayers = ref<roomPlayers[]>([])
    const currentTurnNumber = ref<number>(1)
    const currentTurnPlayer = ref<string>('')
  async function addSettelement(position: { row: number; column: number }) {
  const game_id = gameLogic().route_id
  const userId = use_profile.profile?.id
  console.log(userId)
  if (!userId) return

  const { data: tiles, error: tileError } = await supabase
    .from('tiles')
    .select()
    .filter('vertex', 'cs', `[{"row": ${position.row}, "column": ${position.column}}]`)
    .eq('game_id', game_id)
    console.log(tileError)
  if (tileError || !tiles || tiles.length === 0) return
 const { data: existingSettlements, error: settlementsError } = await supabase
    .from('tiles')
    .select()
    .not('settlement_row', 'is', null)
    .eq('game_id', game_id)
  

  if (existingSettlements) {
    for (const settlement of existingSettlements) {
      if (
        !checkSettled(
          settlement.settlement_row,
          settlement.settlement_column,
          position.row,
          position.column
        )
      ) {
        return false
      }
    }
  }
  const settlementsToUpdate = tiles.map(tile => {
    const updatedSettlements = tile.settlements || []
    if (!updatedSettlements.includes(userId)) updatedSettlements.push(userId)
    return {
      id: tile.id,
      settlements: updatedSettlements
    }
  })

  for (const tile of settlementsToUpdate) {
    await supabase
      .from('tiles')
      .update({
        settlements: tile.settlements,
        settlement_row: position.row,
        settlement_column: position.column
      })
      .eq('id', tile.id)
  }

  await supabase.rpc('increment', {
  table_name: 'game_players',
  key_field: 'player_id_game',
  row_id: userId,
  game_id: gameLogic().route_id,
  game_id_field: 'game_id',
  x: 1,
  field_name: 'vp'
});

  allPlayers.value = (await getPlayers()) || []
  console.log(allPlayers.value)
  await determineTurn(currentTurnNumber)
  await resourceDistribution(game_id)
  await subscriptions(gameLogic().route_id)
  await profileStore().getGameProfile()
}

    function checkSettled(establishedRow:number,establishedColumn:number,newRow:number,newColumn:number){
        console.log("this is the establisehed row",establishedRow)
        console.log('this is the estbalihed column',establishedColumn)
        newRow-=establishedRow
        newColumn-=establishedColumn
        
        if((Math.abs(newRow)<=1&&Math.abs(newColumn)<=1)||(newRow==0&&newColumn==0)){
            return false
        }
        return true
    }
    async function getPlayers():Promise<roomPlayers[]|null>{
        const {data:gamePlayers,error:gameError} = await supabase.from('game_players').select().eq('game_id',gameLogic().route_id)
        console.log(gamePlayers)
        console.log(gameError)
        return gamePlayers
    }
    async function determineTurn(turnNumber:Ref<number>){
        if(turnNumber.value<=allPlayers.value.length){
            currentTurnPlayer.value = allPlayers.value[turnNumber.value-1].player_id_game            
        }
        else{
            turnNumber.value = 1
        }
    }
    async function resourceDistribution(game_id:string) {
        const diceRoll =  3
        const {data:validSet,error:errorSet}:{data:Tiles[]|null,error:PostgrestError|null}=await supabase.from('tiles').select().eq('number',diceRoll).eq('game_id',gameLogic().route_id).not('settlements', 'eq', '{}')
        
    
        const currentAmount = ref<number>(0)
        if(validSet ){
for (const tile of validSet){
    if(tile.settlements){
        for(const player of tile.settlements){
                const { data: playerData,error:gameerror } = await supabase
  .from('game_players')
  .select()
  .eq('player_id_game', player)
  .eq('game_id', gameLogic().route_id)
  
        const resource:string = tile.resource
     

     if (playerData && resource ) {
  currentAmount.value = playerData[0][resource as keyof typeof playerData[0]]||0;
        currentAmount.value+=1
        
}

const { data,error } = await supabase
  .from('game_players')
  .update({ [tile.resource]: currentAmount.value })
  .eq('player_id_game', player)
  .eq('game_id', game_id);
  
            }}
            
        }
        }
        
        // const {data,error} = await supabase.from('game_players').update({resources:validSet.resource}).eq('id',validSet.id)
        const {data:insertingResources,error:insertingError} = await supabase.from('game_players').update({})
    }
    async function subscriptions(game_id:string){
        const myChannel= supabase.channel('game_players_resource')
  .on(
    'postgres_changes',
    { event: '*' ,
    schema:'public',
    table:'game_players',
    filter:`game_id=eq.${game_id}`,},
    (payload)=>console.log(payload)
  )
  .subscribe()
  console.log(game_id)
    }

    
  

  return {
    addSettelement
  }
})


