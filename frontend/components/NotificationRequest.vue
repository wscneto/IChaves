<template>
  <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
    <p class="text-sm text-gray-800 mb-3">
      <span class="font-bold">{{ userName }}</span> requisitou a chave de <span class="font-bold">{{ roomName }}</span>.
    </p>
    <div class="flex items-center justify-end gap-3">
      <button 
        @click="$emit('reject', requestId)"
        class="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition"
      >
        Rejeitar
      </button>
      <button 
        @click="$emit('accept', requestId)"
        class="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-md transition"
      >
        Aceitar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  requestId: {
    type: Number,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  roomName: {
    type: String,
    required: true,
  }
});

defineEmits(['accept', 'reject']);
</script>
