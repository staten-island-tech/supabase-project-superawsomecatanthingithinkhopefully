<template>
  <div data-theme="synthwave" class="min-h-screen">
    <button @click="handleDeletion()" v-if="use_rooms.id == use_rooms.user_id">delete room</button>
    <div class="w-full flex justify-center relative">
      <!-- your button layout here -->
      <div class="flex items-center space-y-1 text-center">
        <!-- Row 1: 3 -->
        <!-- <div class="w-full flex justify-center"> -->
      </div>

      <div class="absolute right-[5vw] top[3vw] w-[40vw] h-[15vw] glass">
        <h1 class="underline text-center font-bold">Room Settings</h1>
      </div>

      <div class="absolute right-[5vw] top-[17vw] w-[40vw] h-[27vw]">
        <details class="dropdown absolute top-0 left-0">
          <summary class="btn m-1 bg-purple-950">Choose your color</summary>
          <ul class="menu dropdown-content bg-purple-900 rounded-box z-1 w-52 p-2 shadow-sm">
            <li @click="pickcolor('red')"><a class="bg-red-500">Red</a></li>

            <li @click="pickcolor('blue')"><a class="bg-blue-500">Blue</a></li>

            <li @click="pickcolor('green')"><a class="bg-green-500">Green</a></li>

            <li @click="pickcolor('yellow')"><a class="bg-yellow-500">Yellow</a></li>

            <li @click="pickcolor('purple')"><a class="bg-purple-500">Purple</a></li>

            <li @click="pickcolor('black')"><a class="bg-zinc-500">Black</a></li>
          </ul>
        </details>
        <div
          class="flex items-center absolute left-0 top-[10vw] w-[18vw] h-[8vw] rounded-full"
          :class="ShutupEyad"
        >
          <div class="w-[5vw] rounded-full">
            <img class="rounded-full" src="/profile_temp.jpg" alt="profile_pic" />
          </div>
          <h2 v-if="!gameStore.room_host">Loading...</h2>
          <h1 class="truncate text-3xl color-white-500" v-else>
            {{ host_username }}
          </h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient'
import { rooms } from '@/stores/rooms'
import { isConstructorDeclaration } from 'typescript'
import { useRoute, useRouter } from 'vue-router'
import { profileStore } from '@/stores/profile'
import UserProfile from '@/components/UserProfile.vue'
import { PostgrestError, type User } from '@supabase/supabase-js'
import { ref, reactive } from 'vue'
import { onMounted } from 'vue'
import { stringify } from 'querystring'
import { type Hosttype } from '@/types/types'
import { gamers } from '@/stores/gamer'
import { gameLogic } from '@/stores/setup'
// Eyad made a low taper fade meme reference just nuke his HOS

const router = useRoute()
const routers = useRouter()
const gameStore = gamers()
const use_rooms = rooms()
const room_id = router.params.gameid as string

const host_username = ref()

async function handleDeletion() {
  console.log(room_id)
  await use_rooms.deleteRoom(room_id)

  routers.push({ path: '/dash' })
}
const use_profile = profileStore()
const auth = ref<User | null>(null)
onMounted(async () => {
  const result = await use_profile.fetchUserProfile()
  auth.value = result.user
  console.log(result)
  console.log(auth.value)

  const host = await gameStore.get_host()
  console.log(host?.value)
  host_username.value = host

  const { data, error } = await supabase.from('game_players').insert({ game_id: room_id }).select()
  console.log(data)

  //console.log(room_host.value)

  // add user id to gplayers id if the user id does not equal host id

  // let room_link = ref<string>('')
  // const user_id = ref<string>('')

  // const {data:{user}, error:authError} = await supabase.auth.getUser()

  // if (authError||!user){
  //   // console.log(authError,user)
  //   return null;
  // }

  // else{user_id.value = user?.id
  //   console.log("user id",user_id.value)}

  // const {data, error}:{data:Datatype[]|null, error:PostgrestError|null} = await supabase.from('game').select('user_id, id').eq('user_id',user_id.value)

  // if(data){
  //   console.log("da data", data[0])
  //   room_link.value = data[0].id
  //   console.log(room_link.value)
  // }
})

let purple = ref<boolean>(true)
let currentcolor = ref(purple)
let red = ref<boolean>(false)
let blue = ref<boolean>(false)
let green = ref<boolean>(false)
let yellow = ref<boolean>(false)
let black = ref<boolean>(false)

const ShutupEyad = reactive({
  active: true,
  'text-danger': true,
  'bg-linear-to-bl from-violet-500 to-fuchsia-500': purple,
  'bg-linear-to-bl from-red-600 to-red-900': red,
  'bg-linear-to-bl from-sky-600 to-blue-900': blue,
  'bg-linear-to-bl from-green-600 to-green-800': green,
  'bg-linear-to-bl from-amber-300 to-amber-500': yellow,
  'bg-linear-to-bl from-zinc-500 to-zinc-800': black,
})

function pickcolor(color: string) {
  if (color === 'red') {
    currentcolor.value = false
    red.value = true
    currentcolor = red
  }
  if (color === 'purple') {
    currentcolor.value = false
    purple.value = true
    currentcolor = purple
  }
  if (color === 'blue') {
    currentcolor.value = false
    blue.value = true
    currentcolor = blue
  }
  if (color === 'green') {
    currentcolor.value = false
    green.value = true
    currentcolor = green
  }
  if (color === 'yellow') {
    currentcolor.value = false
    yellow.value = true
    currentcolor = yellow
  }
  if (color === 'black') {
    currentcolor.value = false
    black.value = true
    currentcolor = black
  }
}

const use_gameLogic = gameLogic()
</script>

<style scoped>
.catan-board {
  display: grid;
  grid-template-columns: repeat(7, 120px);
  grid-template-rows: repeat(5, 104px);
  justify-content: center;
  margin: 1.25rem auto;
  gap: 0;
}

.hexagon-container {
  width: 120px;
  height: 104px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hexagon {
  width: 100%;
  height: 100%;
  clip-path: polygon(-50% 50%, 50% 100%, 150% 50%, 50% 0);
  background: #3b8686;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);

  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.hexagon:hover {
  transform: scale(1.02);
}

.hex-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  width: 100%;
  height: 100%;
}

.vertex-btn {
  background: #f0f0f0;
  border: 1px solid #333;
  border-radius: 50%;
  width: 80%;
  height: 80%;
  transition: background 0.2s;
}

.vertex-btn:hover {
  background: #ddd;
}

.center {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  font-weight: bold;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.row-1 {
  grid-row: 1;
}
.row-2 {
  grid-row: 2;
}
.row-3 {
  grid-row: 3;
}
.row-4 {
  grid-row: 4;
}
.row-5 {
  grid-row: 5;
}

.col-1 {
  grid-column: 1;
}
.col-2 {
  grid-column: 2;
}
.col-3 {
  grid-column: 3;
}
.col-4 {
  grid-column: 4;
}
.col-5 {
  grid-column: 5;
}
.col-6 {
  grid-column: 6;
}
.col-7 {
  grid-column: 7;
}

.row-fallback,
.col-fallback {
  display: none;
}

.row-1,
.row-5 {
  margin-left: 100px;
}
.row-2,
.row-4 {
  margin-left: 60px;
}
</style>
