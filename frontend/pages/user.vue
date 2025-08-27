<template>
  <div class="min-h-screen p-4 bg-gray-50">
    
    <BackButton />

    <!--Informações do usuário-->
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
          <p><strong>Chaves emprestadas:</strong> {{ user.borrowedClassrooms.length }}</p>
        </div>
      </div>
    </div>

    <!-- Seção de Histórico -->
    <div class="mt-6 bg-white p-6 rounded-2xl shadow">
      <h2 class="text-xl font-bold text-gray-800 mb-4">Histórico de Empréstimos</h2>
      <ul class="space-y-4">
        <li
          v-for="item in history"
          :key="item.id"
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg border"
        >
          <div class="font-semibold text-gray-900">{{ item.keyName }}</div>
          <div class="text-sm text-gray-600 mt-2 sm:mt-0 sm:text-right space-y-1">
            <p>
              <span class="font-medium">Reservado:</span> {{ item.reservationDate }}
            </p>
            <p>
              <span class="font-medium">Devolvido:</span> {{ item.returnDate }}
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const user = ref({
  name: 'Walter Neto',
  email: 'walter.neto@example.com',
  role: 'Aluno',
  avatar: 'https://ui-avatars.com/api/?name=Walter+Neto',
  borrowedClassrooms: [1, 2]
})

const history = ref([
  {
    id: 1,
    keyName: 'Armário 1',
    reservationDate: '04/06/1974 14:33',
    returnDate: '04/06/1974 14:34'
  },
  {
    id: 2,
    keyName: 'Laboratório 01',
    reservationDate: '25/10/2025 15:19',
    returnDate: '25/10/2025 18:00'
  },
  {
    id: 3,
    keyName: 'Sala de Convivência',
    reservationDate: '24/10/2025 10:00',
    returnDate: '24/10/2023 11:30'
  }
])

onMounted(() => {
})
</script>
