<template>
  <div data-theme="synthwave" class="min-h-screen">
    
    
      <button @click="handleDeletion()" v-if="use_rooms.id == use_rooms.user_id">delete room</button>


    <h2 v-if="!use_profile.profile">Loading...</h2>
        <div class="" v-else>
            <h2 >Username: {{ use_profile.profile.username }}</h2>

        </div>
        <div class="catan-board">
    <div
  class="grid justify-center gap-2 mx-auto my-5"
  style="grid-template-columns: repeat(7, 80px); grid-template-rows: repeat(5, 80px);"
>
  <div
    v-for="(tile, index) in use_gameLogic.individualTiles"
    :key="index"
    :class="[
      'w-[80px] h-[80px] border-2 border-gray-800 rounded-lg flex justify-center items-center font-bold text-[1.1rem] select-none capitalize',
      index % 2 === 0 ? 'bg-gray-100' : 'bg-blue-100'
    ]"
    :style="{
      gridRow: tile.position?.row ?? 'auto',
      gridColumn: tile.position?.column ?? 'auto',
    }"
  >
    {{ tile.resource }}
  </div>
</div>


  </div>
    </div>

    

 <div>
  <button @click = "use_gameLogic.updateRoute()">1</button>
    

  </div>
</template>


<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient';
import { rooms } from '@/stores/rooms';
import { profileStore } from '@/stores/profile';
import { gameLogic } from '@/stores/logic';
import { onMounted } from 'vue';
import { onBeforeRouteUpdate, useRoute,useRouter } from 'vue-router';
const router = useRoute()
const routers = useRouter()
const use_rooms = rooms()
const use_profile = profileStore()
const use_gameLogic = gameLogic()

async function handleDeletion(){
  
  
  
  
  await use_rooms.deleteRoom(use_gameLogic.route_id)

  
  routers.push({path:"/dash"})
}

onMounted(async()=>{
  
  const tiles = await use_gameLogic.updateRoute()
  console.log(use_gameLogic.individualTiles)
  const result = await use_profile.fetchUserProfile()
    
})
</script>

<style scoped>

</style>
