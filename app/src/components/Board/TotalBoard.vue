<template>
    <div class="flex items-center justify-center min-h-screen">
  <div class="grid grid-cols-5 max-w-3xl">
    <IndividualTile
      v-if="game.individualTiles"
      v-for="(tile,index) in game.individualTiles"
      :key="index"
      :tile="tile"
      :isTurn="isTurn"
      :builtRoads="builtRoads"
      :settlements="settlements"
      @settle="handleSettle"
      @buildRoad="$emit('buildRoad',$event)"
      
    />
    
  </div>
  
  
    
</div>

    
</template>

<script setup lang="ts">
const emit = defineEmits(['buildRoad'])
import { gameLogic } from '@/stores/setup';
import IndividualTile from './IndividualTile.vue';
import { gameLoop } from '@/stores/gameloop';
import { computed, onMounted,ref } from 'vue';
import { useRoute } from 'vue-router';
import { profileStore } from '@/stores/profile';
import type { playerRoad, Settlement } from '@/types/types';
const game = gameLogic()
const use_profile = profileStore()

async function handleSettle(tile:{row:number,column:number}){
    await gameLoop().addSettelement(tile)
}
const props =defineProps<{
    isTurn:boolean;
    builtRoads:playerRoad[];
    settlements:Settlement[]
}>()




</script>

<style scoped>

</style>