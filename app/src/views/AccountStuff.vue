<template>
  <div>
    <h2>Look at all the friends you DON'T HAVE</h2>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'

test()
async function test(){
  const {data:{user}, error:authError} = await supabase.auth.getUser()
  console.log(user)
  const { data:{username}, error } = await supabase.from('profiles').select('username')
  console.log(username)
  //username null right now
  
}

</script>

<style scoped></style>