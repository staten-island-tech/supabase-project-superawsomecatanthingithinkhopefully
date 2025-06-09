import { defineStore } from 'pinia'
import { rooms } from './rooms'
import { reactive, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
import { type Tiles,type Vertices,type RoomInfo, type roomPlayers } from '@/types/types'
import type { PostgrestError } from '@supabase/supabase-js'
import { vertexData } from '@/vertex'

export const gameLogic = defineStore('gameLogic', () => {
    const use_rooms = rooms()
    const router = useRoute()
    const route_id = ref('')

    const tilesTotal = ref<Tiles[]>([
  { resource: 'wood', quantity: 6, number: null },
  { resource: 'brick', quantity: 5, number: null },
  { resource: 'sheep', quantity: 5, number: null },
  { resource: 'wheat', quantity: 5, number: null },
  { resource: 'ore', quantity: 3, number: null },
  { resource: 'desert', quantity: 1, number: null }
])

    const current_player = ref<string>('')
    const individualTiles = ref<Tiles[]|null>([])
let avalNumbers = ref<number[]>([2, 3, 3, 4, 4, 5, 5, 6, 6,8, 8, 9, 9, 10, 10, 11, 11, 12,3, 4, 5, 6, 9, 10
]);
    function shuffle(array:number[]) {
        let currentIndex = array.length;

        while (currentIndex != 0) {

    
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

    
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
  }
}
    
    async function generateTiles(){
        const { data: existingTiles, error: existingTilesError } = await supabase
    .from('tiles')
    .select()
    .eq('game_id', route_id.value)
     .order('position->>row', { ascending: true })
  .order('position->>column', { ascending: true })
    console.log(existingTilesError)
    if(existingTiles && existingTiles.length > 0  ){
        individualTiles.value = existingTiles
        return
    }
        
        shuffle(avalNumbers.value)
        const row = ref<number>(1)
        const column = ref<number>(0)
        while(tilesTotal.value.length>0){
        
        const randInt = Math.floor(Math.random()*tilesTotal.value.length)
            
            let assignedNumber = avalNumbers.value[0]
            if(column.value==5){
                row.value+=1
                column.value = 1
            }
            else{
                column.value+=1
            }
            
            
            if(tilesTotal.value && tilesTotal.value[randInt].resource==='desert'){
                assignedNumber = 7
            }
            else{
                assignedNumber = avalNumbers.value[0]
                avalNumbers.value.splice(0,1)
            }
            
            // if (individualTiles.value){
            //     individualTiles.value.push({resource:tilesTotal.value[randInt].resource,number:assignedNumber,position:{row:row.value,column:column.value}})

            // }
            
            
            

            const{data:tileInsert,error:tileInsertError} = await supabase.from('tiles').upsert({game_id:route_id.value,resource:tilesTotal.value[randInt].resource,number:assignedNumber,position:{row:row.value,column:column.value}},{ onConflict: 'id' }).select()
            
                        
            if (tilesTotal.value[randInt].quantity){
                tilesTotal.value[randInt].quantity-=1
            }
            if (tilesTotal.value[randInt].quantity == 0){
                tilesTotal.value.splice(randInt,1)
            }

        }
        // const{data,error}:{data:Tiles[]|null,error:PostgrestError|null} = await supabase.from('tiles').select().eq('game_id',route_id.value)
        // individualTiles.value = data
    }
    async function determineTurn(route:string){
          const { data: players, error: fetchError } = await supabase
    
          .from('game_players')
          .select('player_id_game')
          .eq('game_id', route)
          console.log(players)
          if(players){
            for (let i = 0; i < players.length; i++) {
        const player = players[i]
    
        const { data:updatedda,error: updateError } = await supabase
          .from('game_players')
          .update({ turn_order: i })
          .eq('player_id_game', player.player_id_game)
          .eq('game_id', route)
          .select()
          console.log(updatedda)
          }
    const { data: selectData, error: selectError }= await supabase
    .from('game_players')
    .select('player_id_game,turn_order')
    .eq('game_id', route)
    .order('turn_order',{ascending:true})
    console.log(selectError)
    
    if(selectData && current_player.value===''){
        current_player.value = selectData[0].player_id_game
        const {data:updateData,error:updateError}:{data:RoomInfo|null,error:PostgrestError|null} = await supabase.from('game').update({turn_index:0}).eq('id',route).select().single()
        console.log(updateData)
    }
        
           
    
        
      }
    
    
    
        }
    async function turnOrder(route_id:string){
    const { data: selectData, error: selectError }:{data:roomPlayers[]|null,error:PostgrestError|null} = await supabase
    .from('game_players')
    .select()
    .eq('game_id', route_id)
    .order('turn_order',{ascending:true})
    console.log(selectData)
    console.log(selectError)

    const {data,error}:{data:RoomInfo|null,error:PostgrestError|null} = await supabase.from('game').select().eq('id',route_id).single()
    console.log(data)
    console.log(data?.turn_index)
    // if(selectData && data?.round ==0&& data.turn_index==0){
    //     current_player.value = selectData[0].player_id_game
    //     const {data:updateData,error:updateError}:{data:RoomInfo|null,error:PostgrestError|null} = await supabase.from('game').update({turn_index:data?.turn_index,round:data?.round}).eq('id',route_id).single()
    // }
    if(selectData && data &&selectData[data.turn_index]){
        
            console.log(selectData[data?.turn_index])

        current_player.value = selectData[data.turn_index].player_id_game
    }
    else{
        console.log("spooky")
    }
    console.log(data?.number_player)
    if (data && data?.turn_index +1 >= data?.number_player ){
        console.log(data.turn_index)
        console.log("uefwu")
        data.turn_index = 0
        data.round += 1
    }
  
    else if(data){
        data.turn_index+=1
    }
    

    const {data:updateData,error:updateError}:{data:RoomInfo|null,error:PostgrestError|null} = await supabase.from('game').update({turn_index:data?.turn_index,round:data?.round}).eq('id',route_id).single()
    
    
    
    }
    
        
    
   
    
    
    
    
    async function updateRoute(game_id:string){
        route_id.value = game_id

        
 avalNumbers.value = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12]

        const tilesTotal = ref<Tiles[]>([
  { resource: 'wood', quantity: 6, number: null },
  { resource: 'brick', quantity: 5, number: null },
  { resource: 'sheep', quantity: 5, number: null },
  { resource: 'wheat', quantity: 5, number: null },
  { resource: 'ore', quantity: 3, number: null },
  { resource: 'desert', quantity: 1, number: null }
])

        individualTiles.value = []
        await generateTiles()
        await vertexConnection()
        const { data: updatedTiles } = await supabase
  .from('tiles')
  .select()
  .eq('game_id', route_id.value)
  .order('position->>row', { ascending: true })
  .order('position->>column', { ascending: true })

individualTiles.value = updatedTiles || []
        console.log(individualTiles.value)
        
        }
    async function vertexConnection(){
        
            for (let i = 0; i < vertexData.length; i++) {
  const { data, error } = await supabase
    .from('tiles')
    .update({ vertex: vertexData[i].vertices })
    .eq('position->>row', String(vertexData[i].position.row))
    .eq('position->>column', String(vertexData[i].position.column))
    .eq('game_id',route_id.value)
    

  
  
}}
    
    

    
       
    
    
                
                

    return {
        updateRoute,
        individualTiles,
        route_id,
        turnOrder,
        current_player,
        determineTurn,
        shuffle
        
    }
  })