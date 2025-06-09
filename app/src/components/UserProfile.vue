<template>
    <div>
        
        <h2 v-if="!use_profile.profile">Loading...</h2>
        <div class="" v-else>
            <h2 >Username: {{ use_profile.profile.username }}</h2>
            <h2 >Wins: {{ use_profile.profile.wins }}</h2>
            <h2 >Losees: {{ use_profile.profile.losses }}</h2>
            
        </div>
        <h2 v-if="!auth">Loading...</h2>
        <div class="" v-else>
            <h2>Email: {{ auth.email }}</h2>
            <h2>Phone number: {{ auth.phone }}</h2>
        </div>
        
        

    </div>
</template>

<script setup lang="ts">
import { profileStore } from '@/stores/profile';
import { type profileType } from '@/types/types';
import { onMounted, ref } from 'vue';
import { type User } from '@supabase/supabase-js';
const use_profile = profileStore()
const auth = ref<User|null>(null)
onMounted(async()=>{
    const result = await use_profile.fetchUserProfile()
    auth.value = result.user
})
</script>

<style scoped>

</style>