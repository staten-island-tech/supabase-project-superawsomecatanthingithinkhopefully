import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'



export const rooms = defineStore('rooms', () => {
  const id = ref<string>('')
  const number_player = ref<number>(4)
 
  async function makeRoom() {
    const {data:{user}, error:authError} = await supabase.auth.getUser()

    if (authError||!user){
        console.log(authError,user)
        return null;
    }
    
    else{console.log(user.id)}
    
    const {data,error} = await supabase.from('game').insert([{number_player:number_player.value,user_id:user.id}]).select()

    if (error&&!data){
  
        console.log(data,error)

    }  
    else{
        if (data){
            id.value = data[0].id
            return {id:id.value}
        }
    }
    
}
  async function fetchRooms(){
    const {data,error} = await supabase.from('game').select('*')
    if (!data|| error){
      console.log(":(")
    }
    else{
      console.log(data)
      return data
    }
    
  }
  async function deleteRoom(id:string){
    console.log(3)
    const deleted_room = await supabase.from('game').delete().eq('id',id)
    const select_room = await supabase.from('game').select().eq('id',id)
    console.log(select_room)
  }
  async function leaveUser() {
    
  }
  
  
  
  return {
    id,
    makeRoom,
    number_player,
    fetchRooms,
    deleteRoom,
  }
})

