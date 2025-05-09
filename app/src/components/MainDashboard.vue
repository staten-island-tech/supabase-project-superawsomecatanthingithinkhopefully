<template>
    <div>
      <button>Join a game</button>
      <button @click="" class="flex justify-center">Create a room</button>
    </div>
</template>

<script setup lang="ts">
import { useSignupStore } from '@/stores/authuser'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
const messageChannel = supabase.channel('message-channel')




</script>

<style scoped>

</style>