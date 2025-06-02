import { defineStore } from 'pinia'
import { rooms } from './rooms'
import { reactive, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
import { type Tiles } from '@/types/types'
import type { PostgrestError } from '@supabase/supabase-js'
export const gameLogic = defineStore('gameLogic', () => {
    const use_rooms = rooms()
    const router = useRoute()
    const route_id = ref('')

    const tilesTotal = ref<Tiles[]>([
        
  { resource: 'wood', quantity: 4,number:null },
  { resource: 'brick', quantity: 3,number:null },
  { resource: 'sheep', quantity: 4,number:null },
  { resource: 'wheat', quantity: 4 ,number:null},
  { resource: 'ore', quantity: 3 ,number:null},
  { resource: 'desert', quantity: 1,number:null },
    ])
    const individualTiles = ref<Tiles[]|null>([])
    let avalNumbers = ref<number[]>([2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12])
    function shuffle(array:number[]) {
        let currentIndex = array.length;

        while (currentIndex != 0) {

    
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

    
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
  }
}
    function tileCoordinates(row:Ref<number>,column:Ref<number>){
        if (row.value ==1 &&column.value ==3){
                row.value += 1
                column.value = 1
            }
            else if ((row.value == 2 || row.value == 4)&&column.value == 4){
                row.value += 1
                column.value = 1
            }
            else if(row.value == 3&&column.value == 5){
                row.value+=1
                column.value = 1
            }else{
                column.value+=1
            }
    }
    async function generateTiles(){
        const { data: existingTiles, error: existingTilesError } = await supabase
    .from('tiles')
    .select()
    .eq('game_id', route_id.value);
    if(existingTiles && existingTiles.length > 0  ){
        console.log()
        individualTiles.value = existingTiles
        return
    }
        console.log(individualTiles.value)
        shuffle(avalNumbers.value)
        const row = ref<number>(1)
        const column = ref<number>(0)
        while(tilesTotal.value.length>0){
        
        const randInt = Math.floor(Math.random()*tilesTotal.value.length)
            
            let assignedNumber = avalNumbers.value[0]
            tileCoordinates(row,column)
            
            
            if(tilesTotal.value && tilesTotal.value[randInt].resource==='desert'){
                assignedNumber = 7
            }
            else{
                assignedNumber = avalNumbers.value[0]
                avalNumbers.value.splice(0,1)
            }
            console.log(assignedNumber)
            if (individualTiles.value){
                individualTiles.value.push({resource:tilesTotal.value[randInt].resource,number:assignedNumber,position:{row:row.value,column:column.value}})

            }
            
            
            

            const{data:tileInsert,error:tileInsertError} = await supabase.from('tiles').upsert({game_id:route_id.value,resource:tilesTotal.value[randInt].resource,number:assignedNumber,position:{row:row.value,column:column.value}},{ onConflict: 'id' }).select()
            
            console.log(avalNumbers.value)
            
            if (tilesTotal.value[randInt].quantity){
                tilesTotal.value[randInt].quantity-=1
            }
            if (tilesTotal.value[randInt].quantity == 0){
                tilesTotal.value.splice(randInt,1)
            }

        }
        const{data,error}:{data:Tiles[]|null,error:PostgrestError|null} = await supabase.from('tiles').select()
        individualTiles.value = data
    
        
    }
    
    async function turnOrder(){
    
        const { data: selectData, error: selectError } = await supabase
    .from('game_players')
    .select()
    .eq('game_id', route_id.value);
    let id =0
    selectData?.forEach((player)=>{
        
    })
    }
    
    async function updateRoute(){
        route_id.value = router.params.gameid as string
        avalNumbers.value = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12]

        tilesTotal.value = [
        
  { resource: 'wood', quantity: 4,number:null },
  { resource: 'brick', quantity: 3,number:null },
  { resource: 'sheep', quantity: 4,number:null },
  { resource: 'wheat', quantity: 4 ,number:null},
  { resource: 'ore', quantity: 3 ,number:null},
  { resource: 'desert', quantity: 1,number:null },
    ]
        individualTiles.value = []
        await generateTiles()
    }
    return {
        updateRoute,
        individualTiles,
        route_id
        
    }
  })