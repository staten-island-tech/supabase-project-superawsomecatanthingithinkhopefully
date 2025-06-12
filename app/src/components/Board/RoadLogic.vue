<template>
    
    <div class="flex items-center justify-center min-h-screen">
        <div class="grid grid-cols-5 max-w-3xl">
            <button class="btn btn-circle bg-purple-700" 
            
            @click="$emit('buildRoad')">
            </button>
        </div>
            
            
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['buildRoad'])
</script>

<style scoped>

</style>