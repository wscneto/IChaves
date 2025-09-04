<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Search Input -->
    <div class="p-4">
      <input
        type="text"
        placeholder="Busque uma sala..."
        v-model="searchQuery"
        class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>

    <!-- Classrooms Grid -->
    <main class="flex-1 p-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div
          v-for="room in filteredClassrooms"
          :key="room.id"
          class="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition flex items-center justify-between"
          :class="{
            'cursor-pointer': room.status !== 'blocked',
            'cursor-pointer opacity-70': room.status === 'blocked'
          }"
          @click="room.status !== 'unknow' && goToClassroom(room.id)"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-1 h-8 rounded-md"
              :class="{
                'bg-green-500': room.status === 'available',
                'bg-orange-500': room.status === 'in_use',
                'bg-yellow-500': room.status === 'reserved',
                'bg-red-500': room.status === 'blocked',
                'bg-gray-300': room.status === 'unknown'
              }"
            ></div>
            <h2 class="text-lg font-semibold text-gray-800">
              {{ room.name }}
            </h2>
            <StatusBadge :status="room.status" class="hidden sm:inline-block" />
          </div>

          <div @click.stop>
            <template v-if="authStore.user.role === 'admin'">
              <button
                v-if="room.status === 'available'"
                @click="handleBlock(room)"
                class="px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
              >
                Bloquear
              </button>
              <button
                v-else-if="room.status === 'in_use'"
                @click="handleForceDevolution(room)"
                class="px-4 py-2 rounded-lg font-medium bg-orange-500 text-white hover:bg-orange-600 transition cursor-pointer"
              >
                Forçar Devolução
              </button>
              <button
                v-else-if="room.status === 'blocked'"
                @click="handleUnblock(room)"
                class="px-4 py-2 rounded-lg font-medium bg-green-500 text-white hover:bg-green-600 transition cursor-pointer"
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
                    ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
                    : room.status === 'in_use'
                    ? 'bg-orange-500 text-white hover:bg-orange-600 cursor-pointer'
                    : room.status === 'reserved'
                    ? 'bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer'
                    : room.status === 'blocked'
                    ? 'bg-red-500 text-white cursor-not-allowed'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                ]"
              >
                {{
                  room.status === 'available'
                    ? 'Pegar chave'
                    : room.status === 'reserved'
                    ? 'Devolver'
                    : room.status === 'in_use'
                    ? 'Trocar chave'
                    : room.status === 'blocked'
                    ? 'Bloqueado'
                    : 'Indisponível'
                }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </main>

    <!-- Confirmation Popup -->
    <ConfirmPopUp
      :show="isConfirmOpen"
      :title="confirmTitle"
      :message="confirmMessage"
      @confirm="onConfirm"
      @cancel="isConfirmOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ConfirmPopUp from '@/components/ConfirmPopUp.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const searchQuery = ref('')

// State for confirmation popup
const isConfirmOpen = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
let onConfirmAction: (() => void) | null = null
const classrooms = ref([
  { id: 1, name: 'Armário 01', status: 'available' },
  { id: 2, name: 'Armário 02', status: 'in_use' }, // Exemplo de sala já reservada
  { id: 3, name: 'Armário 03', status: 'available' },
  { id: 4, name: 'Armário 04', status: 'available' },
  { id: 5, name: 'Sala de Convivência', status: 'blocked' },
  { id: 6, name: 'Sala de Estudos', status: 'available' },
  { id: 7, name: 'Laboratório 03', status: 'in_use' },
])

const filteredClassrooms = computed(() =>
  classrooms.value.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

const goToClassroom = (id: number) => {
  router.push(`/classrooms/${id}`)
}

const openConfirmPopup = (title: string, message: string, action: () => void) => {
  confirmTitle.value = title
  confirmMessage.value = message
  onConfirmAction = action
  isConfirmOpen.value = true
}

const onConfirm = () => {
  if (onConfirmAction) {
    onConfirmAction()
  }
  isConfirmOpen.value = false
  onConfirmAction = null
}

const handleAction = (room: { id: number; name: string; status: string }) => {
  if (room.status === 'available') {
    openConfirmPopup('Pegar Chave', `Você tem certeza que deseja pegar a chave da sala ${room.name}?`, () => {
      room.status = 'reserved'
    })
  } else if (room.status === 'in_use') {
    openConfirmPopup('Trocar Chave', `Você tem certeza que deseja trocar a chave da sala ${room.name}?`, () => {
      room.status = 'reserved'
    })
  } else if (room.status === 'blocked') {
    alert(`A sala ${room.name} está bloqueada.`)
  } else if (room.status === 'reserved') {
    openConfirmPopup('Devolver Chave', `Você tem certeza que deseja devolver a chave da ${room.name}?`, () => {
      room.status = 'available'
    })
  } else {
    alert(`A sala ${room.name} está indisponível.`)
  }
}

const handleBlock = (room: { id: number; name: string; status: string }) => {
  openConfirmPopup(
    'Bloquear Sala',
    `Você tem certeza que deseja bloquear a sala ${room.name}?`,
    () => {
      room.status = 'blocked'
    }
  )
}

const handleForceDevolution = (room: { id: number; name: string; status: string }) => {
  openConfirmPopup(
    'Forçar Devolução',
    `Você tem certeza que deseja forçar a devolução da sala ${room.name}?`,
    () => {
      room.status = 'available'
    }
  )
}

const handleUnblock = (room: { id: number; name: string; status: string }) => {
  openConfirmPopup('Desbloquear Sala', `Você tem certeza que deseja desbloquear a sala ${room.name}?`, () => {
    room.status = 'available'
  })
}
</script>
