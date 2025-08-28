
<template>
  <button @click="$emit('open')" class="relative text-gray-600 hover:text-gray-900">
    <!-- Ícone de Sino (SVG) -->
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
      <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
    <!-- Badge de Contagem -->
    <span v-if="count > 0" class="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-gray-50">
      {{ count }}
    </span>
  </button>
</template>

<script setup lang="ts">
defineProps({
  count: {
    type: Number,
    default: 0
  }
});
defineEmits(['open']);
</script>
