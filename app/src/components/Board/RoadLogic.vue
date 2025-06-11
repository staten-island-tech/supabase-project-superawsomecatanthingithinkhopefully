<template>
    <div>
       <button class="btn btn-circle" @click = "$emit('buildRoad')"></button>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['buildRoad'])
</script>

<style scoped>

</style>