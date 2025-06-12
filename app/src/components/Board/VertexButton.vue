<template>
   <div class="relative w-full h-full">
    <div
      v-for="row in 6"
      :key="`row-${row}`"
    >
      <div
        v-for="col in 6"
        :key="`vertex-${row - 1}-${col - 1}`"
        class="absolute bg-blue-500 rounded-full"
        :style="{
          width: '12px',
          height: '12px',
          left: `${(col - 1)}px`,
          top: `${(row - 1)}px`,
          transform: 'translate(-50%, -50%)',
        }"
        
      >
    <button :disabled="!isTurn" @click="$emit('settle', vertex) ">settle</button></div>
    </div></div>
  

</template>

<script setup lang="ts">
import {defineProps,defineEmits} from 'vue'
const props = defineProps<{
    vertex:Object,
    isTurn:boolean
}>()

const emit = defineEmits(['settle'])

console.log(1)
</script>

<style scoped>

</style>