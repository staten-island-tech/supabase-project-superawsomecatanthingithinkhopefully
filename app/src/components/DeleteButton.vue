<template>
    <div v-if="isCreator">
        <button @click ="$emit('delete')">Delete Button</button>
        <button @click = "$emit('leave')"> Leave Room</button>
    </div>
    <div v-else>
        <button @click = "$emit('leave')">Leave Room</button>
    </div>
    
</template>

<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps<{
    isCreator:boolean
}>()
const emits = defineEmits(['leave','delete'])
const selected = ref('Select a resource')

function selectOption(option:string) {
  selected.value = option
}
</script>

<style scoped>

</style>