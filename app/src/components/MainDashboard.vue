<template>
  <div data-theme="synthwave" class="min-h-screen">
    <!-- <div class="static">

      <div class="woman_in absolute bottom-120 left-99">
        <h2>WELCOME</h2>
      </div>

      <div class="New_Mexico absolute bottom-150 left-99">
        <h2>To</h2>
      </div>

      <div class="logo absolute bottom-200 left-99">
        <img src="/Logo.png" alt="Enhancing_Logo">
      </div>
    

    </div> -->

    <div class="static">

      <div class="avatar absolute top-5 right-5">
        <div class="w-24 rounded-full">
          <RouterLink to="/AccountStuff"><img src="/profile_temp.jpg" alt="profile_pic"/></RouterLink>
          
        </div>
        
      </div>
      <div class="absolute top-30 right-5">
        <h2 v-if="data">{{data.username}}</h2>
      </div>
      


      <div class="absolute bottom-80 left-133">
        <img class='h-60 w-60' src="/Logo.png" alt="Temp">

      </div v-for="">

      </div>
      <div v-for="data in fetched_data">
        
          <button @click="use_rooms.joinRoom(data.id,true)" class="absolute  bottom-50 left-145 bg-violet-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-full">Join a game. </button>
      </div>
      <div v-if="fetched_data&&fetched_data.length==0">
        <p>No Rooms currently. Make one</p>
      </div>

      <div class="glass absolute bottom-20 left 0 w-100 h-125">
        <h2 class="absolute bottom-110 left-30 text-2xl font-bold underline">Create Room</h2>

        <form @submit.prevent="handleRoom">
          <h3 class="absolute bottom-90 left-10">Players:</h3>
          <input
            class="absolute bottom-80 left-20"
            type="number"
            v-model.number="use_rooms.number_player"
            required
            min="1"
            placeholder="Number of players"
          />
          <button class="absolute bottom-5 left-25 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" type="submit">Create Room</button>
        </form>

      </div>
      
    </div>

  
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { useSignupStore } from '@/stores/authuser'
import { useRouter } from 'vue-router'
import { type profileType, type RoomInfo } from '@/types/types'
import { rooms } from '@/stores/rooms'
import { homePage } from '@/stores/homepage'
import routers from '@/router'
import { onMounted,ref } from 'vue'

const use_rooms = rooms()
const use_user = homePage()

const router = useRouter()
async function handleRoom() {
  const result = await use_rooms.makeRoom()
  
  if (result) {
    router.push({ path: `/${result['id']}` })
  }
}
const fetched_data = ref<RoomInfo[]|undefined>([])
const data = ref<profileType|null>(null)
onMounted(async ()=>{
  const user_info = await use_user.fetchUserData()
  const room_data = await use_rooms.fetchRooms()
  fetched_data.value = room_data
  data.value = user_info 
})


</script>

<style scoped>
.box {
  width: 500px;
  height: 500px;
}
</style>
