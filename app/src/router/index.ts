import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignUp from '../components/SignUp.vue'
import '../assets/main.css'
import MainDashboard from '@/components/MainDashboard.vue'

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
  ],
})

export default router
