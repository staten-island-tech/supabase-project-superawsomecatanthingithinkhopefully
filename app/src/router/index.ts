import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignUp from '../components/SignUp.vue'
import '../assets/main.css'
import MainDashboard from '@/components/MainDashboard.vue'
import GameRoom from '@/components/GameRoom.vue'

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
      path:'/:gameid',
      name:'game',
      component:GameRoom,
    },
    {
      path: '/HomePage',
      name: 'HomePage',
      component: () => import('@/views/HomePage.vue')
    },
    {
      path: '/AccountStuff.vue',
      name: 'AccountStuff',
      component: () => import('@/views/AccountStuff.vue')
    },
  ],
})

export default router
