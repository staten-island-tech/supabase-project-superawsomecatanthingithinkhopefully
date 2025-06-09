<template>
  <div >
    <div >
      <div >
        <VertexButton
          v-for="(vertex, index) in tile.vertex"
          :key="index"
          :vertex="vertex"
          @settle="$emit('settle', vertex)"
        />
        
        <div >
          <p>{{ tile.resource }} --- {{ tile.number }}</p>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VertexButton from "@/components/Game/VertexButton.vue"
import type { Tiles, Vertices } from '@/types/types';
import { defineProps } from 'vue';
const props = defineProps<{
    tile:Tiles
    
}>()
console.log(3)
</script>

<style scoped>

</style>