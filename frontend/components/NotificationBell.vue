<template>
  <div class="relative cursor-pointer" @click="$emit('toggle')">
    <Icon
      name="bx:bell"
      class="w-7 h-7 text-gray-700 hover:text-blue-600 transition"
    />
    <span
      v-if="notificationsStore.unreadCount > 0"
      class="absolute top-1 right-1 min-w-[18px] px-1 h-4 bg-red-500 rounded-full border border-white text-white text-xs flex items-center justify-center"
    >
      {{ notificationsStore.unreadCount > 9 ? '9+' : notificationsStore.unreadCount }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useNotificationsStore } from '@/stores/notifications'

const notificationsStore = useNotificationsStore()
</script>
