<template>
  <div data-theme="synthwave" class="min-h-screen">
    <!-- Controls -->
    <div class="p-4 flex gap-4">
      <button @click="use_gameLogic.turnOrder()">123</button>
      <button v-if="use_rooms.id === use_rooms.user_id" @click="handleDeletion()">
        Delete Room
      </button>
    </div>

    <!-- Profile Section -->
    <h2 v-if="!use_profile.profile">Loading...</h2>
    <div v-else class="p-4">
      <h2>Username: {{ use_profile.profile.username }}</h2>
    </div>

    <!-- Game Board -->
    <div class="catan-board">
      <div
        v-for="(tile, i) in use_gameLogic.individualTiles || []"
        :key="i"
        :class="[
          'hexagon-container',
          `row-${tile.position?.row ?? 'fallback'}`,
          `col-${tile.position?.column ?? 'fallback'}`
        ]"
      >
        <div class="hexagon">
          <div class="hex-grid">
            <button
  v-for="(vertex, index) in tile.vertex"
  :key="index"
  class="vertex-btn"
  @click = gameLoop().addSettelement(vertex)

>
  settle
</button>

            <div />
            <div class="center">
              <p>{{ tile.resource }}, {{ tile.number }}</p>
            </div>
            <div />
            
            
          </div>
        </div>
      </div>
    </div>
    <p>{{ use_profile.gameProfile }}</p>
  </div>
</template>



<script setup lang="ts">
import { gameLoop } from '../stores/gameloop';
import { supabase } from '@/lib/supabaseClient';
import { rooms } from '@/stores/rooms';
import { profileStore } from '@/stores/profile';
import { gameLogic } from '@/stores/setup';
import { onMounted } from 'vue';
import { onBeforeRouteUpdate, useRoute,useRouter } from 'vue-router';
const router = useRoute()
const routers = useRouter()
const use_rooms = rooms()
const use_profile = profileStore()
const use_gameLogic = gameLogic()

async function handleDeletion(){




  await use_rooms.deleteRoom(use_gameLogic.route_id)


  routers.push({path:"/dash"})
}

onMounted(async()=>{

  await use_gameLogic.updateRoute()

  await use_profile.fetchUserProfile()
  await use_profile.getGameProfile()

})
</script>

<style scoped>
.catan-board {
  display: grid;
  grid-template-columns: repeat(7, 120px);
  grid-template-rows: repeat(5, 104px);
  justify-content: center;
  margin: 1.25rem auto;
  gap: 0;
}

.hexagon-container {
  width: 120px;
  height: 104px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hexagon {
  width: 100%;
  height: 100%;
  clip-path: polygon(-50% 50%, 50% 100%, 150% 50%, 50% 0);
  background: #3b8686;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  /* padding: 6px; */
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.hexagon:hover {
  transform: scale(1.02);
}

.hex-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  /* gap: 4px; */
  width: 100%;
  height: 100%;
}

.vertex-btn {
  background: #f0f0f0;
  border: 1px solid #333;
  border-radius: 50%;
  width: 80%;
  height: 80%;
  transition: background 0.2s;
}

.vertex-btn:hover {
  background: #ddd;
}

.center {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  font-weight: bold;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

/* Grid positioning */
.row-1 { grid-row: 1; }
.row-2 { grid-row: 2; }
.row-3 { grid-row: 3; }
.row-4 { grid-row: 4; }
.row-5 { grid-row: 5; }

.col-1 { grid-column: 1; }
.col-2 { grid-column: 2; }
.col-3 { grid-column: 3; }
.col-4 { grid-column: 4; }
.col-5 { grid-column: 5; }
.col-6 { grid-column: 6; }
.col-7 { grid-column: 7; }

.row-fallback,
.col-fallback {
  display: none;
}

/* Offsetting to simulate staggered board */
.row-1, .row-5 { margin-left: 100px; }
.row-2, .row-4 { margin-left: 60px; }


</style>

