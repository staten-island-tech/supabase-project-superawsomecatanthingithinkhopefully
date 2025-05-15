<template>
  <div data-theme="synthwave" class="min-h-screen">
    <p>YOU DID IT! {{ router.params.gameid }}</p>
    <button @click="handleDeletion()">delete room</button>
  </div>
</template>

<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient';
import { rooms } from '@/stores/rooms';
import { useRoute,useRouter } from 'vue-router';
const router = useRoute()
const routers = useRouter()
const use_rooms = rooms()
async function handleDeletion(){
  console.log(1)
  const route_id = router.params.gameid as string
  const leave = await use_rooms.deleteRoom(route_id)
  
  routers.push({path:"/dash"})
  
}
</script>

<style scoped></style>
