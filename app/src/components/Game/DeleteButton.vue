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
const props = defineProps<{
    isCreator:boolean
}>()
const emits = defineEmits(['leave','delete'])
</script>

<style scoped>

</style>