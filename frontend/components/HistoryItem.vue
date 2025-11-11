<template>
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg">
    <div class="font-semibold text-gray-900">
      <span v-if="display === 'user'">{{ historyItem.User?.Name || 'Usuário desconhecido' }}</span>
      <span v-else-if="display === 'classroom'">{{ historyItem.Classroom?.Name || 'Sala desconhecida' }}</span>
    </div>
    <div class="text-sm text-gray-600 mt-2 sm:mt-0 sm:text-right space-y-1">
      <p>
        <span class="font-medium">Início:</span> {{ formatDate(historyItem.StartDate) }}
      </p>
      <p v-if="historyItem.ReturnDate">
        <span class="font-medium">Devolução:</span> {{ formatDate(historyItem.ReturnDate) }}
      </p>
      <p v-else class="text-orange-600 font-medium">
        Em uso
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { History } from '@/types/database'

const props = defineProps<{
  historyItem: History,
  display: 'user' | 'classroom'
}>()

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
