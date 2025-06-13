<template>
  <div
    :class="[
      'relative border-4 rounded-md shadow-lg w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40',
      tileColor.base,
      'pop-animation',
      'settled-settlement'
    ]"
  >
    <div class="grid grid-cols-2 grid-rows-2 w-full h-full gap-1 p-2">
      
      <div v-for="(vertex, index) in tile.vertex" :key="index">
        <div v-if="settlementsAtVertices?.[index].hasSettlement && !settlementsAtVertices[index].isCity">
          <button @click="$emit('settle', vertex)"><img :src="`/${settlementsAtVertices[index]?.color}_Settlement.png`" alt="settlement" @error="console.error(`Image failed to load: /${settlementsAtVertices[index]?.color}_Settlement.png`)"></button>

        </div>
        
        <div v-else-if="settlementsAtVertices?.[index].hasSettlement && settlementsAtVertices[index].isCity">
          <img :src="`/${settlementsAtVertices[index]?.color}_castle.png`" alt="city">
        </div>

        <div v-else>
          <button
            @click="$emit('settle', vertex)"
            :disabled="!isTurn"
            class="w-full h-full rounded-lg transition-all duration-300"
            :class="[tileColor.base, tileColor.hover, 'disabled:opacity-50 hover:scale-105']"
          >
            Build
          </button>
        </div>
      </div>
    </div>

    <div v-for="(road, idx) in roadStates" :key="'road-' + idx">
      <div v-if="road.isBuilt">
        <div
          class="absolute w-6 h-1 rounded-full"
          :class="[road.position, road.color]"
        >
          <div class=" w-20 h-4 z-30" :class="['road-text', road.color]" ></div>
        </div>
      </div>

      <button
        v-else
        class="road-btn"
        :class="road.position"
        @click="$emit('buildRoad', road)"
        :disabled="!isTurn"
      >
        Build road
      </button>
    </div>
  </div>
</template>





<script setup lang="ts">
import VertexButton from "@/components/Board/VertexButton.vue"
import type { playerRoad, road, Settlement, Tiles, Vertices,Vertex } from '@/types/types';
import { computed } from 'vue';
const emit = defineEmits(['buildRoad','settle'])
const props = defineProps<{
    tile: Tiles;
    isTurn: boolean;
    builtRoads:playerRoad[]
    settlements:Settlement[]
}>();


const tailwindRoadColor = {
    red: 'bg-red-700',
    blue: 'bg-blue-700',
    green: 'bg-green-700',
    yellow: 'bg-yellow-400',
    purple: 'bg-purple-700',
    black: 'bg-zinc-800',
  };






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



const roadButtons = computed(() => {
  if (!props.tile.vertex) {
    return [];
  }

  return [
    { position: 'road-top', from: props.tile.vertex[0], to: props.tile.vertex[1] },
    { position: 'road-right', from: props.tile.vertex[1], to: props.tile.vertex[3] },
    { position: 'road-bottom', from: props.tile.vertex[2], to: props.tile.vertex[3] },
    { position: 'road-left', from: props.tile.vertex[0], to: props.tile.vertex[2] },
  ];
});
const roadStates = computed(() => {
  return roadButtons.value.map(road => {
    let isBuilt = false;   
    let roadColor = 'bg-gray-400';  

    
    for (let i = 0; i < props.builtRoads.length; i++) {
      const existingRoad = props.builtRoads[i];

      if (existingRoad.from.row === road.from.row && existingRoad.from.column === road.from.column &&
          existingRoad.to.row === road.to.row && existingRoad.to.column === road.to.column) {
        
        isBuilt = true;  
        roadColor = existingRoad.color;  
        roadColor = tailwindRoadColor[existingRoad.color] || 'bg-gray-400';
        break;  
      }
    }

    
    return {
      from: road.from,
      to: road.to,
      position: road.position,
      isBuilt: isBuilt,
      color: roadColor
    };
  });
});


const settlementsAtVertices = computed(() => {
  const result = [];  

  if (props.tile.vertex) {
    for (let i = 0; i < props.tile.vertex.length; i++) {
      const vertex = props.tile.vertex[i];

      let settlement = null;

      for (let j = 0; j < props.settlements.length; j++) {
        const existingSettlement = props.settlements[j];
        
        if (existingSettlement.row === vertex?.row && existingSettlement?.column === vertex?.column) {
          settlement = existingSettlement; 
          break; 
        }
      }
      result.push({
        vertex,
        hasSettlement: !!settlement, 
        isCity: settlement?.is_city || false ,
        color: settlement?.color,
        
      });
    }
  }

  return result;  
  
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

.road-top,
.road-bottom,
.road-left,
.road-right {
  position: absolute;
  width: 40px;
  height: 6px;
  border-radius: 9999px;
  transform-origin: center;
}

/* Specific orientations */
.road-top {
  top: -10px;
  left: 50%;
  transform: translateX(-50%) rotate(0deg);
}

.road-right {
  right: -10px;
  top: 50%;
  transform: translateY(-50%) rotate(90deg);
}

.road-bottom {
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%) rotate(0deg);
}

.road-left {
  left: -10px;
  top: 50%;
  transform: translateY(-50%) rotate(90deg);
}

</style>
