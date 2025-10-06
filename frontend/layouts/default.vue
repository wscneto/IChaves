<template>
  <div>
    <component :is="auth.userRole === 'admin' ? AppHeaderAdmin : AppHeaderStudent" />
    <div class="pt-[60px] sm:pt-[80px] lg:pt-[100px]">
      <div v-if="auth.isAuthenticated" class="p-2 sm:p-4 bg-blue-600 text-white text-center">
        <p class="text-sm sm:text-base md:text-lg font-normal">
          Esta é a página {{ auth.userRole === 'admin' ? 'da secretaria' : 'do estudante' }}. Para acessar a página 
          {{ auth.userRole === 'admin' ? 'do estudante' : 'da secretaria' }}, clique <span class="cursor-pointer text-yellow-400 hover:text-green-500 font-bold" @click="toggleRole">aqui.</span>
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
  // Para demonstração, vamos simular a troca de papel
  // Em produção isso seria feito através de permissões do backend
  if (auth.userRole === 'admin') {
    // Simular usuário estudante
    const mockStudent = {
      IDUser: 2,
      Name: 'João Silva',
      Email: 'joao@example.com',
      Student: {
        Course: 'Engenharia de Software',
        Period: '5'
      }
    }
    auth.setUser(mockStudent)
  } else {
    // Simular usuário admin
    const mockAdmin = {
      IDUser: 1,
      Name: 'Admin Sistema',
      Email: 'admin@ichaves.com',
      Admin: {}
    }
    auth.setUser(mockAdmin)
  }
}
</script>
