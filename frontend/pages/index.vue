<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <div class="p-4">
      <input
        type="text"
        placeholder="Busque uma sala..."
        v-model="searchQuery"
        class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>

    <main class="flex-1 p-4">
      <div class="flex flex-col gap-5">
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
