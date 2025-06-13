import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useRouter,useRoute } from 'vue-router'
import { profileStore } from './profile'
import { gameLogic } from './setup'

export const rooms = defineStore('rooms', () => {
  const router = useRouter()
  const route = useRoute()
  const id = ref<string>('')
  const number_player = ref<number>(4)
  const user_id = ref<string>('')
  const isCreator = ref<boolean|null>(null)
 
  async function makeRoom() {
    const {data:{user}, error:authError} = await supabase.auth.getUser()
    
    if (authError||!user){
        // console.log(authError,user)
        return null;
    }
    
    else{
      user_id.value = user?.id 
    }
    
    const {data,error} = await supabase.from('game').insert([{number_player:number_player.value,user_id:user.id}]).select()
    
    if (error&&!data){
  
        // console.log(data,error)

    }  
    else{
        if (data){
            id.value = data[0].id
            isCreator.value = true
            await joinRoom(id.value,true)
            gameLogic().route_id = id.value
            
            return {id:id.value}
        }
    }
    
}
  async function fetchRooms(){
    const {data,error} = await supabase.from('game').select('*')
    if (!data|| error){
    }
    else{
      // console.log(data)
      return data
    }
    
  }
  
  async function deleteRoom(id:string){
   
    const {data:deleted_room,error:deleted_error} = await supabase.from('game').delete().eq('id',id)
  }
  async function joinRoom(id:string,push:boolean){
    const {data:userData,error:userError} = await supabase.auth.getUser()
    if(userData.user){
          const {data:lengthPlayers,error:lengthError} = await supabase.from('game_players').select().eq('player_id_game',userData.user.id).eq('game_id',id)
      if(lengthPlayers&&lengthPlayers.length>0){
      }
      else{
        const { data, error } = await supabase
  .from('game_players')
  .insert({
    game_id: id,
    player_id_game: userData.user?.id,
  })
  .select()
      }
    }
    
    if(push){
      
      router.push({path:`/${id}-lobby`})
    }
    isCreator.value = false
    }
  async function fetchRoomCreator(room_id:string,user_id:string|undefined){
    const {data,error} = await supabase.from('game').select().eq('id',room_id).single()
    isCreator.value = data.user_id === user_id
    return isCreator.value
  }
  
  
  
  return {
    id,
    makeRoom,
    number_player,
    user_id,
    fetchRooms,
    deleteRoom,
    fetchRoomCreator,
    joinRoom
  }
})

