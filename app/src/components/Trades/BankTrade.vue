<template>
  <div class="space-y-6 max-w-md mx-auto p-4 bg-base-200 rounded-xl shadow-md">
    <div>
      <label class="block mb-2 text-lg font-semibold text-primary">
        Give 3 of a Resource to the Bank
      </label>
      <select 
        v-model="selectedBankResource"
        class="select select-bordered select-primary w-full"
      >
        <option disabled value="">Select a resource</option>
        <option>wood</option>
        <option>ore</option>
        <option>brick</option>
        <option>sheep</option>
        <option>wheat</option>
      </select>
    </div>
    <div>
      <label class="block mb-2 text-lg font-semibold text-secondary">
        Get 1 Resource in Return
      </label>
      <select
        v-model="desiredBankResource"
        class="select select-bordered select-secondary w-full"
      >
        <option disabled value="">Select a resource</option>
        <option>wood</option>
        <option>ore</option>
        <option>brick</option>
        <option>sheep</option>
        <option>wheat</option>
      </select>
    </div>

    <div class="mt-6 text-sm text-base-content/60">
      You are trading 
      <span class="font-bold">{{ selectedBankResource || '...' }}</span> 
      for 
      <span class="font-bold">{{ desiredBankResource || '...' }}</span>
    </div>

    <button 
      class="btn btn-accent"
      @click="$emit('trade',selectedBankResource,desiredBankResource)"
    >
      Confirm Trade
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedBankResource = ref('')
const desiredBankResource = ref('')


const emit = defineEmits(['trade'])
</script>
