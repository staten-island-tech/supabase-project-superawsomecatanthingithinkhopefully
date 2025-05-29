import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { type Tiles } from '@/types/types'
export const gameLogic = defineStore('gameLogic', () => {
    const tilesTotal = ref<Tiles[]>([
        
  { resource: 'wood', quantity: 4,number:null },
  { resource: 'brick', quantity: 3,number:null },
  { resource: 'sheep', quantity: 4,number:null },
  { resource: 'wheat', quantity: 4 ,number:null},
  { resource: 'ore', quantity: 3 ,number:null},
  { resource: 'desert', quantity: 1,number:null },
    ])
    const individualTiles = ref<Tiles[]>([])
    let avalNumbers = [2, 3, 4, 5, 6, 6, 8, 8, 9, 10, 11, 12]
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
        console.log(tilesTotal.value)
        shuffle(avalNumbers)
        const row = ref<number>(0)
        const column = ref<number>(0)
        while(tilesTotal.value){
        console.log(tilesTotal.value)
        const randInt = Math.floor(Math.random()*tilesTotal.value.length)
            if (row.value ==1 &&column.value ==3){
                row.value = 2
                column.value = 1
            }
            else if ((row.value == 2 || row.value == 4)&&column.value == 4){
                row.value += 1
                column.value = 1
            }
            else if(row.value == 3&&column.value == 5){
                row.value+=1
                column.value = 1
            }
            
            
            row.value+=1
            column.value+=1
            individualTiles.value.push({resource:tilesTotal.value[randInt].resource,number:avalNumbers[0],position:{row:row.value,column:column.value}})
            
            if (tilesTotal.value[randInt].quantity){
                tilesTotal.value[randInt].quantity-=1
            }
            if (tilesTotal.value[randInt].quantity == 0){
                tilesTotal.value.splice(randInt,1)
            }
        }
        
            
            
        
        console.log(individualTiles.value)
        
        
        
    }

    
    
    return {
        generateTiles
    }
  })