<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <header class="flex items-center justify-between px-4 py-3 bg-white shadow-md">
      <NuxtLink to="/">
        <h1 class="text-xl font-bold text-green-700"><span class="text-blue-600">IC</span>haves</h1>
      </NuxtLink>
      <div class="flex items-center space-x-3">
        <NuxtLink to="/user" class="flex items-center space-x-3">
          <span class="hidden sm:block text-gray-700 font-medium">
            Walter Neto
          </span>
          <img
            src="https://ui-avatars.com/api/?name=Walter+Neto"
            alt="User avatar"
            class="w-8 h-8 rounded-full border border-gray-300"
          />
        </NuxtLink>
      </div>
    </header>

    <div class="p-4">
      <input
        type="text"
        placeholder="Busque uma sala..."
        v-model="searchQuery"
        class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>

    <main class="flex-1 p-4">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="room in filteredClassrooms"
          :key="room.id"
          :to="`/classrooms/${room.id}`"
          class="block"
        >
          <div
            class="p-4 bg-white rounded-2xl shadow hover:shadow-lg transition"
          >
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-800">
                {{ room.name }}
              </h2>
              <StatusBadge :status="room.status" />
            </div>
          </div>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'

const searchQuery = ref('')

const classrooms = ref([
  { id: 1, name: 'Lab 01', status: 'in_use' },
  { id: 2, name: 'Lab 02', status: 'in_use' },
  { id: 3, name: 'Lab 03', status: 'unknown' },
  { id: 4, name: 'Sala de Convivência', status: 'available' },
  { id: 5, name: 'Salinha', status: 'available' },
])

const filteredClassrooms = computed(() =>
  classrooms.value.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)
</script>
