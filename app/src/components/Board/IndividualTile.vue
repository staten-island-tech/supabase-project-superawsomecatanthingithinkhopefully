<template>
  <div
    :class="[
      'relative border-4 rounded-md shadow-lg w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40',
      tileColor.base,
      'pop-animation',
      'settled-settlement'
    ]"
  >
    <!-- Vertex buttons grid -->
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
      >
        yes
      </button>
    </div>

    <!-- Road buttons on edges -->
    <button
      v-for="(road, idx) in roadButtons"
      :key="'road-' + idx"
      class="road-btn"
      :class="road.position"
      @click="$emit('buildRoad',road),console.log(road)"
      :disabled="!isTurn"
    >
      buildr oad
    </button>

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
const emit = defineEmits(['buildRoad','settle'])
const props = defineProps<{
    tile: Tiles;
    isTurn: boolean;
}>();


const tileColor = computed(() => {
  const res = props.tile.resource;
  if (res === 'wood') {
    return { base: 'bg-green-600', hover: 'hover:bg-green-400' };
  } else if (res === 'brick') {
    return { base: 'bg-red-600', hover: 'hover:bg-red-400' };
  } else if (res === 'sheep') {
    return { base: 'bg-lime-400', hover: 'hover:bg-lime-200' };
  } else if (res === 'wheat') {
    return { base: 'bg-yellow-400', hover: 'hover:bg-yellow-200' };
  } else if (res === 'ore') {
    return { base: 'bg-gray-500', hover: 'hover:bg-gray-300' };
  } else if (res === 'desert') {
    return { base: 'bg-amber-300', hover: 'hover:bg-amber-100' };
  } else {
    return { base: 'bg-slate-400', hover: 'hover:bg-slate-200' };
  }
});

// Assuming tile.vertex is an array of 4 vertices in this order:
// 0 = top-left, 1 = top-right, 2 = bottom-left, 3 = bottom-right

const roadButtons = computed(() => {
  if (!props.tile.vertex || props.tile.vertex.length < 4) {
    // Defensive fallback — no vertices means no roads
    return [];
  }

  return [
    { position: 'road-top', from: props.tile.vertex[0], to: props.tile.vertex[1] },
    { position: 'road-right', from: props.tile.vertex[1], to: props.tile.vertex[3] },
    { position: 'road-bottom', from: props.tile.vertex[2], to: props.tile.vertex[3] },
    { position: 'road-left', from: props.tile.vertex[0], to: props.tile.vertex[2] },
  ];
});

</script>

<style scoped>
.road-btn {
  position: absolute;
  background-color: rgba(255 255 255 / 0.8);
  border: 2px solid #444;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease;
}

.road-btn:hover:not(:disabled) {
  background-color: #eee;
}

.road-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.road-top {
  top: -16px; /* Move up to overlap */
  left: 50%;
  transform: translateX(-50%);
}

.road-right {
  top: 50%;
  right: -16px; /* Move right to overlap */
  transform: translateY(-50%);
}

.road-bottom {
  bottom: -16px; /* Move down to overlap */
  left: 50%;
  transform: translateX(-50%);
}

.road-left {
  top: 50%;
  left: -16px; /* Move left to overlap */
  transform: translateY(-50%);
}

</style>
