<template>
  <NuxtLayout>
    <NuxtPage
      :transition="{
        name: 'page',
        mode: 'out-in'
      }"
    />
    <ErrorModal />
  </NuxtLayout>
</template>

<script setup lang="ts">
import ErrorModal from '~/components/ErrorModal.vue';
import { onMounted, watch } from 'vue';
import { useSocket } from '~/services/socket';
import { useAuthStore } from '~/stores/auth';
import { useRoute } from 'vue-router';

const { connect, disconnect } = useSocket();
const authStore = useAuthStore();
const route = useRoute();

// Primeiro, tenta pegar o token da URL
const token = route.query.token as string | null;

if (token) {
  authStore.setToken(token);
} else {
  // Se não houver token na URL, inicializa a autenticação
  // Isso vai tentar carregar o token do localStorage
  authStore.initializeAuth();
}

watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    connect();
  } else {
    disconnect();
  }
});

onMounted(() => {
  if (authStore.isAuthenticated) {
    connect();
  }
});
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
