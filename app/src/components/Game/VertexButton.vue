<template>
  <button  @click="$emit('settle', vertex) ">settle</button>
  <h2>{{ console.log(vertex) }}</h2>
</template>

<script setup lang="ts">
import {defineProps,defineEmits} from 'vue'
const props = defineProps({
    vertex:Object
})

const emit = defineEmits(['settle'])

console.log("GOod job for rendering")
</script>

<style scoped>

</style>