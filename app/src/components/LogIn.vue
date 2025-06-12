<template>
  <div>
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="logo mx-auto h-50 w-auto" src="/Logo.png" alt="Your Company" />
        <h2 class="Login mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Console.Log In
        </h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form @submit.prevent="handleLog" class="space-y-6" action="#" method="POST">
          <div class="email_box">
            <label for="email" class="block text-sm/6 font-medium text-white">Email address</label>
            <div class="mt-2">
              <input
                v-model="signupStore.user_info.email"
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                autocomplete="email"
                required
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div class="password_box">
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm/6 font-medium text-white">Password</label>
            </div>
            <div class="mt-2">
              <input
                v-model="signupStore.user_info.password"
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                autocomplete="current-password"
                required
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div class="submit_button">
            <button
              type="submit"
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              log unc
            </button>
          </div>
          <div v-if="signupStore.error" class="text-red-500">
            {{ signupStore.error }}
          </div>
        </form>
        <RouterLink to="/signup" class="Signup">Don't have an account Sign up?</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSignupStore } from '@/stores/authuser'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
import { RouterLink } from 'vue-router'
import { onMounted } from 'vue'
import { userInfo } from 'os'
import { gsap } from "gsap"

const tl = gsap.timeline();

onMounted(() => {

  tl.set('.email_box', {x:'-100vw', opacity: 0})
    .set('.password_box', {x:'100vw', opacity: 0})
    .set('.submit_button', {scale: 0.5, opacity:0})
    .set('.Signup', { scale: 0.5, opacity:0})
    .set('.Login', { scale: 0.5, opacity:0})
    .set('.logo', {opacity: 0})

    .to('.logo', {opacity: 1, duration: 2, ease: 'power4.in'})
    .to('.email_box', {x:0, duration: 2, opacity: 1, ease: 'power2.out'}, '+=1')
    .to('.password_box', {x:0, duration: 2, opacity: 1, ease: 'power2.out'}, '-=1')
    .to('.submit_button', {scale: 1, opacity: 1, duration: 2,  ease: 'bounce.out'})
    .to('.Signup', { opacity: 1, duration: 1.5, scale: 1,  ease: 'power2.out'}, '-=1')
    .to('.Login', { opacity: 1, duration: 1, scale: 1,  ease: 'power2.out'}, '-=2')
  
})

const router = useRouter()
const route = useRoute();

const signupStore = useSignupStore()
async function handleLog() {
  const result = await signupStore.login()
  if (!result.error) {
    console.log(signupStore.user_info.username)
    console.log(signupStore.isLoggedIn)
    //router.push({ path: '/dash' })
    const redirectPath = route.query.redirect || '/dash';
    router.push(redirectPath);
    
  }
}
</script>

<style scoped></style>
