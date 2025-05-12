<template>
    <div>
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
    </div>
</template>

<script setup lang="ts">
import { useSignupStore } from '@/stores/authuser'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
import { rooms } from '@/stores/rooms'
import routers from '@/router'
const use_rooms = rooms()
const router = useRouter()
async function handleRoom(){
  const result = await use_rooms.makeRoom()
  console.log(use_rooms.number_player)
  if(result){
    router.push({path:`/${result['id']}`})
  }
  
}


</script>

<style scoped>

</style>