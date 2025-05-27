<template>
  <div data-theme="synthwave" class="min-h-screen">
    <button @click="handleDeletion()" v-if="use_rooms.id == use_rooms.user_id">delete room</button>
    <div class="w-full flex justify-center relative">
      <!-- your button layout here -->
      <div class="flex flex-col items-center space-y-1 text-center">
        <!-- Row 1: 3 -->
        <!-- <div class="w-full flex justify-center"> -->
      </div>
      <div
        class="players flex justify-center absolute right-[5vw] top-[17vw] w-[40vw] h-[27vw] bg-blue-500"
      >
        <div class="absolute left-2 top-2 w-[5vw] h-[5vw] bg-red-500">
          <h1>Username: {{ use_profile.profile.username }}</h1>
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
</script>

<style scoped></style>
