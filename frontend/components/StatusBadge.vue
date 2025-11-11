<template>
  <div
    :class="[
      'items-center justify-center border rounded-[5px] py-1 font-bold text-sm leading-normal whitespace-nowrap w-25',
      badgeColor
    ]"
    style="display: flex;"
  >
    {{ statusLabel }}
  </div>
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
      return 'bg-[#D9F7BE] text-[#3E9615] border-[#3E9615]'
    case 'Em uso':
      return 'bg-[#FFD8BF] text-[#D97E5D] border-[#D97E5D]'
    case 'Indisponivel':
      return 'bg-[#FFCCC7] text-[#D9625F] border-[#D9625F]'
    default:
      return 'bg-gray-100 text-gray-700'
  }
})
</script>
