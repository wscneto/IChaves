<template>
  <div class="relative cursor-pointer" @click="$emit('toggle')">
    <Icon
      name="bx:bell"
      class="w-7 h-7 text-gray-700 hover:text-blue-600 transition"
    />
    <span
      v-if="hasNotifications"
      class="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border border-white"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNotificationsStore } from '@/stores/notifications'

const notifications = useNotificationsStore()
const hasNotifications = computed(
  () => notifications.pendingRequests.length > 0
)
</script>
