<template>
  <div data-theme="synthwave" class="min-h-screen">
    <div v-if="use_rooms.isCreator != true">
       <p>3</p>
       <p>{{ use_rooms.user_id }}</p>
       <p>{{use_rooms.id}}</p>
    </div>
    <div v-else>
      
      <p>{{ use_rooms.id }}</p>
      <p>{{ use_rooms.user_id }}</p>
      <button @click="handleDeletion()" v-if="use_rooms.id == use_rooms.user_id">delete room</button>
    </div>

    <h2 v-if="!use_profile.profile">Loading...</h2>
        <div class="" v-else>
            <h2 >Username: {{ use_profile.profile.username }}</h2>

        </div>
    

    
    <div class="w-full flex justify-center">
    <!-- your button layout here --><div class="flex flex-col items-center space-y-1 text-center">
  <!-- Row 1: 3 -->
  <div class="w-full flex justify-center">
  <div class="scale-125">
    <div class="flex flex-col items-center space-y-1 text-center">
      <!-- Row 1: 3 -->
      <div class="flex space-x-15 mt-8 ml-12">
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
      </div>

      <!-- Row 2: 4 -->
      <div class="flex space-x-15 mt-1 ml-10">
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
      </div>

      <!-- Row 3: 5 -->
      <div class="flex space-x-15 mt-1 ml-8">
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
      </div>

      <!-- Row 4: 6 -->
      <div class="flex space-x-15 mt-1 ml-6">
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
      </div>

      <!-- Row 5: 7 (center) -->
      <div class="flex space-x-15 mt-1 ml-4">
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
      </div>

      <!-- Row 6: 6 -->
      <div class="flex space-x-15 mt-1 ml-6">
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
      </div>

      <!-- Row 7: 5 -->
      <div class="flex space-x-15 mt-1 ml-8">
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
      </div>

      <!-- Row 8: 4 -->
      <div class="flex space-x-15 mt-1 ml-10">
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
      </div>

      <!-- Row 9: 3 -->
      <div class="flex space-x-15 mt-1 mb-8 ml-12">
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
        <button class="w-10 h-10 bg-gray-300"></button>
      </div>
    </div>
  </div>
</div>
</div>
</div>


  </div>
</template>


<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient';
import { rooms } from '@/stores/rooms';
import { profileStore } from '@/stores/profile';
import { onMounted } from 'vue';
import { useRoute,useRouter } from 'vue-router';
const router = useRoute()
const routers = useRouter()
const use_rooms = rooms()
const use_profile = profileStore()
async function handleDeletion(){
  
  
  const route_id = router.params.gameid as string
  console.log(route_id)
  await use_rooms.deleteRoom(route_id)

  
  routers.push({path:"/dash"})
}

onMounted(async()=>{
    const result = await use_profile.fetchUserProfile()
    
})
</script>

<style  scoped>

</style>
