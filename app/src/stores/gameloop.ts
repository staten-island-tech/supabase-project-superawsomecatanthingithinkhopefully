import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { gameLogic } from './setup'
import { profileStore } from './profile'
import { type Ref } from 'vue'
import { type RoomInfo, type roomPlayers,type Tiles, type Vertex } from '@/types/types'
import type { PostgrestError, PostgrestSingleResponse } from '@supabase/supabase-js'
import { rooms } from './rooms'

export const gameLoop = defineStore('gameLoop', () => {
    const use_profile = profileStore()
    const allPlayers = ref<roomPlayers[]>([])
    const currentTurnNumber = ref<number>(1)
    const currentTurnPlayer = ref<string>('')
    async function increment(resource:string,increment_value:number,userId:string,gameId:string){
      const {data,error} =await supabase.rpc('increment', {
  table_name: 'game_players',
  key_field: 'player_id_game',
  row_id: userId,
  game_id: gameId,
  game_id_field: 'game_id',
  x: increment_value,
  field_name: resource
    })
  console.log(error)}
  async function upgradeCity(userId:string,gameId:string){
    await increment('wheat',-2,userId,gameId)
    await increment('ore',-3,userId,gameId)
    await increment('vp',1,userId,gameId)
  }
  async function buySettlement(userId:string,gameId:string){
    
    await increment('wood',-1,userId,gameId)
    await increment('brick',-1,userId,gameId)
    await increment('vp',1,userId,gameId)
    await increment('sheep',-1,userId,gameId)
    await increment('wheat',-1,userId,gameId)
  }
  async function addSettelement(position: Vertex) {
    console.log(position)
  const game_id = gameLogic().route_id
  
  const userId = use_profile.profile?.id
  if (!userId) return

  const { data: currentPlayer } = await supabase
    .from('game_players')
    .select()
    .eq('player_id_game', userId)
    .eq('game_id', game_id)
    .single()

  const { data: tiles } = await supabase
    .from('tiles')
    .select()
    .filter('vertex', 'cs', `[{"row": ${position.row}, "column": ${position.column}}]`)
    .eq('game_id', game_id)

  if (!tiles || tiles.length === 0) return

  const { data: tilesWithSettlements } = await supabase
    .from('tiles')
    .select()
    .not('settlements', 'is', null)
    .eq('game_id', game_id)

  if (tilesWithSettlements) {
    console.log(tilesWithSettlements)
    for (const tileWithSettlements of tilesWithSettlements) {

      for (const existingSettlement of tileWithSettlements.settlements) {
        const check = checkSettled(
          existingSettlement.position.row,
          existingSettlement.position.column,
          position.row,
          position.column,
          existingSettlement.is_city
        )

        if (check === false) {
          return false
        }

        if (check === 'upgrade') {
          if(currentPlayer.wheat>=2&&currentPlayer.ore>=3){
            await upgradeCity(userId, game_id);
  for (const tile of tiles) {
    if (!tile.settlements) continue;
    for (let i = 0; i < tile.settlements.length; i++) {
      const settlement = tile.settlements[i];
      tile.settlements[i].is_city = true;
    }

    await supabase
      .from('tiles')
      .update({ settlements: tile.settlements })
      .eq('id', tile.id);
  }
  return;
          }
  
}
      }
    }
  }
if(currentPlayer.wood>=1&&currentPlayer.wheat>=1&&currentPlayer.sheep>=1&&currentPlayer.brick>=1){
  for (const tile of tiles) {
    const updatedSettlements = tile.settlements || []
    updatedSettlements.push({
      player_id: userId,
      position: { row: position.row, column: position.column },
      is_city: false
    })

    await supabase
      .from('tiles')
      .update({ settlements: updatedSettlements })
      .eq('id', tile.id)
  }
  await buySettlement(userId, game_id)
}
  

  
  allPlayers.value = (await getPlayers()) || []
  
  await resourceDistribution(game_id)
  
  await profileStore().getGameProfile(gameLogic().route_id)
}

  
    function checkSettled(establishedRow:number,establishedColumn:number,newRow:number,newColumn:number,isCity:boolean){
        
        newRow-=establishedRow
        newColumn-=establishedColumn
        if((newRow==0&&newColumn==0&&!isCity)){
          return 'upgrade'
        }
        if(!(Math.abs(newRow)<=1&&Math.abs(newColumn)<=1)){
            return false
        }
        return true
    }
    async function getPlayers():Promise<roomPlayers[]|null>{
        const {data:gamePlayers,error:gameError}= await supabase.from('game_players').select().eq('game_id',gameLogic().route_id)
        
        return gamePlayers
    }
    
    async function resourceDistribution(game_id:string) {
        const diceRoll =  7
        if(diceRoll==7){
          await loseRandomResources()
          return
        }
        const {data:validSet,error:errorSet}:{data:Tiles[]|null,error:PostgrestError|null}=await supabase.from('tiles').select().eq('number',diceRoll).eq('game_id',gameLogic().route_id).not('settlements', 'eq', '{}')
        
    
        const currentAmount = ref<number>(0)
        if(validSet ){
for (const tile of validSet){
    if(tile.settlements){
        for(const player of tile.settlements){
                const {data,error} = await supabase.rpc('increment', {
  table_name: 'game_players',
  key_field: 'player_id_game',
  row_id: profileStore().profile?.id,
  game_id: gameLogic().route_id,
  game_id_field: 'game_id',
  x: 1,
  field_name: tile.resource})
  console.log(error)


  
            }}
            
        }
        }
        
        // const {data,error} = await supabase.from('game_players').update({resources:validSet.resource}).eq('id',validSet.id)
        const {data:insertingResources,error:insertingError} = await supabase.from('game_players').update({})
    }
    

async function loseRandomResources() {
  allRoads()
  type ResourceKey = 'wood' | 'brick' | 'sheep' | 'wheat' | 'ore'

  const resourceKeys:ResourceKey[] =  ['wood', 'brick', 'sheep', 'wheat', 'ore']
  for (const player of allPlayers.value){
const total = resourceKeys.reduce((sum, key) => sum + (player[key] || 0), 0)
  if (total <= 7) continue
  const toLose = Math.floor(total / 2)
  for (let i = 0; i < toLose; i++) {
    const available = resourceKeys.filter(key => player[key] > 0)
    if (available.length === 0) break
    const randKey = available[Math.floor(Math.random() * available.length)]
    player[randKey]-=1
  }
  const updatedResources = {
  wood: player.wood,
  brick: player.brick,
  wheat: player.wheat,
  ore: player.ore,
  sheep: player.sheep,
}
  await supabase.from('game_players').update(updatedResources).eq('player_id_game',player.player_id_game)
  console.log(player)
}
  
  
  
} function allRoads(){
  let roads =[]
  let row=0
  let column = 0
  while(row<5&&column<5){
    roads.push({from:{row:row,column:column},to:{row:row+1,column:column}})
    roads.push({from:{row:row,column:column},to:{row:row,column:column+1}})
    
    column+=1
    if(column==5){
      row+=1
      column = 0
    }
    console.log(roads)
  }
}
  function checkRoad(from:Vertex,to:Vertex){
    const differenceRow = from.row-to.row
    const differenceColumn = from.column-to.column
    return ((differenceColumn==0&&differenceRow==1)||(differenceColumn==1&&differenceRow==0))
  }
  async function bulidRoad(from:Vertex,to:Vertex,userId:string,gameId:string){
    if (!checkRoad(from,to)){
      return
    }
    else{


    }
  }

    

    
  

  return {
    addSettelement,
    increment,
    getPlayers
    
  }
})


