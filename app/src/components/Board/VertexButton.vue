<template>
  <button :disabled="!isTurn" @click="$emit('settle', vertex) ">settle</button>
</template>

<script setup lang="ts">
import {defineProps,defineEmits} from 'vue'
const props = defineProps<{
    vertex:Object,
    isTurn:boolean
}>()

const emit = defineEmits(['settle'])


</script>

<style scoped>

</style>