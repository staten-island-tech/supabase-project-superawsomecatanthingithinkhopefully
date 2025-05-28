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
        shuffle(avalNumbers)
        const x = ref<number>(0)
        const y = ref<number>(0)
        tilesTotal.value.forEach((tile,index)=>{
            const randInt = Math.floor(Math.random()*tilesTotal.value.length)
            x.value+=1
            y.value+=1
            individualTiles.value.push({resource:tilesTotal.value[randInt].resource,number:avalNumbers[0],position:{x:x.value,y:y.value}})
        })
        console.log(individualTiles.value)
        
        
        
    }

    
    
    return {
        generateTiles
    }
  })