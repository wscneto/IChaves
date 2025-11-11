<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
    @click.self="close"
  >
    <div
      class="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4"
    >
      <button
        @click="close"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
      <h2 class="text-xl font-bold text-gray-800 mb-2">Nova Notificação</h2>
      <p class="text-gray-600 mb-4">
        {{ message }}
      </p>

      <div v-if="showActions" class="flex justify-end gap-3 mt-6">
        <button
          class="px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors"
          @click="handleAction(false)"
        >
          Rejeitar
        </button>
        <button
          class="px-4 py-2 rounded-lg text-white bg-green-500 hover:bg-green-600 transition-colors"
          @click="handleAction(true)"
        >
          Aceitar
        </button>
      </div>

      <div v-else class="flex justify-end mt-6">
        <button
          class="px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors"
          @click="close"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean;
  message: string;
  showActions: boolean;
}>();

const emit = defineEmits(["close", "action"]);

const close = () => {
  emit("close");
};

const handleAction = (approved: boolean) => {
  emit("action", approved);
  close();
};
</script>
