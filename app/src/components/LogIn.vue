<script setup lang="ts">
import { useSignupStore } from '@/stores/signup'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'


async function handleSignup() {
  
}
</script>

<template>
  <form @submit.prevent="handleSignup" class="flex flex-col gap-4 w-80 mx-auto">
    <input
      v-model="signupStore.username"
      type="text"
      placeholder="Username"
      class="border p-2 rounded"
    />
    <input
      v-model="signupStore.email"
      type="email"
      placeholder="Email"
      class="border p-2 rounded"
    />
    <input
      v-model="signupStore.password"
      type="password"
      placeholder="Password"
      class="border p-2 rounded"
    />
    <button type="submit" class="bg-blue-600 text-white py-2 rounded">
      Log In
    </button>
    <form action=""></form>
    
  </form>
</template>
