<template>
    <BankTrade @trade = "handleBankTrade"/>
    <TradeRequest @playerTrade = "handlePlayerTrade"/>
    <TradeResponse
  v-for="(trade, index) in trades"
  :key="index"
  :recieve="{ quantity: trade.recieve_quant, type: trade.recieve_type }"
  :give="{ quantity: trade.init_quant, type: trade.init_type }"
  :user="findProfileById(trade.init_id)"
  @playerTrade="handlePlayerResponse(trade)"
/>
  <RoadLogic
  v-for="road in roads"
  @buildRoad="buildRoad(road)"
  />

    <div >
        {{ players }}
    </div>
    <div>
        <TotalBoard :isTurn="myTurn" v-if="loading === true"/>
        <div v-else>
            <p>im loading gimme a sec</p>
        </div>
        <DeleteButton v-if="isCreator!=null":isCreator="isCreator"  @delete="handleDelete"/>
    
        <button @click ="game.turnOrder(id)">if your happy</button>
    </div>
    
    <p v-if="game.current_player==use_profile.profile?.id">end turn</p>

</template>

<script setup lang="ts">
const use_rooms = rooms()
import BankTrade from '@/components/Trades/BankTrade.vue';
import DeleteButton from '@/components/DeleteButton.vue';
import TotalBoard from '@/components/Board/TotalBoard.vue';
import { rooms } from '@/stores/rooms';
import { supabase } from '@/lib/supabaseClient'
import { onMounted,ref,computed } from 'vue';
import { profileStore } from '@/stores/profile';
import { useRoute,useRouter } from 'vue-router';
import { gameLogic } from '@/stores/setup';
import { gameLoop } from '@/stores/gameloop';
import { tradeStore } from '@/stores/trades';
import { type profileType, type road, type roomPlayers, type Trade } from '@/types/types';
import TradeRequest from '@/components/Trades/TradeRequest.vue';
import TradeResponse from '@/components/Trades/TradeResponse.vue';
import UserProfile from '@/components/UserProfile.vue';
import type { PostgrestError } from '@supabase/supabase-js';
import RoadLogic from '@/components/Board/RoadLogic.vue';
import { roads } from '@/vertex';
const game = gameLogic()
const use_profile=profileStore()
const loading = ref<boolean>(false)
const isCreator = ref<boolean|null>(null)
const id = ref<string>('')
const players =ref<roomPlayers[]|null>(null)
const trades = ref<Trade[]|null>()


const router=useRouter()
onMounted(async()=>{

    id.value = useRoute().params.gameid as string
    await game.updateRoute(id.value)
    await use_profile.fetchUserProfile()
    players.value = await gameLoop().getPlayers()
    await game.determineTurn(id.value)
    await subscriptions(id.value)
    trades.value = await tradeStore().fetchTradeResults(id.value)
    await loadInitiatorProfiles(trades.value);
    isCreator.value = await rooms().fetchRoomCreator(id.value,use_profile.profile?.id)
    console.log("this is gam baord")
console.log(use_profile.profile?.id === game.current_player)
    loading.value = true
})
const tradeData = ref<Trade|null>(null)
async function handlePlayerTrade(selectedPlayerResource:string,selectedPlayerQuantity:number,desiredPlayerResource:string,desiredPlayerQuantity:number){
if (
  
  use_profile.profile?.id &&
  id.value
)

    {
        console.log(1)
        const data =await tradeStore().offerTrade(
  profileStore().profile?.id as string,
  selectedPlayerQuantity,  
  selectedPlayerResource,       
    desiredPlayerQuantity,    
  desiredPlayerResource,        

      
  id.value
) 
tradeData.value = data
console.log(data)
initPlayerProfile.value = await use_profile.fetchUserById(use_profile.profile.id)
console.log(initPlayerProfile.value)
}}
const initPlayerProfile=ref<profileType|null>(null)
async function handlePlayerResponse(trade: Trade) {
  if (trade && use_profile.profile?.id && id.value) {
    await tradeStore().playerTrades(
      trade.init_id,
      use_profile.profile.id,
      trade.init_quant,
      trade.init_type,
      trade.recieve_quant,
      trade.recieve_type,
      id.value
    )
    console.log("Trade accepted.")
  }
}
const myTurn = computed(()=>{
    return use_profile.profile?.id === game.current_player
})
const initiatorProfiles = ref<profileType[]>([]);

async function loadInitiatorProfiles(trades: Trade[] | null) {
  if (!trades) return;

  for (const trade of trades) {
const exists = initiatorProfiles.value.find(p => p.id === trade.init_id);
    if (!exists) {
  const profile = await use_profile.fetchUserById(trade.init_id);
  if (profile) {
    initiatorProfiles.value.push(profile);
  }
}
  }
}
function findProfileById(id: string): profileType | null {
  return initiatorProfiles.value.find(p => p.id === id) ?? null
}
async function buildRoad(road:road){
const {data,error}:{data:road[]|null,error:PostgrestError|null} =await supabase.from('roads').select().eq('player_id',use_profile.profile?.id)
const { data: settlementData,error:settlememt } = await supabase.from('settlements').select().eq('game_id', id.value).eq('player_id',use_profile.profile?.id)

console.log(settlememt)
if(use_profile.profile?.id&&data&&settlementData){
  await gameLoop().BuildRoad(use_profile.profile?.id,id.value,data,road,settlementData)

}
}

async function handleDelete(){
    await rooms().deleteRoom(id.value)
    router.push('/dash')
}

async function handleBankTrade(selectedBankResource:string,desiredBankResource:string){
    if(use_profile.profile){
        await tradeStore().bankTrade(3,selectedBankResource,desiredBankResource,use_profile.profile.id,id.value)

    }

}
async function subscriptions(game_id:string){
        const myChannel= supabase.channel('game_players_resource')
  .on(
    'postgres_changes',
    { event: '*' ,
    schema:'public',
    table:'game_players',
    filter:`game_id=eq.${game_id}`},
    async (payload) => {
        console.log("Realtime payload:", payload)

        const updatedPlayers = await gameLoop().getPlayers()
        players.value = updatedPlayers}
  )
  .subscribe()
   const tradeChannel = supabase.channel('game_trades_trades')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'trades',
        filter: `game_id=eq.${game_id}`
      },
      async (payload) => {
        console.log("Realtime payload (trades):", payload)
        trades.value = await tradeStore().fetchTradeResults(game_id)
        await loadInitiatorProfiles(trades.value);
      }
    )
    .subscribe()
    const gameChannel = supabase.channel('game_turn')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'trades',
        filter: `game_id=eq.${game_id}`
      },
      async (payload) => {
        console.log("Realtime payload turn", payload)
// if (payload.new.turn_index !== undefined && players.value.length > 0) {
//   game.current_player.value = players.value[payload.new.turn_index].player_id_game;
// }      }
})
    .subscribe()
    }
</script>

<style scoped>

</style>