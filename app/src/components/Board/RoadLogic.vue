<template>
    <div>
       <button class="btn btn-circle" @click = "$emit('buildRoad')"></button>
    </div>
    
</template>

<script setup lang="ts">
import { roads } from '@/vertex';

const emit = defineEmits(['buildRoad'])
</script>

<style scoped>

</style>