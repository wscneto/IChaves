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
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div
          v-for="room in filteredClassrooms"
          :key="room.id"
          class="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition flex items-center justify-between cursor-pointer"
          @click="goToClassroom(room.id)"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-1 h-8 rounded-md"
              :class="{
                'bg-green-500': room.status === 'available',
                'bg-yellow-500': room.status === 'in_use',
                'bg-gray-300': room.status === 'unknown' || room.status === 'blocked'
              }"
            ></div>
            <h2 class="text-lg font-semibold text-gray-800">
              {{ room.name }}
            </h2>
            <StatusBadge :status="room.status" class="hidden lg:inline-block" />
          </div>

          <div @click.stop>
            <template v-if="authStore.user.role === 'admin'">
              <button
                v-if="room.status === 'available'"
                @click="handleBlock(room)"
                class="px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition"
              >
                Bloquear
              </button>
              <button
                v-else-if="room.status === 'in_use'"
                @click="handleForceDevolution(room)"
                class="px-4 py-2 rounded-lg font-medium bg-orange-500 text-white hover:bg-orange-600 transition"
              >
                Forçar Devolução
              </button>
              <button
                v-else-if="room.status === 'blocked'"
                @click="handleUnblock(room)"
                class="px-4 py-2 rounded-lg font-medium bg-green-500 text-white hover:bg-green-600 transition"
              >
                Desbloquear
              </button>
              <button
                v-else
                disabled
                class="px-4 py-2 rounded-lg font-medium bg-gray-300 text-gray-600 cursor-not-allowed"
              >
                Indisponível
              </button>
            </template>

            <template v-else>
              <button
                @click="handleAction(room)"
                :disabled="room.status === 'unknown' || room.status === 'blocked'"
                :class="[
                  'px-4 py-2 rounded-lg font-medium transition',
                  room.status === 'available'
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : room.status === 'in_use'
                    ? 'bg-yellow-500 text-white hover:bg-yellow-600'
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
            </template>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import StatusBadge from '@/components/StatusBadge.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
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

const goToClassroom = (id: number) => {
  router.push(`/classrooms/${id}`)
}

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

const handleBlock = (room: { id: number; name: string; status: string }) => {
  alert(`A sala ${room.name} foi bloqueada!`)
  room.status = 'blocked'
}

const handleForceDevolution = (room: { id: number; name: string; status: string }) => {
  alert(`A sala ${room.name} foi devolvida à força!`)
  room.status = 'available'
}

const handleUnblock = (room: { id: number; name: string; status: string }) => {
  alert(`A sala ${room.name} foi desbloqueada!`)
  room.status = 'available'
}
</script>
