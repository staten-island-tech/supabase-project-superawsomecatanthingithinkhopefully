<template>
    <div data-theme="synthwave" class="min-h-screen">
        <div class="static">
            <h2 v-if="!use_profile.profile">Loading...</h2>
            <div v-else>
                <div class="relative top-[2vw] left-[41vw]">
                    <img :src="picture" alt="profile_picture" class="rounded-full w-55 h-55" >
                </div>
                
                <div class="relative top-[5vw] left-[40vw] w-75 bg-purple-500 rounded-full flex justify-items-center">
                    <input v-model="urlInput" placeholder="Enter image URL" />
                    <button @click="updateProfilePicture">Update Picture</button>
                </div>
                

                <h2 >Username: {{ use_profile.profile.username }}</h2>
                <h2 >Wins: {{ use_profile.profile.wins }}</h2>
                <h2 >Losees: {{ use_profile.profile.losses }}</h2>
                
            </div>
            <h2 v-if="!auth">Loading...</h2>
            <div class="" v-else>
                <h2>Email: {{ auth.email }}</h2>
                <h2>Phone number: {{ auth.phone }}</h2>
            </div>
            <RouterLink to="/dash">Return Home</RouterLink>
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

</style>