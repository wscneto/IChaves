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
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <NuxtLink
          v-for="room in filteredClassrooms"
          :key="room.id"
          :to="`/classrooms/${room.id}`"
          class="block"
        >
          <div
            class="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition flex items-center justify-between"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-1 h-8 rounded-md"
                :class="{
                  'bg-green-500': room.status === 'available',
                  'bg-yellow-500': room.status === 'in_use',
                  'bg-gray-300': room.status === 'unknown'
                }"
              ></div>
              <h2 class="text-lg font-semibold text-gray-800">
                {{ room.name }}
              </h2>
              <StatusBadge :status="room.status" class="hidden lg:inline-block" />
            </div>

            <button
              @click.stop="handleAction(room)"
              :disabled="room.status === 'unknown'"
              :class="[
                'ml-4 px-4 py-2 rounded-lg font-medium transition',
                room.status === 'available'
                  ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
                  : room.status === 'in_use'
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              ]"
            >
              {{
                room.status === 'available'
                  ? 'Pegar chave'
                  : room.status === 'in_use'
                  ? 'Trocar chave'
                  : 'Indisponível'
              }}
            </button>
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

const handleAction = (room: { id: number; name: string; status: string }) => {
  if (room.status === 'available') {
    alert(`Você pegou a chave da sala ${room.name}!`)
    room.status = 'in_use'
  } else if (room.status === 'in_use') {
    alert(`Você trocou a chave da sala ${room.name}.`)
  } else {
    alert(`A sala ${room.name} está indisponível.`)
  }
}
</script>
