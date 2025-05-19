<template>
  <div data-theme="synthwave" class="min-h-screen">
    
    <button @click="handleDeletion()" v-if="use_rooms.id == use_rooms.user_id">delete room</button>
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
 
    const route_id = router.params.gameid as string
    const leave = await use_rooms.deleteRoom(route_id)
  
  
  
  routers.push({path:"/dash"})
  
}
</script>

<style  scoped>

</style>
