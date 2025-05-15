<template>
    <div data-theme="synthwave" class="min-h-screen">
      <button>Join a game</button>
      
      <form @submit.prevent="handleRoom">
    <input 
      type="number" 
      v-model.number="use_rooms.number_player" 
      required 
      min="1" 
      placeholder="Number of players" 
    />
    <button type="submit">Create Room</button>
  </form>
  <button v-for="data in fetched_data" @click="joinRoom(data.id)">Join Game {{ data.id }}</button>
    </div>
</template>

<script setup lang="ts">
import type {RoomInfo} from '@/types/types.ts'
import { useRouter } from 'vue-router'

import { rooms } from '@/stores/rooms'

import { onMounted,ref } from 'vue'
import { join } from 'path'

const use_rooms = rooms()
const router = useRouter()
async function handleRoom(){

  const result = await use_rooms.makeRoom()
  console.log(use_rooms.number_player)
  if(result){
    router.push({path:`/${result.id}`})
  }
  
}
const fetched_data = ref<RoomInfo[]|undefined>([])
onMounted(async ()=>{
  const data = await use_rooms.fetchRooms()
  fetched_data.value = data
})
async function joinRoom(id:string){

  
  router.push({path:`/${id}`})
  
  
}
</script>

<style scoped>

</style>