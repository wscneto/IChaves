<template>
  <div>
    <component :is="auth.user.role === 'admin' ? AppHeaderAdmin : AppHeaderStudent" />
    <div class="pt-[60px] sm:pt-[80px] lg:pt-[100px]">
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
</script>
