<template>
  <div class="min-h-screen p-4 bg-gray-50">
    <button
      @click="$router.back()"
      class="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
    >
      Voltar
    </button>

    <div class="bg-white p-6 rounded-2xl shadow flex flex-col items-center">
      <img
        :src="user.avatar"
        alt="User Avatar"
        class="w-24 h-24 rounded-full border border-gray-300 mb-4"
      />
      <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ user.name }}</h1>
      <p class="text-gray-600 mb-4">Email: {{ user.email }}</p>

      <div class="flex space-x-4">
        <p><strong>Função:</strong> {{ user.role }}</p>
        <p><strong>Chaves emprestadas:</strong> {{ user.borrowedClassrooms.length }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const user = ref({
  name: 'Walter Neto',
  email: 'walter.neto@example.com',
  role: 'Monitor',
  avatar: 'https://ui-avatars.com/api/?name=Walter+Neto',
  borrowedClassrooms: [1, 2]
})

onMounted(() => {
})
</script>
