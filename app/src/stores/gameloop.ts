import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { gameLogic } from './setup'
import { profileStore } from './profile'
import { type Ref } from 'vue'
import { type road, type RoomInfo, type roomPlayers,type Tiles, type Vertex } from '@/types/types'
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
  }
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
  const game_id = gameLogic().route_id
  const userId = use_profile.profile?.id
  if (!userId) return

  const { data: currentPlayer } = await supabase
    .from('game_players')
    .select()
    .eq('player_id_game', userId)
    .eq('game_id', game_id)
    .single()

  const { data: existingSettlements,error } = await supabase
    .from('settlements')
    .select()
    .eq('game_id', game_id)

  const { data: playerRoads } = await supabase
    .from('roads')
    .select()
    .eq('game_id', game_id)
    .eq('player_id', userId)

  const { data: gameData } = await supabase
    .from('game')
    .select()
    .eq('id', game_id)
    .single()

  for (const settlement of existingSettlements || []) {
    const check = checkSettled(
      settlement.row,
      settlement.column,
      position.row,
      position.column,
      settlement.is_city
    )
    if (check === false) return false
    if (check === 'upgrade' && settlement.player_id === userId) {
      if (currentPlayer.wheat >= 2 && currentPlayer.ore >= 3) {
        await upgradeCity(userId, game_id)
        await supabase
          .from('settlements')
          .update({ is_city: true })
          .eq('id', settlement.id)

        return
      }
    }
  }

  if (
    gameData.round >= 2 &&
    !isVertexConnected(position, playerRoads || [])
  ) return

  if (
    currentPlayer.wood >= 1 &&
    currentPlayer.brick >= 1 &&
    currentPlayer.wheat >= 1 &&
    currentPlayer.sheep >= 1
  ) {
    const {data,error}=await supabase.from('settlements').insert({
      player_id: userId,
      game_id: game_id,
      row: position.row,
      column: position.column,
      is_city: false
      
    })
    await buySettlement(userId, game_id)
  }

  allPlayers.value = (await getPlayers()) || []
  await profileStore().getGameProfile(game_id)
}


  
    function checkSettled(establishedRow:number,establishedColumn:number,newRow:number,newColumn:number,isCity:boolean){
        
        newRow-=establishedRow
        newColumn-=establishedColumn
        if((newRow==0&&newColumn==0&&!isCity)){
          return 'upgrade'
        }
        if((Math.abs(newRow)<=1&&Math.abs(newColumn)<=1)){
            return false
        }
        return true
    }
    async function getPlayers():Promise<roomPlayers[]|null>{
        const {data:gamePlayers,error:gameError}= await supabase.from('game_players').select().eq('game_id',gameLogic().route_id).order('turn_order',{ascending:true})
        
        return gamePlayers
    }
    
    async function resourceDistribution(game_id: string,diceRoll:number) {
      console.log("YABAADE")
  
  if (diceRoll === 7) {
    await loseRandomResources()
    return
  }

  const { data: tiles } = await supabase
    .from('tiles')
    .select()
    .eq('number', diceRoll)
    .eq('game_id', game_id)

  const { data: settlements,error:errors } = await supabase
    .from('settlements')
    .select()
    .eq('game_id', game_id)
    

  for (const tile of tiles || []) {
    for (const settlement of settlements || []) {
      const isOnTile =
        Math.abs(settlement.row - tile.position.row) <= 1 &&
        Math.abs(settlement.column - tile.position.column) <= 1
      console.log(isOnTile)
      if (!isOnTile) continue
      let amount = 1
      if (settlement.is_city){
        amount = 2
      }
      

     const {error}= await supabase.rpc('increment', {
        table_name: 'game_players',
        key_field: 'player_id_game',
        row_id: settlement.player_id,
        game_id: game_id,
        game_id_field: 'game_id',
        x: amount,
        field_name: tile.resource
      })
      console.log(error)
    }
  }
}

    

async function loseRandomResources() {
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
}
  
  
  
} 
function isVertexConnected(vertex: Vertex, roads: road[]) {
  return roads.some(road =>
    (vertex.row === road.from.row && vertex.column === road.from.column) ||
    (vertex.row === road.to.row && vertex.column === road.to.column)
  )
}

function isAdjacent(v1: Vertex, v2: Vertex) {
  return (
    (v1.row == v2.row && Math.abs(v1.column - v2.column) === 1) ||
    (v1.column === v2.column && Math.abs(v1.row - v2.row) === 1)
  );
}
  async function BuildRoad(userId:string,gameId:string,playerRoads:road[],newRoad:road,playerSettlements:Vertex[]){
    const {data:playerData,error}=await supabase.from('game_players').select().eq('player_id_game',userId).eq('game_id',gameId).single()

    const connectedSettlement = playerSettlements.some((settlement)=>{
       return (newRoad.from.row == settlement.row && newRoad.from.column == settlement.column) || (newRoad.to.row == settlement.row&&newRoad.to.column == settlement.column)
    })
    const connectedRoad = playerRoads.some((road) => {
  return (
    (road.from.row === newRoad.from.row && road.from.column === newRoad.from.column) ||
    (road.to.row === newRoad.from.row && road.to.column === newRoad.from.column) ||
    (road.from.row === newRoad.to.row && road.from.column === newRoad.to.column) ||
    (road.to.row === newRoad.to.row && road.to.column === newRoad.to.column)
  )
})

    const roadExists = playerRoads.some(road =>
  ((road.from.row === newRoad.from.row && road.from.column === newRoad.from.column) &&
   (road.to.row === newRoad.to.row && road.to.column === newRoad.to.column)) ||

  ((road.from.row === newRoad.to.row && road.from.column === newRoad.to.column) &&
   (road.to.row === newRoad.from.row && road.to.column === newRoad.from.column))
);
    if ((connectedRoad || connectedSettlement) && !roadExists&&playerData.wood>=1&&playerData.brick>=1){
      const { data, error } = await supabase
  .from('roads')
  .insert({
    game_id: gameId,
    player_id: userId,
    from: newRoad.from,  
    to: newRoad.to,      
    color:playerData.color
  }).select();
  
  await buyRoad(userId,gameId)
  return true
    }
    
  }
  
  async function buyRoad(userId:string,gameId:string) {
    await increment('wood',-1,userId,gameId)
    await increment('brick',-1,userId,gameId)

    
  }
  

    

    
  

  return {
    addSettelement,
    increment,
    getPlayers,
    BuildRoad,
    resourceDistribution
    
  }
})


