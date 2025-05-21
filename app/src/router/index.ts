import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignUp from '../components/SignUp.vue'
import '../assets/main.css'
import MainDashboard from '@/components/MainDashboard.vue'
import GameRoom from '@/components/GameRoom.vue'
import AccountStuff from '@/views/AccountStuff.vue'
import TestBoard from '@/views/TestBoard.vue'

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
      component: () => import('@/views/TestBoard.vue'),
    },
    {
      path:'/:gameid',
      name:'game',
      component: () => import('@/views/StartGame.vue'),
    },
    {
      path: '/HomePage',
      name: 'HomePage',
      component: () => import('@/views/HomePage.vue')
    },
    {
      path: '/AccountStuff',
      name: 'AccountStuff',
      component:AccountStuff
    },
  ],
})

export default router
