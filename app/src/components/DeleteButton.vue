<template>
    <div v-if="isCreator">
        <button @click ="$emit('delete')">Delete Button</button>
        <button @click = "$emit('leave')"> Leave Room</button>
    </div>
    <div v-else>
        <button @click = "$emit('leave')">Leave Room</button>
    </div>
    <div class="dropdown">
    <div tabindex="0" class="btn m-1">
      {{ selected }}
    </div>
    <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow">
      <li @click="selectOption('Wood')"><a>Wood</a></li>
      <li @click="selectOption('Ore')"><a>Ore</a></li>
      <li @click="selectOption('Brick')"><a>Brick</a></li>
      <li @click="selectOption('Sheep')"><a>Sheep</a></li>
      <li @click="selectOption('Wheat')"><a>Wheat</a></li>
    </ul>
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