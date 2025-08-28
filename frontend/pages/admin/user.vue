<template>
  <div class="min-h-screen p-4 bg-gray-50">
    
    <!-- BackButton agora aponta para a home de admin -->
    <NuxtLink 
      to="/admin" 
      class="inline-block mb-4 bg-white px-4 py-2 rounded-lg shadow border hover:bg-gray-100 transition"
    >
      &larr; Voltar para a lista de salas
    </NuxtLink>

    <!-- Informações do usuário -->
    <div class="bg-white p-6 rounded-2xl shadow flex items-center space-x-6">
      <img
        :src="user.avatar"
        alt="User Avatar"
        class="w-24 h-24 rounded-full border border-gray-300 flex-shrink-0"
      />
      <div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ user.name }}</h1>
        <p class="text-gray-600 mb-4">Email: {{ user.email }}</p>
        <div class="flex space-x-4">
          <p><strong>Perfil:</strong> {{ user.role }}</p>
        </div>
      </div>
    </div>

    <!-- Seção de Histórico de Transações -->
    <div class="mt-6 bg-white p-6 rounded-2xl shadow">
      <h2 class="text-xl font-bold text-gray-800 mb-4">Histórico de Transações Recentes</h2>
      <ul class="space-y-4">
        <li
          v-for="item in transactions"
          :key="item.id"
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg border"
        >
          <p class="font-medium text-gray-800">
            <span class="font-bold">{{ item.userName }}</span> {{ item.action }} a chave de <span class="font-bold">{{ item.roomName }}</span>.
          </p>
          <p class="text-sm text-gray-500 mt-2 sm:mt-0">
            {{ item.timestamp }}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const user = ref({
  name: 'Secretaria',
  email: 'secretaria@unifake.com',
  role: 'Admin',
  avatar: 'https://ui-avatars.com/api/?name=Secretaria&background=E1F1FF&color=0D47A1',
})

// Dados fictícios para o histórico de transações
const transactions = ref([
  {
    id: 1,
    userName: 'Walter Neto',
    roomName: 'Laboratório 03',
    action: 'pegou',
    timestamp: '28/08/2025 13:30'
  },
  {
    id: 2,
    userName: 'Secretaria',
    roomName: 'Sala de Convivência',
    action: 'bloqueou',
    timestamp: '28/08/2025 11:15'
  },
  {
    id: 3,
    userName: 'Maria Clara',
    roomName: 'Armário 02',
    action: 'devolveu',
    timestamp: '27/08/2025 18:00'
  },
  {
    id: 4,
    userName: 'Maria Clara',
    roomName: 'Armário 02',
    action: 'pegou',
    timestamp: '27/08/2025 14:20'
  }
])
</script>

