<template>
    <div>
        <button @click="profile">748027</button>
    </div>
</template>

<script setup lang="ts">
import { profileStore } from '@/stores/profile';
const use_profile = profileStore()
async function profile(){
    const result = await use_profile.fetchUserProfile()

}
</script>

<style scoped>

</style>