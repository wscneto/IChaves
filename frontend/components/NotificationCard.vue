<template>
  <div
    v-if="show"
    class="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg p-4 z-50"
  >
    <h2 class="text-lg font-bold mb-3">Notificações</h2>

    <ul v-if="notifications.pendingRequests.length > 0" class="space-y-2">
      <li
        v-for="req in notifications.pendingRequests"
        :key="req.id"
        class="p-3 bg-gray-100 rounded-lg flex justify-between items-center"
      >
        <span>{{ req.student }} pediu a sala {{ req.classroom }}</span>
        <button
          class="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
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
