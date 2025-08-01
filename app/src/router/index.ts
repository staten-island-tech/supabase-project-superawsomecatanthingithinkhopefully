import { createRouter, createWebHistory } from 'vue-router'
import { useSignupStore } from '@/stores/authuser'
import { supabase } from '@/lib/supabaseClient'
import { ref } from 'vue'


import HomeView from '../views/HomeView.vue'
import SignUp from '../components/SignUp.vue'
import '../assets/main.css'
import MainDashboard from '@/components/MainDashboard.vue'
import AccountStuff from '@/views/AccountStuff.vue'
import { rooms } from '@/stores/rooms'

//const redirect = ref<boolean>(false)
//const the_rooms = rooms()

import GameBoard from '@/views/GameBoard.vue'
import StartGame from '@/views/StartGame.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    
    {
      path:'/signup',
      name:'signup',
      component:SignUp,
    },
    {
      path:'/dash',
      name:'dash',
      component:MainDashboard,

      
      
        
        
      
    },
    {
      path:'/:gameid-lobby',
      name:'game',
      component: StartGame,
      //component:GameBoard,
      //Changed from Eyads code. Make a seperate route to the GameBoard
    },
    {
      path:'/:gameid',
      name:'game_play',
      component: GameBoard,
      //component:GameBoard,
      //Changed from Eyads code. Make a seperate route to the GameBoard
    },
    {
      path: '/HomePage',
      name: 'HomePage',
      component: () => import('@/views/HomePage.vue')
    },
    {
      path: '/AccountStuff',
      name: 'AccountStuff',
      component: AccountStuff,
      
    },
  ],
})
router.beforeEach((to,from) =>{
  if(!useSignupStore().isLoggedIn && to.name != 'signup' && to.name!='home'){
  
    return ({
      path: '/',
      query: {redirect: to.fullPath}
    })
  
  } 
  //try to make it so if you copy room link, you must log in then it routes you to room not home page
})
export default router
