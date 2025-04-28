<script setup lang="ts">
import { useSignupStore } from '@/stores/signup'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
const signupStore = useSignupStore()
const router = useRouter()

async function handleSignup() {
  const result = await signupStore.signup()

  if (result.error) {
    console.error(result.error)
  } else {
    const { data, error: insertError } = await supabase
      .from('profiles')
      .insert([{ id: result.data.user?.id, username: signupStore.username }])

    
  }
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
      Sign Up
    </button>
    <form action=""></form>
    <div v-if="signupStore.error" class="text-red-500">
      {{ signupStore.error }}
    </div>
  </form>
</template>
