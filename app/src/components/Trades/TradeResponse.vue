<template>
    <div>
        <p>{{ user?.username }} is trying to offer you {{ recieve.quantity }} of {{ recieve.type }} for {{ give.quantity }} of {{ give.type }}</p>
    <button @click = "$emit('playerTrade',true)">Accept</button>
    <button @click = "$emit('playerTrade',false)">Deny</button>
    </div>
</template>

<script setup lang="ts">
import type { profileType } from '@/types/types';
import { ref } from 'vue';
console.log("IM IN THE COMP")
const props = defineProps<{
    user:profileType|null
    recieve: {quantity:number,type:string}
    give:{quantity:number,type:string}
}>()
const emit = defineEmits(['playerTrade'])
</script>

<style scoped>

</style>