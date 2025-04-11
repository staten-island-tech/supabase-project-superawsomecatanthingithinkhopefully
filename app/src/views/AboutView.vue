<template>
  <div></div>
  <form action="" class="form" @submit.prevent="submit()">
    <label for="username">Username:</label>
    <input type="text" class="username" placeholder="Input Username" />
    <label for="password">Password:</label>
    <input type="text" class="password" placeholder="Input Password" />
    <div>
      <button type="submit" class="btn">Log In</button>
    </div>
  </form>
</template>

<script setup></script>

<style lang="scss" scoped></style>
