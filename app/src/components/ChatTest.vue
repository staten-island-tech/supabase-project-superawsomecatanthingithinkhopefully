<template>
    <div>

    </div>
</template>

<script setup lang="ts">
import { useSignupStore } from '@/stores/authuser'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
const myChannel = supabase.channel('test-channel')



myChannel
  .on(
    'broadcast',
    { event: 'INSERT' }, 
    (payload) => messageReceived(payload)
  )
  .subscribe()
</script>

<style scoped>

</style>