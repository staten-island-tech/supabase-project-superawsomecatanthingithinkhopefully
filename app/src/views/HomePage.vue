<template>
  <!-- <div class="box gradient-green green"></div>
  <div class="box gradient-purple purple"></div>
  <div class="box gradient-blue blue"></div> -->
  <div class="static">

    <div class="logo absolute bottom-200 left-99">
      <h2>WELCOME</h2>
    </div>

    <div class="logo absolute bottom-200 left-99">
      <img src="/Logo.png" alt="Enhancing_Logo">
    </div>
    

  </div>
  
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { onMounted } from 'vue'
onMounted(() => {
  // target the element with a class of "green" - rotate and move TO 100px to the left over the course of 1 second.
  gsap.to('.green', { rotation: 360, x: 100, duration: 1 })

  // target the element with a class of "purple" - rotate and move FROM 100px to the left over the course of 1 second.
  gsap.from('.purple', { rotation: -360, x: -100, duration: 1 })

  // target the element with a class of "blue" - rotate and move FROM 100px to the left, TO 100px to the right over the course of 1 second.
  gsap.fromTo('.blue', { x: -100 }, { rotation: 360, x: 100, duration: 1 })
})
</script>

<style scoped></style>
