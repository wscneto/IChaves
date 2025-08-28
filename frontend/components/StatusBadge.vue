<template>
  <span
    :class="[
      'px-3 py-1 text-xs font-semibold rounded-full',
      badgeColor
    ]"
  >
    {{ statusLabel }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: string
}>()

// O statusLabel agora lida com o novo status 'reserved'
const statusLabel = computed(() => {
  switch (props.status) {
    case 'available':
      return 'Disponível'
    case 'in_use':
      return 'Em uso'
    case 'reserved': // Novo status
      return 'Reservado'
    case 'blocked':
    default:
      return 'Secretaria'
  }
})

// badgeColor também lida com o novo status 'reserved'
const badgeColor = computed(() => {
  switch (props.status) {
    case 'available':
      return 'bg-green-100 text-green-700'
    case 'in_use': // Mudei para amarelo para diferenciar de 'reservado'
      return 'bg-yellow-100 text-yellow-700'
    case 'reserved': // Nova cor para o status de reserva
      return 'bg-blue-100 text-blue-700'
    case 'blocked':
    default:
      return 'bg-gray-100 text-gray-700'
  }
})
</script>
