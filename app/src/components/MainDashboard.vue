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
import { gsap } from 'gsap'
import { useSignupStore } from '@/stores/authuser'
import { useRouter } from 'vue-router'
import { type RoomInfo } from '@/types/types'
import { rooms } from '@/stores/rooms'
import routers from '@/router'
import { onMounted,ref } from 'vue'

const use_rooms = rooms()
const router = useRouter()
async function handleRoom() {
  const result = await use_rooms.makeRoom()
  console.log(use_rooms.number_player)
  if (result) {
    router.push({ path: `/${result['id']}` })
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
onMounted(() => {
  console.log(1)

  gsap.to('.green', { rotation: 360, x: 100, duration: 1 })

  // target the element with a class of "purple" - rotate and move FROM 100px to the left over the course of 1 second.
  gsap.from('.purple', { rotation: -360, x: -100, duration: 1 })

  // target the element with a class of "blue" - rotate and move FROM 100px to the left, TO 100px to the right over the course of 1 second.
  gsap.fromTo('.blue', { x: -100 }, { rotation: 360, x: 100, duration: 1 })
})
</script>

<style scoped>
.box {
  width: 500px;
  height: 500px;
}
</style>
