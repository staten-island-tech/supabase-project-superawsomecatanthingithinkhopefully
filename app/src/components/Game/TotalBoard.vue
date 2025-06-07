<template>
    <div >
        
        <IndividualTile
        v-if="game.individualTiles"
        v-for="(tile,index) in game.individualTiles"
        :key = "index"
        :tile = "tile"
        @settle = "handleSettle"
        />
    </div>
    
</template>

<script setup lang="ts">
import { gameLogic } from '@/stores/setup';
import IndividualTile from './IndividualTile.vue';
import { gameLoop } from '@/stores/gameloop';
import { onMounted,ref } from 'vue';
import { useRoute } from 'vue-router';
import { profileStore } from '@/stores/profile';
const game = gameLogic()
const use_profile = profileStore()

async function handleSettle(tile:{row:number,column:number}){
    await gameLoop().addSettelement(tile)
}
console.log(2)
</script>

<style scoped>

</style>