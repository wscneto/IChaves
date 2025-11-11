<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header sempre presente para evitar problemas de layout -->
    <AppHeaderStudent v-if="!auth.isAuthenticated || auth.userRole === 'student'" />
    <AppHeaderAdmin v-else />
    
    <!-- Padding fixo para evitar problemas de layout -->
    <div class="pt-[60px] sm:pt-[80px] lg:pt-[100px] flex-grow">

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
