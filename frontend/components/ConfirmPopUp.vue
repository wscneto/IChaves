<template>
  <div
    v-if="show"
    class="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-80">
      <h3 class="text-lg font-bold mb-4">{{ title }}</h3>
      <p class="mb-4">{{ message }}</p>
      <div class="flex justify-end space-x-3">
        <button
          class="px-4 py-2 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-100 cursor-pointer"
          @click="cancel"
        >
          Cancelar
        </button>
        <button
          class="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
          @click="confirm"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

defineProps<{
  show: boolean
  title: string
  message: string
}>()

const emit = defineEmits(['confirm', 'cancel'])

function confirm() {
  emit('confirm')
}

function cancel() {
  emit('cancel')
}
</script>
