<template>
  <div
    :class="[
      'relative border-4 rounded-md shadow-lg w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40',
      tileColor.base,
      'pop-animation',
      'settled-settlement'
    ]"
  >
    <!-- 2x2 grid for vertex buttons -->
    <div class="grid grid-cols-2 grid-rows-2 w-full h-full gap-1 p-2">
      <button
        v-for="(vertex, index) in tile.vertex"
        :key="index"
        @click="$emit('settle', vertex)"
        :disabled="!isTurn"
        :class="[
          'w-full h-full rounded-lg transition-all duration-300',
          tileColor.base,
          tileColor.hover,
          'disabled:opacity-50 hover:scale-105',
          'pop-animation',
          'settled-settlement'
        ]"
      />
    </div>
    

    <!-- Center text showing resource info -->
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none px-1">
      <span class="font-semibold text-xs sm:text-sm text-center text-white drop-shadow-lg truncate">
        {{ tile.resource }} — {{ tile.number }}
      </span>
    </div>
  </div>
</template>



<script setup lang="ts">
import VertexButton from "@/components/Board/VertexButton.vue"
import type { Tiles, Vertices } from '@/types/types';
import { computed } from 'vue';

const props = defineProps<{
    tile: Tiles;
    isTurn: boolean;
}>();

const tileColor = computed(() => {
  switch (props.tile.resource) {
    case 'wood':
      return { base: 'bg-green-600', hover: 'hover:bg-green-400' };
    case 'brick':
      return { base: 'bg-red-600', hover: 'hover:bg-red-400' };
    case 'sheep':
      return { base: 'bg-lime-400', hover: 'hover:bg-lime-200' };
    case 'wheat':
      return { base: 'bg-yellow-400', hover: 'hover:bg-yellow-200' };
    case 'ore':
      return { base: 'bg-gray-500', hover: 'hover:bg-gray-300' };
    case 'desert':
      return { base: 'bg-amber-300', hover: 'hover:bg-amber-100' };
    default:
      return { base: 'bg-slate-400', hover: 'hover:bg-slate-200' };
  }
});
</script>

<style scoped>

</style>