<template>
  <div data-theme="synthwave" class="background-wrapper min-h-screen" ref="container"  @mousemove="handleMouseMove">
      <!-- <div class="background color-layer"></div>
      <div ref="imageLayer" class="background image-layer"></div> -->
      <div class="content">
        <div class="static">
          
          <div v-if="profile_picture" class=" avatar absolute top-5 right-5">
            <div class="w-24 rounded-full">
              <RouterLink to="/AccountStuff"><img :src="profile_picture" alt="profile_pic"/></RouterLink>
            
            </div>
          
          </div>
          
          
          <div class="name absolute top-30 right-5">
            <h2 v-if="data">{{data.username}}</h2>
          </div>
          


          <div class=" relative top-[10vw] left-[42vw] h-60 w-60">
            <img class='centerlogo h-60 w-60' src="/Logo.png" alt="Temp">

          </div>

          
          <div v-if="fetched_data && fetched_data.length > 0" class="join_dropdown mt-10 flex justify-center relative top-[10vw] left-[5vw]">
            <select
              v-model="selectedRoomId"
              @change="joinSelectedRoom"
              class="p-2 rounded bg-violet-600 text-white font-bold cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option disabled value="">Select a room to join</option>
              <option
                v-for="room in fetched_data"
                :key="room.id"
                :value="room.id"
                class="bg-violet-600 text-white"
              >
                Join Room {{ room.id }}
              </option>
            </select>
          </div>
          
          <div v-if="fetched_data&&fetched_data.length==0">
            <p>No Rooms currently. Make one</p>
          </div>

          <div class="create_box glass absolute bottom-20 left-0 w-100 h-125">
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
import { supabase } from '@/lib/supabaseClient'
import type { PostgrestError } from '@supabase/supabase-js'
import { nextTick } from 'vue'
import { onUnmounted } from 'vue'



const selectedRoomId = ref('')

function joinSelectedRoom() {
  if (selectedRoomId.value) {
    use_rooms.joinRoom(selectedRoomId.value, true)
    selectedRoomId.value = ''
  }
}


const container = ref<HTMLElement | null>(null)


function handleMouseMove(event: MouseEvent) {
  const { innerWidth } = window
  const x = event.clientX

  
  const proximityToLeft = 1 - (x / innerWidth)

  
  
  gsap.to('.centerlogo', {
    opacity: proximityToLeft,
    duration: 0.3,
    ease: 'power2.out',
  })
  gsap.to('.join_dropdown', {
    opacity: proximityToLeft,
    duration: 0.3,
    ease: 'power2.out',
  })
}

const use_rooms = rooms()
const use_user = homePage()

const profile_picture = ref()

const router = useRouter()
async function handleRoom() {
  const result = await use_rooms.makeRoom()
  
  if (result) {
    router.push({ path: `/${result['id']}-lobby` })
  }
}
const fetched_data = ref<RoomInfo[]|undefined>([])
const data = ref<profileType|null>(null)
const tl = gsap.timeline()

const audio = ref(new Audio('/Never getting back together Trump x Elon.mp3'))

onMounted(async ()=>{
  tl.set('.name', {opacity: 0, y: '100vw'})
  tl.set('.create_box', {opacity: 0, y: '100vw'})

  
  audio.value.play()


  const user_info = await use_user.fetchUserData()
  const room_data = await use_rooms.fetchRooms()
  fetched_data.value = room_data
  data.value = user_info 
  
  const {data:pic, error} = await supabase.from('profiles').select('profile_pic').eq('id', data.value?.id).single()
  profile_picture.value = pic?.profile_pic
  console.log(profile_picture.value)

  await nextTick()
  
  tl.set('.avatar', {opacity: 0, y: '100vw'})
    



  tl.to('.create_box', {opacity: 1, y: 0, duration: 1.5, ease: 'power2.out'})
    .to('.avatar', {opacity: 1, y: 0, duration: 1.5, ease: 'power2.out'}, '-=0.75')
    .to('.name', {opacity: 1, y: 0, duration: 1.5, ease: 'power2.out'}, '-=1')

})

onUnmounted(() => {
  audio.value.pause()
  audio.value.currentTime = 0
})

</script>

<style scoped>
.background-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  cursor: crosshair;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: none;
  pointer-events: none;
}

.color-layer {
  z-index: 0;
}

.image-layer {
  background-image: url('/Logo.png');
  background-repeat: no-repeat;       
  background-position: center;
  background-size: auto;   
  
  opacity: 0;
  z-index: 1;
}

.content {
  position: relative;
  z-index: 2;
  
  
  
  height: 100%;
  
  
}
</style>
