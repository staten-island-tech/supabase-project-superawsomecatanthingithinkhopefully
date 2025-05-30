<template>
  <div data-theme="synthwave" class="min-h-screen">
    <button @click="handleDeletion()" v-if="use_rooms.id == use_rooms.user_id">delete room</button>
    <div class="w-full flex justify-center relative">
      <!-- your button layout here -->
      <div class="flex items-center space-y-1 text-center">
        <!-- Row 1: 3 -->
        <!-- <div class="w-full flex justify-center"> -->
      </div>

      <div class="absolute right-[5vw] top-[17vw] w-[40vw] h-[27vw]">
        <details class="dropdown absolute top-0 left-0">
          <summary class="btn m-1 bg-purple-950">Choose your color</summary>
          <ul class="menu dropdown-content bg-purple-900 rounded-box z-1 w-52 p-2 shadow-sm">
            <li @click="pickcolor('red')"><a class="bg-red-500">Red</a></li>
            <li @click="pickcolor('purple')"><a class="bg-blue-500">Blue</a></li>
            <li><a class="bg-green-500">Green</a></li>
            <li><a class="bg-yellow-500">Yellow</a></li>
            <li><a class="bg-purple-500">Purple</a></li>
            <li><a class="bg-zinc-500">Black</a></li>
          </ul>
        </details>
        <div
          class="flex items-center absolute left-0 top-[10vw] w-[18vw] h-[8vw] rounded-full"
          :class="ShutupEyad"
        >
          <div class="w-[5vw] rounded-full">
            <img class="rounded-full" src="/profile_temp.jpg" alt="profile_pic" />
          </div>
          <h2 v-if="!use_profile.profile">Loading...</h2>
          <h1 class="truncate text-3xl color-white-500" v-else>
            {{ use_profile.profile.username }}
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
import { type User } from '@supabase/supabase-js'
import { ref, reactive } from 'vue'
import { onMounted } from 'vue'

// Eyad made a low taper fade meme reference just nuke his HOS

const router = useRoute()
const routers = useRouter()
const use_rooms = rooms()
async function handleDeletion() {
  const route_id = router.params.gameid as string
  console.log(route_id)
  await use_rooms.deleteRoom(route_id)

  routers.push({ path: '/dash' })
}
const use_profile = profileStore()
const auth = ref<User | null>(null)
onMounted(async () => {
  const result = await use_profile.fetchUserProfile()
  auth.value = result.user
  console.log(result)
  console.log(auth.value)
})

let purple = ref<boolean>(true)
let currentcolor = ref(purple)
let red = ref<boolean>(false)

const ShutupEyad = reactive({
  active: true,
  'text-danger': true,
  'bg-linear-to-bl from-violet-500 to-fuchsia-500': purple,
  'bg-linear-to-bl from-red-600 to-red-900': red,
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
}
</script>

<style scoped></style>
