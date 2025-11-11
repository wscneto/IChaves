<template>
  <header class="fixed w-full h-[60px] sm:h-[80px] lg:h-[100px] flex items-center justify-between px-6 py-3 md:px-12 bg-gray-200 shadow-md z-50">
    <NuxtLink to="/" class="flex items-center">
      <img
        src="@/assets/images/ichaves-logo.svg"
        alt="IChaves Logo"
        class="h-8 sm:h-10 lg:h-12 w-auto"
      />
    </NuxtLink>

    <div class="flex items-center space-x-3 relative">
      <div class="relative" ref="notificationArea">
        <NotificationBell @toggle="showCard = !showCard" />
        <!-- Notification Badge -->
        <span
          v-if="notificationsStore.hasNotifications"
          class="absolute top-0 right-0 block w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white pointer-events-none"
        ></span>
        <NotificationCard :show="showCard" />
      </div>

      <NuxtLink to="/user" class="flex items-center space-x-3">
        <span class="hidden sm:block text-gray-700 font-medium text-xl">
          {{ authStore.userName }}
        </span>
        <img
          :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.userName)}&background=0D47A1&color=FFFFFF&font-weight=bold`"
          alt="User avatar"
          class="w-10 h-10 rounded-full border-2 border-solid"
          :style="{ borderColor: 'var(--color-blue-4)' }"
        />
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import NotificationBell from '@/components/NotificationBell.vue'
import NotificationCard from '@/components/NotificationCard.vue'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'

const showCard = ref(false)
const notificationArea = ref<HTMLElement | null>(null)
const authStore = useAuthStore()

function handleClickOutside(event: MouseEvent) {
  if (notificationArea.value && !notificationArea.value.contains(event.target as Node)) {
    showCard.value = false
  }
}

const notificationsStore = useNotificationsStore()

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  
  // Fetch notifications when component mounts
  if (authStore.user) {
    await notificationsStore.fetchNotifications(authStore.user.IDUser)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
