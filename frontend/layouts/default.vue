<template>
  <div>
    <component :is="auth.user.role === 'admin' ? AppHeaderAdmin : AppHeaderStudent" />
    <div class="pt-[60px] sm:pt-[80px] lg:pt-[100px]">
      <div class="p-2 sm:p-4 bg-blue-600 text-white text-center">
        <p class="text-sm sm:text-base md:text-lg font-normal">
          Esta é a página {{ auth.user.role === 'admin' ? 'da secretaria' : 'do estudante' }}. Para acessar a página 
          {{ auth.user.role === 'admin' ? 'do estudante' : 'da secretaria' }}, clique <span class="cursor-pointer text-yellow-400 hover:text-green-500 font-bold" @click="toggleRole">aqui.</span>
        </p>
      </div>
      <slot />
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import AppHeaderAdmin from '@/components/AppHeaderAdmin.vue'
import AppHeaderStudent from '@/components/AppHeaderStudent.vue'
import AppFooter from '@/components/AppFooter.vue'

const auth = useAuthStore()

function toggleRole() {
  auth.setRole(auth.user.role === 'admin' ? 'student' : 'admin')
}
</script>
