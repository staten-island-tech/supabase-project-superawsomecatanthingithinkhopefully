<template>
  <div data-theme="synthwave" class=" min-h-screen relative flex flex-col" >
    <div class="absolute top-0 right-0 z-20">
      <button v-if="hide_trades" @click="toggle_trades()" class="bg-purple-400 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded-full">Hide Trade Menu</button>
      <BankTrade v-if="hide_trades" @trade = "handleBankTrade"/>
      <TradeRequest v-if="hide_trades" @playerTrade = "handlePlayerTrade"/>
      <button v-else @click="toggle_trades()" class="bg-purple-400 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded-full">Show Trade Menu</button>
    </div>
    
    <div class="glass absolute top-[50vw] left-[1vw] w-50 h-20 bg-gradient-to-bl from-violet-500 to-fuchsia-500">
      <TradeResponse
      v-for="(trade, index) in trades"
      :key="index"
      :recieve="{ quantity: trade.recieve_quant, type: trade.recieve_type }"
      :give="{ quantity: trade.init_quant, type: trade.init_type }"
      :user="findProfileById(trade.init_id)"
      @playerTrade="handlePlayerResponse(trade)"
      />
    </div>
    
  

    
    <div class="relative top-0 left-0 z-0">
      <TotalBoard :isTurn="myTurn" v-if="loading === true" :builtRoads="builtRoads" @buildRoad="buildRoad" :settlements="builtSettlements" />

      
      
      <div v-else>
          <span class="loading loading-spinner loading-xl"></span>
          <p>im loading gimme a sec</p>
      </div>

      <button
  class="absolute top-[12vw] left-[1vw] bg-purple-400 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-full"
  v-if="myTurn"
  @click="endTurn()"
>
  End Turn
</button>

<h3
  class="absolute top-[8vw]  text-xl font-bold text-white  bg-opacity-70 rounded-lg px-6 py-2 shadow-lg"
>
  You rolled an {{ diceRoll }}
</h3>

        
    </div>

    <!-- <div class="absolute bottom-0 z-10" >
        {{ players }}
    </div> -->

    <div v-if="the_users" class="grid grid-cols-1 gap-4 absolute right-0 top-[10vw] z-0">
      <div v-for="(the_users, index) in the_users" the_users="the_users"   :key='the_users.username'>
        <div 
        class="player_tag flex items-center w-[18vw] h-[8vw] rounded-full"
        :class="getPlayerColorClass(the_users.color)"
        >
          <div class="w-[5vw] rounded-full">
            <img class="rounded-full" :src="profilePics[the_users.username]" alt="profile_pic" />
          </div>
          <h2 v-if="!gameStore.room_host">Loading...</h2>
          <h1 class="truncate text-3xl color-white-500" v-else>
            {{ the_users.username }}
            
          
          </h1>
        
        
        </div>
        
      </div>
    </div>

    <img class="absolute top-0 left-0" src="/tradeins.jpg" alt="trade_ins">

    <div v-if="players&&players[yournumber]" class="grid grid-cols-2 gap-4 absolute left-0 top-[18vw] z-0">
      <div>
        <img src="/sheep.jpg" alt="sheep">
        <h2>Sheep: {{ players[yournumber].sheep }} </h2>
      </div>

       <div >
        <img src="/stone.jpg" alt="stone">
        <h2>Stone: {{ players[yournumber].ore }} </h2>
      </div>

       <div >
        <img src="/brick.jpg" alt="brick">
        <h2>Brick: {{ players[yournumber].brick }} </h2>
      </div>

       <div >
        <img src="/wood.jpg" alt="wood">
        <h2>Wood: {{ players[yournumber].wood }}</h2>
      </div>

       <div >
        <img src="/wheat.jpg" alt="wheat">
        <h2>Wheat: {{ players[yournumber].wheat }} </h2>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">

//get profile pics like you did for usernames, put it in game_players table and push it in Gameroom

const use_rooms = rooms()
import BankTrade from '@/components/Trades/BankTrade.vue';
import TotalBoard from '@/components/Board/TotalBoard.vue';
import { rooms } from '@/stores/rooms';
import { supabase } from '@/lib/supabaseClient'
import { onMounted,ref, reactive, computed } from 'vue';
import { profileStore } from '@/stores/profile';
import { useRoute,useRouter } from 'vue-router';
import { gameLogic } from '@/stores/setup';
import { gameLoop } from '@/stores/gameloop';
import { tradeStore } from '@/stores/trades';
import { type playerRoad, type profileType, type road, type roomPlayers, type Settlement, type Trade } from '@/types/types';
import TradeRequest from '@/components/Trades/TradeRequest.vue';
import TradeResponse from '@/components/Trades/TradeResponse.vue';
import UserProfile from '@/components/UserProfile.vue';
import type { PostgrestError } from '@supabase/supabase-js';
import { gamers } from '@/stores/gamer'
import { roads } from '@/vertex';


const game = gameLogic()
const use_profile=profileStore()
const loading = ref<boolean>(false)
const isCreator = ref<boolean|null>(null)
const id = ref<string>('')
const players =ref<roomPlayers[]|null>(null)
const trades = ref<Trade[]|null>()
const builtRoads = ref<playerRoad[]>([])
const builtSettlements = ref<Settlement[]>([])
const gameStore = gamers()
const router=useRouter()
const yournumber = ref<number>(0)

const hide_trades = ref<boolean>(false)

function toggle_trades(){
  if (hide_trades.value === true){
    hide_trades.value = false
  } else{
    hide_trades.value = true
  }
}
const diceRoll=ref<number>(0)
async function endTurn() {
  diceRoll.value = Math.floor(Math.random() * 11) + 1

  await game.turnOrder(id.value, diceRoll.value)
}
const the_users = ref()
const profilePics = reactive<Record<string, string>>({})

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

    const {data: usernames, error} = await supabase.from('game_players').select('username, color').eq('game_id', id.value)
    console.log(usernames,'usernames')
    the_users.value = usernames
    const {data:idstuff, error: please} = await supabase.from('game_players').select('game_id, player_id_game').eq('game_id', id.value)
    console.log(please)
    const ids = idstuff?.map(p => p.player_id_game) || []
    const { data: names } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', ids)

    if (names) {
      for (const user of names) {
        const { data: pic, error:perror } = await supabase
          .from('game_players')
          .select('profile_pic')
          .eq('username', user.username)
          .limit(1)
        console.log(perror)

        if (pic && pic.length > 0) {
          profilePics[user.username] = pic[0].profile_pic
        }
      }
    }





    const {data}=await supabase.from('roads').select().eq('game_id',id.value)
    if(data){
      builtRoads.value = data
    }
    const {data:settlementData} = await supabase.from('settlements').select().eq('game_id',id.value)
if(settlementData){
      builtSettlements.value = settlementData
    }
    loading.value = true
  console.log('players.value:', players.value)
  if(players.value){
    for(let i = 0; i < players.value.length; i++){
    
    if (players.value && players.value[i].player_id_game === use_profile.profile?.id) {
      yournumber.value = i
    }
  }
  }
  
    
  
  
})
const tradeData = ref<Trade|null>(null)
async function handlePlayerTrade(selectedPlayerResource:string,selectedPlayerQuantity:number,desiredPlayerResource:string,desiredPlayerQuantity:number){
if (
  
  use_profile.profile?.id &&
  id.value
)

    {
        const data =await tradeStore().offerTrade(
  profileStore().profile?.id as string,
  selectedPlayerQuantity,  
  selectedPlayerResource,       
    desiredPlayerQuantity,    
  desiredPlayerResource,        

      
  id.value
)

// for each username in the room, grab the username and color



tradeData.value = data
initPlayerProfile.value = await use_profile.fetchUserById(use_profile.profile.id)
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
const winner = computed(() => {
  return players.value?.find(player => player.vp >= 10) 
});
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
const roadBuilt = ref<boolean>(false)
async function buildRoad(road:road){
  roadBuilt.value = false
  console.log(road)
const {data,error}:{data:road[]|null,error:PostgrestError|null} =await supabase.from('roads').select().eq('player_id',use_profile.profile?.id).eq('game_id',id.value)


const { data: settlementData,error:settlememt } = await supabase.from('settlements').select().eq('game_id', id.value).eq('player_id',use_profile.profile?.id)
console.log('this is y settlement data',settlementData)
console.log(settlememt)
if(use_profile.profile?.id&&data&&settlementData){
  const check = await gameLoop().BuildRoad(use_profile.profile?.id,id.value,data,road,settlementData)
if (check){
  roadBuilt.value = true
}
console.log(roadBuilt.value)
}
console.log(builtRoads.value)
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
  const winnerAlerted = ref<boolean>(false);
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
        players.value = updatedPlayers
      const winner = updatedPlayers?.find((player)=>{
          return player.vp == 10
        })
      if (winner&&!winnerAlerted.value) {
        alert(`a player has won the game!`)
        router.push('/dash')
        winnerAlerted.value = true
        setTimeout(() => {
    router.push('/dash');
  }, 100);
        await supabase.from('game').delete().eq('id',game_id)
      }
      
      }
        
  )
  .subscribe()
  const deleteChannel = supabase.channel('trade_deletes_only')

deleteChannel
  .on(
    'postgres_changes',
    {
      event: 'DELETE',
      schema: 'public',
      table: 'trades'
    },
    async (payload) => {
  console.log(payload.eventType)


  if (payload.eventType === 'DELETE') {
    trades.value = await tradeStore().fetchTradeResults(game_id)
    await loadInitiatorProfiles(trades.value)
  }
}
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
        console.log(payload.eventType)
          
      trades.value = await tradeStore().fetchTradeResults(game_id)
    
        console.log(trades.value)
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
        table: 'game',
        filter: `id=eq.${game_id}`
      },
      async (payload) => {
        console.log("Realtime payload turn", payload)

const newPayload = payload.new as { turn_index?: number, [key: string]:any };

if (newPayload.turn_index !== undefined && players.value&& players.value.length > 0) {
  game.current_player = players.value?.[newPayload.turn_index].player_id_game;
}

console.log(game.current_player)


})
    .subscribe()
    const settlementsChannel = supabase
  .channel('settlement_updates')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'settlements',
      filter: `game_id=eq.${id.value}`
    },
    async (payload) => {
      console.log("SETTLEMENT UPDATE RECEIVED:", payload);

      const newSettlement = payload.new as Settlement;

      let found = false;

      builtSettlements.value = builtSettlements.value.map(settlement => {
        if (settlement.id === newSettlement.id) {
          found = true;
          return newSettlement; 
        }
        return settlement;
      });

      if (!found) {
        builtSettlements.value.push(newSettlement);
      }

      console.log("Updated settlements:", builtSettlements.value);
    }
  )
  .subscribe();

    const roadChannel= supabase.channel('roadChannel')
  .on(
    'postgres_changes',
    { event: '*' ,
    schema:'public',
    table:'roads',
    filter:`game_id=eq.${game_id}`},
    async (payload) => {
        console.log("Realtime payload: roads edition", payload)

builtRoads.value.push(payload.new as playerRoad)
        console.log(builtRoads.value)
      
    
        
      }
      
      
        
  )
  .subscribe()
    }





let purple = ref<boolean>(true)
let currentcolor = ref(purple)
let red = ref<boolean>(false)
let blue = ref<boolean>(false)
let green = ref<boolean>(false)
let yellow = ref<boolean>(false)
let black = ref<boolean>(false)


const I_loveyou_Eyad = reactive({
  active: true,
  'text-danger': true,
  'bg-linear-to-bl from-violet-500 to-fuchsia-500': purple,
  'bg-linear-to-bl from-red-600 to-red-900': red,
  'bg-linear-to-bl from-sky-600 to-blue-900': blue,
  'bg-linear-to-bl from-green-600 to-green-800': green,
  'bg-linear-to-bl from-amber-300 to-amber-500': yellow,
  'bg-linear-to-bl from-zinc-500 to-zinc-800': black,
})



function getPlayerColorClass(color: string) {
  switch (color) {
    case 'red': return 'bg-gradient-to-bl from-red-600 to-red-900'
    case 'purple': return 'bg-gradient-to-bl from-violet-500 to-fuchsia-500'
    case 'blue': return 'bg-gradient-to-bl from-sky-600 to-blue-900'
    case 'green': return 'bg-gradient-to-bl from-green-600 to-green-800'
    case 'yellow': return 'bg-gradient-to-bl from-amber-300 to-amber-500'
    case 'black': return 'bg-gradient-to-bl from-zinc-500 to-zinc-800'
    default: return 'bg-gray-500'
  }
}
const allColors = ['red', 'blue', 'green', 'yellow', 'purple', 'black']

const takenColors = computed(() => players.value?.map(p => p.color).filter(Boolean))

const availableColors = computed(() =>
  allColors.filter(color => !takenColors.value?.includes(color))
)
</script>

<style scoped>

</style>