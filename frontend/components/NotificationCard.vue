<template>
  <div
    v-if="show"
    class="flex flex-col absolute mt-2 bg-white rounded-2xl shadow-lg p-4 z-50 max-w w-65 right-0 left-auto"
  >
    <h2 class="text-lg font-bold mb-3">Notificações</h2>

    <ul v-if="notifications.pendingRequests.length > 0" class="space-y-2">
      <li
        v-for="req in notifications.pendingRequests"
        :key="req.id"
        class="p-3 bg-gray-100 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
      >
        <span class="flex-1"
          >{{ req.student }} pediu a chave do {{ req.classroom }}</span
        >
        <button
          class="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer self-end sm:self-center"
          @click="accept(req.id)"
        >
          Aceitar
        </button>
      </li>
    </ul>

    <p v-else class="text-gray-500 text-center">Nenhuma notificação</p>
  </div>
</template>

<script setup lang="ts">
import { useNotificationsStore } from '@/stores/notifications'

defineProps<{ show: boolean }>()
const notifications = useNotificationsStore()

function accept(id: number) {
  notifications.removeRequest(id)
}
</script>
