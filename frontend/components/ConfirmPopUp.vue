<template>
  <Transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="$emit('cancel')"
    >
      <div
        class="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center"
      >
        <!-- Botão de Fechar (X) -->
        <button
          @click="$emit('cancel')"
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

        <!-- Título -->
        <h3 class="text-xl font-bold text-gray-800">
          {{ title }}
        </h3>

        <!-- Subtítulo -->
        <p v-if="subtitle" class="text-sm text-gray-500 mt-1">
          {{ subtitle }}
        </p>

        <!-- Mensagem -->
        <p v-if="message" class="text-gray-700 my-4" v-html="message" />

        <!-- Input -->
        <div v-if="showInput" class="mt-4">
          <label
            class="block text-left text-sm font-medium text-gray-700 mb-1"
            >{{ inputLabel }}</label
          >
          <textarea
            v-model="inputValue"
            :placeholder="inputPlaceholder"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows="3"
          />
        </div>

        <!-- Botões -->
        <div class="flex justify-center gap-3 mt-6">
          <!-- Modo Informação (Apenas botão OK) -->
          <template v-if="isInfo">
            <button
              class="w-full px-4 py-2.5 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors font-semibold"
              @click="$emit('ok')"
            >
              OK
            </button>
          </template>

          <!-- Modo Confirmação (Confirmar/Cancelar) -->
          <template v-else>
            <button
              class="w-full px-4 py-2.5 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors font-semibold"
              @click="$emit('cancel')"
            >
              Cancelar
            </button>
            <button
              class="w-full px-4 py-2.5 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors font-semibold"
              @click="$emit('confirm', inputValue)"
            >
              Confirmar
            </button>
          </template>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  show: boolean;
  title: string;
  subtitle?: string;
  message?: string;
  showInput?: boolean;
  inputLabel?: string;
  inputPlaceholder?: string;
  isInfo?: boolean; // Nova propriedade para modo informativo
}>();

defineEmits(["confirm", "cancel", "ok"]);

const inputValue = ref("");

// Limpa o input quando o popup é fechado
watch(
  () => props.show,
  (newValue) => {
    if (!newValue) {
      inputValue.value = "";
    }
  }
);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
