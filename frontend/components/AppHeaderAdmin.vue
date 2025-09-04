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
        <NotificationCard :show="showCard" />
      </div>

      <NuxtLink to="/user" class="flex items-center space-x-3">
        <span class="hidden sm:block text-gray-700 font-medium text-xl">
          Walter Neto
        </span>
        <img
          src="https://ui-avatars.com/api/?name=Walter+Neto"
          alt="User avatar"
          class="w-10 h-10 rounded-full border border-gray-300"
        />
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import NotificationBell from '@/components/NotificationBell.vue'
import NotificationCard from '@/components/NotificationCard.vue'

const showCard = ref(false)
const notificationArea = ref<HTMLElement | null>(null)

function handleClickOutside(event: MouseEvent) {
  if (notificationArea.value && !notificationArea.value.contains(event.target as Node)) {
    showCard.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const notifications = useNotificationsStore()
notifications.seed()
</script>
