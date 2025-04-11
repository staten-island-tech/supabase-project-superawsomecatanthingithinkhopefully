<template>
  <div>
    <h1 class="text-blue-600">Welcome to CONQUEST</h1>

    <form action="" class="form" @submit.prevent="submit()">
      <label for="username">Username:</label>
      <input type="text" class="username" placeholder="Input Username" />
      <label for="password">Password:</label>
      <input type="text" class="password" placeholder="Input Password" />
      <div>
        <button type="submit" class="btn">Log In</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { reactive } from 'vue'
function submit() {
  console.log('Mathias Papias')
}
</script>

<style scoped></style>
