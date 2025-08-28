<template>
  <!-- Overlay que fecha o modal ao clicar -->
  <div @click="$emit('close')" class="fixed inset-0 bg-black bg-opacity-25 z-40"></div>
  
  <!-- Conteúdo do Modal -->
  <div class="absolute top-16 right-4 sm:right-6 w-full max-w-sm bg-white rounded-xl shadow-lg border border-gray-200 z-50">
    <!-- Cabeçalho -->
    <div class="p-4 border-b flex justify-between items-center">
      <h3 class="text-lg font-bold text-gray-800">Notificações</h3>
      <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">&times;</button>
    </div>

    <!-- Lista de Notificações -->
    <div class="max-h-96 overflow-y-auto p-2">
      <!-- Exemplo da nova notificação de requisição -->
      <div v-if="request" class="mb-2">
        <NotificationRequest 
          :request-id="request.id"
          :user-name="request.userName"
          :room-name="request.roomName"
          @accept="handleAccept"
          @reject="handleReject"
        />
      </div>

      <!-- Notificações normais -->
      <ul v-if="notifications.length > 0" class="divide-y divide-gray-100">
        <li v-for="notification in notifications" :key="notification.id" class="p-3 hover:bg-gray-50">
          <p class="text-sm text-gray-700">{{ notification.message }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ notification.timestamp }}</p>
        </li>
      </ul>
      
      <div v-if="!request && notifications.length === 0" class="p-6 text-center text-gray-500">
        Nenhuma notificação por aqui.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NotificationRequest from './NotificationRequest.vue';

// Define a estrutura de uma notificação simples
export interface Notification {
  id: number;
  message: string;
  timestamp: string;
}

// Define a estrutura de uma requisição
export interface KeyRequest {
  id: number;
  userName: string;
  roomName: string;
}

const props = defineProps<{
  notifications: Notification[],
  request?: KeyRequest | null // A requisição agora é opcional
}>();

const emit = defineEmits(['close']);

// Funções para lidar com as ações da requisição
const handleAccept = (requestId: number) => {
  alert(`Requisição #${requestId} ACEITA!`);
  // Aqui você adicionaria a lógica para de fato aceitar
  emit('close'); // Fecha o modal após a ação
}

const handleReject = (requestId: number) => {
  alert(`Requisição #${requestId} REJEITADA!`);
  // Aqui você adicionaria a lógica para rejeitar
  emit('close'); // Fecha o modal após a ação
}
</script>
