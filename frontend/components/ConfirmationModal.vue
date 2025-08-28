<template>
  <div
    @click="$emit('close')"
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
  >
    <div
      @click.stop class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4"
    >
      <h3 class="text-xl font-bold text-gray-800 mb-4">{{ title }}</h3>

      <p class="text-gray-600 mb-6">{{ message }}</p>

      <div class="flex justify-end gap-4">
        <button
          @click="$emit('close')"
          class="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition font-medium"
        >
          {{ cancelText }}
        </button>
        <button
          @click="$emit('confirm')"
          class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Define as propriedades que o componente pode receber do componente pai
defineProps({
  title: {
    type: String,
    default: 'Confirmar Ação'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirmar'
  },
  cancelText: {
    type: String,
    default: 'Cancelar'
  }
})

// Define os eventos que o componente pode emitir para o componente pai
defineEmits(['confirm', 'close'])
</script>
