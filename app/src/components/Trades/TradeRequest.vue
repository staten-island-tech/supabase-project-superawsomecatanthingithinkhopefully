<template>
   <div class="space-y-6 max-w-md mx-auto p-4 bg-base-200 rounded-xl shadow-md">
    <div>
      <label class="block mb-2 text-lg font-semibold text-primary">
        Initiate Player Trade
      </label>
      <select 
        v-model="selectedPlayerResource"
        class="select select-bordered select-primary w-full"
      >
        <option disabled value="">Select a resource</option>
        <option>wood</option>
        <option>ore</option>
        <option>brick</option>
        <option>sheep</option>
        <option>wheat</option>
      </select>
      <input
          type="number"
          v-model.number="selectedPlayerQuantity"
          min="1"
          class="input input-bordered w-20"
        />
    </div>
    <div>
      <label class="block mb-2 text-lg font-semibold text-secondary">
        Recieve Resource
      </label>
      <select
        v-model="desiredPlayerResource"
        class="select select-bordered select-secondary w-full"
      >
        <option disabled value="">Select a resource</option>
        <option>wood</option>
        <option>ore</option>
        <option>brick</option>
        <option>sheep</option>
        <option>wheat</option>
      </select>
      <input
          type="number"
          v-model.number="desiredPlayerQuantity"
          min="1"
          class="input input-bordered w-20"
        />
    </div>

    <div class="mt-6 text-sm text-base-content/60">
      You are trading 
      <span class="font-bold">{{selectedPlayerQuantity}} {{ selectedPlayerResource || '...' }}</span> 
      for 
      <span class="font-bold">{{desiredPlayerQuantity}} {{ desiredPlayerResource || '...' }}</span>
    </div>
    
    <button 
      class="btn btn-accent"
      @click="$emit('playerTrade',selectedPlayerResource,selectedPlayerQuantity,desiredPlayerResource,desiredPlayerQuantity)"
    >
      Confirm Trade
    </button>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
const selectedPlayerResource = ref<string>('')
const selectedPlayerQuantity = ref<number>(0)
const desiredPlayerResource = ref<string>('')
const desiredPlayerQuantity = ref<number>(0)

const emit = defineEmits(['playerTrade'])
</script>

<style scoped>

</style>