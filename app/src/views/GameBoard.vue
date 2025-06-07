<template>
    <div>
        <TotalBoard v-if="loading === true"/>
        <div v-else>
            <p>im loading gimme a sec</p>
        </div>
        <DeleteButton v-if="isCreator!=null":isCreator="isCreator"  @delete="handleDelete"/>
    </div>
</template>

<script setup lang="ts">
const use_rooms = rooms()
import DeleteButton from '@/components/Game/DeleteButton.vue';
import TotalBoard from '@/components/Game/TotalBoard.vue';
import { rooms } from '@/stores/rooms';
import { onMounted,ref } from 'vue';
import { profileStore } from '@/stores/profile';
import { useRoute,useRouter } from 'vue-router';
import { gameLogic } from '@/stores/setup';
const game = gameLogic()
const use_profile=profileStore()
const loading = ref<boolean>(false)
const isCreator = ref<boolean|null>(null)
const id = ref<string>('')
const router=useRouter()
onMounted(async()=>{

    id.value = useRoute().params.gameid as string
    console.log("ts is the id",id)
    await game.updateRoute(id.value)
    await use_profile.fetchUserProfile()
    await use_profile.getGameProfile(id.value)
    isCreator.value = await rooms().fetchRoomCreator(id.value,use_profile.profile?.id)
    await game.turnOrder()
    loading.value = true
})
async function handleDelete(){
    await rooms().deleteRoom(id.value)
    router.push('/dash')
}
</script>

<style scoped>

</style>