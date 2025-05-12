import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'



export const rooms = defineStore('rooms', () => {
  const id = ref<string>('')
  const number_player = ref<number>(4)
 
  async function makeRoom() {
    const {data:{user}, error:authError} = await supabase.auth.getUser()
    console.log(user)
    if (authError||!user){
        console.log(authError,user)
        return null;
    }
    
    else{console.log(user.id)}
    console.log('Inserting row:', {
        number_player: number_player.value,
        user_id: user
      });
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
    return null
}
  
  
  return {
    id,
    makeRoom,
    number_player,
  }
})

