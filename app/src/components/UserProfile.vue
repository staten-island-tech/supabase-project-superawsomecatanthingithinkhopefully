<template>
    <div data-theme="synthwave" class="min-h-screen">
        <div class="static">
            <h2 v-if="!use_profile.profile">Loading...</h2>
            <div v-else>
                <div class="relative top-[2vw] left-[41vw] w-60">
                    <img :src="picture" alt="profile_picture" class="rounded-full w-55 h-55" >
                </div>
                
                <div class="relative top-[5vw] left-[39vw] w-75 bg-purple-500  flex items-center justify-center w-20 h-10">
                    <input v-model="urlInput" placeholder="Enter image URL" />
                    <button @click="updateProfilePicture">Update Picture</button>
                </div>
                
                <div class="relative top-[10vw] left-[43vw] bg-purple-500 w-45 h-7 flex items-center justify-center rounded-full">
                  <h2>Username: {{ use_profile.profile.username }}</h2>
                </div>
                
                <div class="relative top-[12vw] left-[43vw] bg-purple-500 w-45 h-20 flex flex-col items-center justify-center rounded-full">
                  <h2 >Wins: {{ use_profile.profile.wins }}</h2>
                  <h2 >Losees: {{ use_profile.profile.losses }}</h2>
                </div>
                
                
            </div>
            
            <RouterLink to="/dash">
              <div class="flex items-center space-x-2">
                <button class="arrow-left"></button>
                <span class="text-white">Return Home</span>
              </div>
            </RouterLink>
        </div>

        
        

    </div>
</template>

<script setup lang="ts">
import { profileStore } from '@/stores/profile';
import { type profileType } from '@/types/types';
import { onMounted, ref } from 'vue';
import { type User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

const use_profile = profileStore()
const auth = ref<User|null>(null)
const picture = ref()
const urlInput = ref()

onMounted(async()=>{
    const result = await use_profile.fetchUserProfile()
    auth.value = result.user
    picture.value = use_profile.profile?.profile_pic
    
})
const updateProfilePicture = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .update({profile_pic: urlInput.value })
    .eq('id', use_profile.profile?.id )

  if (!error) {
    picture.value = urlInput.value
    console.log(picture.value)
    urlInput.value = ''
  } else {
    console.error('Error updating profile:', error)
  }
}
</script>

<style scoped>

.arrow-left {
  width: 0;
  height: 0;
  border-top: 1.5rem solid transparent;
  border-bottom: 1.5rem solid transparent;
  border-right: 2rem solid #4f46e5; /* Tailwind indigo-600 */
  cursor: pointer;
}
.arrow-left:hover {
  border-right-color: #4338ca; /* Tailwind indigo-700 */
}

</style>