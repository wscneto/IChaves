<template>
  <span
    :class="[
      'px-3 py-1 text-sm font-semibold rounded-full',
      badgeColor
    ]"
  >
    {{ statusLabel }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { status } = defineProps<{
  status: string
}>()

const normalizedStatus = computed(() => {
  return status === 'Disponivel' || status === 'Em uso' || status === 'Indisponivel' ? status : 'unknown'
})

const statusLabel = computed(() => {
  switch (normalizedStatus.value) {
    case 'Disponivel':
      return 'Disponível'
    case 'Em uso':
      return 'Em uso'
    case 'Indisponivel':
      return 'Indisponível'
    default:
      return 'Desconhecido'
  }
})

const badgeColor = computed(() => {
  switch (normalizedStatus.value) {
    case 'Disponivel':
      return 'bg-green-100 text-green-700'
    case 'Em uso':
      return 'bg-orange-100 text-orange-700'
    case 'Indisponivel':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
})
</script>
