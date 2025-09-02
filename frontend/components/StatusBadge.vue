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
  return status === 'available' || status === 'in_use' || status === 'blocked' || status === 'reserved' ? status : 'unknown'
})

const statusLabel = computed(() => {
  switch (normalizedStatus.value) {
    case 'available':
      return 'Disponível'
    case 'in_use':
      return 'Em uso'
    case 'blocked':
      return 'Bloqueado'
    case 'reserved':
      return 'Reservado'
    default:
      return 'Desconhecido'
  }
})

const badgeColor = computed(() => {
  switch (normalizedStatus.value) {
    case 'available':
      return 'bg-green-100 text-green-700'
    case 'in_use':
      return 'bg-orange-100 text-orange-700'
    case 'blocked':
      return 'bg-red-100 text-red-700'
    case 'reserved':
      return 'bg-yellow-100 text-yellow-700'                  
    default:
      return 'bg-gray-100 text-gray-700'
  }
})
</script>
