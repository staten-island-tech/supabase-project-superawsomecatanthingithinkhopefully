<template>
    <div>
        <TotalBoard :isTurn="myTurn" v-if="loading === true"/>
        <div v-else>
            <p>im loading gimme a sec</p>
        </div>
        <DeleteButton v-if="isCreator!=null":isCreator="isCreator"  @delete="handleDelete"/>
    
        <button @click ="game.turnOrder(id)">if your happy</button>
    </div>
    <p v-if="game.current_player!==use_profile.profile?.id">hey its not</p>
</template>

<script setup lang="ts">
const use_rooms = rooms()
import DeleteButton from '@/components/DeleteButton.vue';
import TotalBoard from '@/components/Board/TotalBoard.vue';
import { rooms } from '@/stores/rooms';
import { onMounted,ref,computed } from 'vue';
import { profileStore } from '@/stores/profile';
import { useRoute,useRouter } from 'vue-router';
import { gameLogic } from '@/stores/setup';
import { gameLoop } from '@/stores/gameloop';
const game = gameLogic()
const use_profile=profileStore()
const loading = ref<boolean>(false)
const isCreator = ref<boolean|null>(null)
const id = ref<string>('')
const router=useRouter()
onMounted(async()=>{

    id.value = useRoute().params.gameid as string
    await game.updateRoute(id.value)
    await use_profile.fetchUserProfile()
    await use_profile.getGameProfile(id.value)
    await game.determineTurn(id.value)
    
    isCreator.value = await rooms().fetchRoomCreator(id.value,use_profile.profile?.id)
    console.log("this is gam baord")
console.log(use_profile.profile?.id === game.current_player)
    loading.value = true
})


const myTurn = computed(()=>{
    return use_profile.profile?.id === game.current_player
})
async function handleDelete(){
    await rooms().deleteRoom(id.value)
    router.push('/dash')
}
</script>

<style scoped>

</style>