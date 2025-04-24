<template>
  <!-- <h1 class="text-blue-600">Welcome to CONQUEST</h1>

    <form action="" class="form" @submit.prevent="submit()">
      <label for="username">Username:</label>
      <input type="text" class="username" placeholder="Input Username" />
      <label for="password">Password:</label>
      <input type="text" class="password" placeholder="Input Password" />
      <div>
        <button type="submit" class="btn">Log In</button>
      </div>
    </form> -->
  <RouterView />
  <ul>
    <li v-for="profiles in profiles" :key="profiles.id">{{ profiles.id }}</li>
  </ul>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabaseClient.ts'
interface profiles {
  // replace with the real stuff from instrumens table
  id: number
  name: string
  type: string
}

const profiles = ref<profiles[]>([])

async function getprofiles() {
  const { data, error } = await supabase.from('profiles').select('id')

  if (error) {
    console.error('Error fetching instruments:', error)
    return
  }

  if (data) {
    profiles.value = data || []
    console.log(data)
  }
}

onMounted(() => {
  getprofiles()
})
</script>

<style scoped></style>
