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

const { status } = defineProps<{
  status: string
}>()

const normalizedStatus = computed(() => {
  return status === 'available' || status === 'in_use' ? status : 'unknown'
})

const statusLabel = computed(() => {
  switch (normalizedStatus.value) {
    case 'available':
      return 'Disponível'
    case 'in_use':
      return 'Em uso'
    case 'unknown':
      return 'Desconhecido'
  }
})

// Set badge colors
const badgeColor = computed(() => {
  switch (normalizedStatus.value) {
    case 'available':
      return 'bg-green-100 text-green-700'
    case 'in_use':
      return 'bg-red-100 text-red-700'
    case 'unknown':
      return 'bg-gray-100 text-gray-700'
  }
})
</script>
