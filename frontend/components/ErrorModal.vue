<template>
  <div
    v-if="errorStore.show"
    class="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-96">
      <!-- Seção Superior -->
      <div class="p-6">
        <div class="flex justify-between items-start">
          <h3 class="text-lg font-bold text-red-500">Erro</h3>
          <button @click="close" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Linha Horizontal Cinza -->
      <hr class="border-gray-200">

      <!-- Seção Inferior -->
      <div class="p-6">
        <p class="mb-4">{{ errorStore.message }}</p>
        <div class="flex justify-end space-x-3">
          <button
            class="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
            @click="close"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useErrorStore } from '~/stores/error'

const errorStore = useErrorStore()

function close() {
  errorStore.hideError()
}
</script>
